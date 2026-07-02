import { createContext, useContext, useEffect, useState } from "react";
import { supabase, isConfigured } from "../lib/supabase.js";
import {
  demoMembers, demoSettings, demoTasks, demoVendors, demoBudget, demoGuests,
} from "../lib/demoData.js";

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

const genId = (t) => `${t}-${Math.random().toString(36).slice(2, 9)}`;

export function DataProvider({ children }) {
  const [session, setSession] = useState(
    isConfigured ? null : { user: { email: "demo@local" }, demo: true }
  );
  const [ready, setReady] = useState(!isConfigured);

  const [settings, setSettings] = useState(isConfigured ? demoSettings : demoSettings);
  const [members, setMembers] = useState(isConfigured ? [] : demoMembers);
  const [tasks, setTasks] = useState(isConfigured ? [] : demoTasks);
  const [vendors, setVendors] = useState(isConfigured ? [] : demoVendors);
  const [budgetItems, setBudgetItems] = useState(isConfigured ? [] : demoBudget);
  const [guests, setGuests] = useState(isConfigured ? [] : demoGuests);

  const setterFor = (table) =>
    ({
      members: setMembers, tasks: setTasks, vendors: setVendors,
      budget_items: setBudgetItems, guests: setGuests,
    }[table]);

  // --- Auth (real mode only) ---
  useEffect(() => {
    if (!isConfigured) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  async function refetch(table) {
    if (!isConfigured) return;
    if (table === "settings") {
      const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
      if (data) setSettings(data);
      return;
    }
    const order =
      table === "tasks" ? { col: "position", asc: true }
      : table === "guests" ? { col: "name", asc: true }
      : { col: "created_at", asc: true };
    const { data } = await supabase
      .from(table)
      .select("*")
      .order(order.col, { ascending: order.asc });
    setterFor(table)?.(data || []);
  }

  async function loadAll() {
    await Promise.all([
      refetch("settings"), refetch("members"), refetch("tasks"),
      refetch("vendors"), refetch("budget_items"), refetch("guests"),
    ]);
  }

  // --- Load + realtime once signed in (real mode) ---
  useEffect(() => {
    if (!isConfigured || !session) return;
    let channel;
    (async () => {
      await loadAll();
      setReady(true);
      channel = supabase.channel("wedding-os");
      ["settings", "members", "tasks", "vendors", "budget_items", "guests"].forEach(
        (t) =>
          channel.on(
            "postgres_changes",
            { event: "*", schema: "public", table: t },
            () => refetch(t)
          )
      );
      channel.subscribe();
    })();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // --- CRUD (works in both modes) ---
  async function addRow(table, row) {
    if (!isConfigured) {
      setterFor(table)?.((prev) => [
        ...prev,
        { ...row, id: genId(table), created_at: new Date().toISOString() },
      ]);
      return;
    }
    await supabase.from(table).insert(row);
    await refetch(table);
  }

  async function updateRow(table, id, patch) {
    setterFor(table)?.((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
    if (isConfigured) {
      await supabase.from(table).update(patch).eq("id", id);
      await refetch(table);
    }
  }

  async function deleteRow(table, id) {
    setterFor(table)?.((prev) => prev.filter((r) => r.id !== id));
    if (isConfigured) await supabase.from(table).delete().eq("id", id);
  }

  async function addManyGuests(rows) {
    if (!isConfigured) {
      setGuests((prev) => [
        ...prev,
        ...rows.map((r) => ({ ...r, id: genId("guests") })),
      ]);
      return;
    }
    await supabase.from("guests").insert(rows);
    await refetch("guests");
  }

  async function updateSettings(patch) {
    setSettings((prev) => ({ ...prev, ...patch }));
    if (isConfigured) await supabase.from("settings").upsert({ id: 1, ...patch });
  }

  async function signIn(email) {
    if (!isConfigured) return { error: null };
    return supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
  }
  async function signOut() {
    if (isConfigured) await supabase.auth.signOut();
  }

  const value = {
    ready, session, isConfigured,
    settings, members, tasks, vendors, budgetItems, guests,
    addRow, updateRow, deleteRow, addManyGuests, updateSettings,
    signIn, signOut,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
