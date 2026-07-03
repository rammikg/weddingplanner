import { useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useData } from "../context/DataContext.jsx";
import {
  KANBAN_COLUMNS, TASK_CATEGORIES, PRIORITIES, PRIORITY_ORDER, isOverdue,
} from "../lib/constants.js";
import Modal from "../components/Modal.jsx";
import { Text, Area, Select, DateField } from "../components/Fields.jsx";

const emptyTask = {
  title: "", description: "", category: "Other", priority: "medium",
  assignee_id: null, status: "todo", due_date: null,
};

const SORTS = [
  { key: "due", label: "Due date" },
  { key: "priority", label: "Priority" },
  { key: "category", label: "Category" },
  { key: "assignee", label: "Assignee" },
];

export default function Kanban() {
  const { tasks, members, addRow, updateRow, deleteRow } = useData();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyTask);
  const [filters, setFilters] = useState({ category: "", assignee: "", priority: "", q: "" });
  const [sortBy, setSortBy] = useState("due");

  const memberName = (id) => members.find((m) => m.id === id)?.name || "";

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.category && t.category !== filters.category) return false;
      if (filters.assignee && t.assignee_id !== filters.assignee) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.q && !(`${t.title} ${t.description}`.toLowerCase().includes(filters.q.toLowerCase())))
        return false;
      return true;
    });
  }, [tasks, filters]);

  const sortFn = useMemo(() => {
    const byPos = (a, b) => (a.position || 0) - (b.position || 0);
    if (sortBy === "priority")
      return (a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9) || byPos(a, b);
    if (sortBy === "category")
      return (a, b) => (a.category || "").localeCompare(b.category || "") || byPos(a, b);
    if (sortBy === "assignee")
      return (a, b) => memberName(a.assignee_id).localeCompare(memberName(b.assignee_id)) || byPos(a, b);
    // default: due date (nulls last), then position
    return (a, b) => {
      const ad = a.due_date || "9999-12-31";
      const bd = b.due_date || "9999-12-31";
      return ad !== bd ? (ad < bd ? -1 : 1) : byPos(a, b);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, members]);

  const byColumn = useMemo(() => {
    const map = Object.fromEntries(KANBAN_COLUMNS.map((c) => [c.key, []]));
    for (const t of filtered) (map[t.status] || map.todo).push(t);
    for (const k of Object.keys(map)) map[k].sort(sortFn);
    return map;
  }, [filtered, sortFn]);

  function openNew(status = "todo") { setDraft({ ...emptyTask, status }); setEditing({}); }
  function openEdit(task) { setDraft({ ...task }); setEditing(task); }
  function save() {
    if (!draft.title.trim()) return;
    if (editing && editing.id) updateRow("tasks", editing.id, draft);
    else {
      const position = Math.max(0, ...tasks.map((t) => t.position || 0)) + 1;
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
    const target = byColumn[newStatus].filter((t) => t.id !== draggableId);
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
          <p className="eyebrow">Workflow</p>
          <h1>Board</h1>
        </div>
        <button className="btn" onClick={() => openNew()}>+ Task</button>
      </header>

      <div className="filters">
        <input className="input filter-search" placeholder="Search tasks…"
          value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} />
        <select className="input" value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
          <option value="">All categories</option>
          {TASK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input" value={filters.assignee}
          onChange={(e) => setFilters((f) => ({ ...f, assignee: e.target.value }))}>
          <option value="">Anyone</option>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select className="input" value={filters.priority}
          onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}>
          <option value="">Any priority</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="input sort-select" value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}>
          {SORTS.map((s) => <option key={s.key} value={s.key}>Sort: {s.label}</option>)}
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
                    <h2>{col.label}</h2>
                    <span className="count">{byColumn[col.key].length}</span>
                  </div>
                  {byColumn[col.key].map((task, i) => (
                    <Draggable draggableId={task.id} index={i} key={task.id}>
                      {(dp, ds) => (
                        <article className={`card ${ds.isDragging ? "dragging" : ""}`}
                          ref={dp.innerRef} {...dp.draggableProps} {...dp.dragHandleProps}
                          onClick={() => openEdit(task)}>
                          <div className="card-top">
                            <span className={`pill prio-${task.priority}`}>{task.priority}</span>
                            {task.category && <span className="tag">{task.category}</span>}
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
                  <button className="add-inline" onClick={() => openNew(col.key)}>+ Add</button>
                </section>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {editing && (
        <Modal title={editing.id ? "Edit task" : "New task"}
          onClose={() => setEditing(null)} onSave={save} onDelete={editing.id ? remove : null}>
          <Text label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
          <Area label="Description" value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} />
          <div className="grid-2">
            <Select label="Column" value={draft.status}
              onChange={(v) => setDraft({ ...draft, status: v })}
              options={KANBAN_COLUMNS.map((c) => ({ value: c.key, label: c.label }))} />
            <Select label="Priority" value={draft.priority}
              onChange={(v) => setDraft({ ...draft, priority: v })} options={PRIORITIES} />
            <Select label="Category" value={draft.category}
              onChange={(v) => setDraft({ ...draft, category: v })} options={TASK_CATEGORIES} />
            <Select label="Assignee" value={draft.assignee_id || ""}
              onChange={(v) => setDraft({ ...draft, assignee_id: v || null })}
              options={[{ value: "", label: "—" }, ...members.map((m) => ({ value: m.id, label: m.name }))]} />
          </div>
          <DateField label="Due date" value={draft.due_date} onChange={(v) => setDraft({ ...draft, due_date: v })} />
        </Modal>
      )}
    </>
  );
}
