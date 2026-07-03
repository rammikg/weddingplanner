import { useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useData } from "../context/DataContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import {
  KANBAN_COLUMNS, TASK_CATEGORIES, PRIORITIES, PRIORITY_ORDER, isOverdue,
} from "../lib/constants.js";
import Modal from "../components/Modal.jsx";
import { Text, Area, Select, DateField } from "../components/Fields.jsx";

const emptyTask = {
  title: "", description: "", category: "Other", priority: "medium",
  assignee_id: null, status: "todo", due_date: null,
};
const SORT_KEYS = ["due", "priority", "category", "assignee"];

export default function Kanban() {
  const { tasks, members, addRow, updateRow, deleteRow } = useData();
  const { t } = useLang();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyTask);
  const [filters, setFilters] = useState({ category: "", assignee: "", priority: "", q: "" });
  const [sortBy, setSortBy] = useState("due");

  const memberName = (id) => members.find((m) => m.id === id)?.name || "";
  const catLabel = (c) => { const v = t(`tcat_${c}`); return v === `tcat_${c}` ? c : v; };

  const filtered = useMemo(() => tasks.filter((t2) => {
    if (filters.category && t2.category !== filters.category) return false;
    if (filters.assignee && t2.assignee_id !== filters.assignee) return false;
    if (filters.priority && t2.priority !== filters.priority) return false;
    if (filters.q && !(`${t2.title} ${t2.description}`.toLowerCase().includes(filters.q.toLowerCase())))
      return false;
    return true;
  }), [tasks, filters]);

  const sortFn = useMemo(() => {
    const byPos = (a, b) => (a.position || 0) - (b.position || 0);
    if (sortBy === "priority")
      return (a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9) || byPos(a, b);
    if (sortBy === "category")
      return (a, b) => (a.category || "").localeCompare(b.category || "") || byPos(a, b);
    if (sortBy === "assignee")
      return (a, b) => memberName(a.assignee_id).localeCompare(memberName(b.assignee_id)) || byPos(a, b);
    return (a, b) => {
      const ad = a.due_date || "9999-12-31";
      const bd = b.due_date || "9999-12-31";
      return ad !== bd ? (ad < bd ? -1 : 1) : byPos(a, b);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, members]);

  const byColumn = useMemo(() => {
    const map = Object.fromEntries(KANBAN_COLUMNS.map((c) => [c.key, []]));
    for (const t2 of filtered) (map[t2.status] || map.todo).push(t2);
    for (const k of Object.keys(map)) map[k].sort(sortFn);
    return map;
  }, [filtered, sortFn]);

  function openNew(status = "todo") { setDraft({ ...emptyTask, status }); setEditing({}); }
  function openEdit(task) { setDraft({ ...task }); setEditing(task); }
  function save() {
    if (!draft.title.trim()) return;
    if (editing && editing.id) updateRow("tasks", editing.id, draft);
    else {
      const position = Math.max(0, ...tasks.map((x) => x.position || 0)) + 1;
      addRow("tasks", { ...draft, position });
    }
    setEditing(null);
  }
  function remove() { if (editing?.id) deleteRow("tasks", editing.id); setEditing(null); }

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const newStatus = destination.droppableId;
    const target = byColumn[newStatus].filter((x) => x.id !== draggableId);
    const before = target[destination.index - 1];
    const after = target[destination.index];
    const position = before && after ? (before.position + after.position) / 2
      : before ? before.position + 1
      : after ? after.position - 1 : 0;
    updateRow("tasks", draggableId, { status: newStatus, position });
  }

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("eyebrow_workflow")}</p>
          <h1>{t("title_board")}</h1>
        </div>
        <button className="btn" onClick={() => openNew()}>{t("btn_task")}</button>
      </header>

      <div className="filters">
        <input className="input filter-search" placeholder={t("search_tasks")}
          value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} />
        <select className="input" value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
          <option value="">{t("all_categories")}</option>
          {TASK_CATEGORIES.map((c) => <option key={c} value={c}>{catLabel(c)}</option>)}
        </select>
        <select className="input" value={filters.assignee}
          onChange={(e) => setFilters((f) => ({ ...f, assignee: e.target.value }))}>
          <option value="">{t("anyone")}</option>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select className="input" value={filters.priority}
          onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}>
          <option value="">{t("any_priority")}</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{t(`prio_${p}`)}</option>)}
        </select>
        <select className="input sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          {SORT_KEYS.map((s) => <option key={s} value={s}>{t("sort_prefix")}: {t(`sort_${s}`)}</option>)}
        </select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {KANBAN_COLUMNS.map((col) => (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided, snap) => (
                <section className={`column ${snap.isDraggingOver ? "over" : ""}`}
                  ref={provided.innerRef} {...provided.droppableProps}>
                  <div className="column-head">
                    <h2>{t(`col_${col.key}`)}</h2>
                    <span className="count">{byColumn[col.key].length}</span>
                  </div>
                  {byColumn[col.key].map((task, i) => (
                    <Draggable draggableId={task.id} index={i} key={task.id}>
                      {(dp, ds) => (
                        <article className={`card ${ds.isDragging ? "dragging" : ""}`}
                          ref={dp.innerRef} {...dp.draggableProps} {...dp.dragHandleProps}
                          onClick={() => openEdit(task)}>
                          <div className="card-top">
                            <span className={`pill prio-${task.priority}`}>{t(`prio_${task.priority}`)}</span>
                            {task.category && <span className="tag">{catLabel(task.category)}</span>}
                          </div>
                          <p className="card-title">{task.title}</p>
                          <div className="card-meta">
                            {task.due_date && (
                              <span className={`due ${isOverdue(task.due_date, task.status) ? "overdue" : ""}`}>
                                {isOverdue(task.due_date, task.status) ? "⚠ " : ""}{task.due_date}
                              </span>
                            )}
                            {task.assignee_id && <span className="who">{memberName(task.assignee_id)}</span>}
                          </div>
                        </article>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button className="add-inline" onClick={() => openNew(col.key)}>{t("btn_add_inline")}</button>
                </section>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {editing && (
        <Modal title={editing.id ? t("edit_task") : t("new_task")}
          onClose={() => setEditing(null)} onSave={save} onDelete={editing.id ? remove : null}>
          <Text label={t("f_title")} value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
          <Area label={t("f_description")} value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} />
          <div className="grid-2">
            <Select label={t("f_column")} value={draft.status}
              onChange={(v) => setDraft({ ...draft, status: v })}
              options={KANBAN_COLUMNS.map((c) => ({ value: c.key, label: t(`col_${c.key}`) }))} />
            <Select label={t("f_priority")} value={draft.priority}
              onChange={(v) => setDraft({ ...draft, priority: v })}
              options={PRIORITIES.map((p) => ({ value: p, label: t(`prio_${p}`) }))} />
            <Select label={t("f_category")} value={draft.category}
              onChange={(v) => setDraft({ ...draft, category: v })}
              options={TASK_CATEGORIES.map((c) => ({ value: c, label: catLabel(c) }))} />
            <Select label={t("f_assignee")} value={draft.assignee_id || ""}
              onChange={(v) => setDraft({ ...draft, assignee_id: v || null })}
              options={[{ value: "", label: "—" }, ...members.map((m) => ({ value: m.id, label: m.name }))]} />
          </div>
          <DateField label={t("f_due")} value={draft.due_date} onChange={(v) => setDraft({ ...draft, due_date: v })} />
        </Modal>
      )}
    </>
  );
}
