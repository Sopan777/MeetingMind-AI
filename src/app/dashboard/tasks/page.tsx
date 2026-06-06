"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Calendar, User, GripVertical } from "lucide-react";
import { actionItems, meetings, type ActionItem } from "@/lib/mock-data";

type ColumnId = "todo" | "in-progress" | "review" | "completed";

interface Column {
  id: ColumnId;
  title: string;
  color: string;
  dotColor: string;
}

const columns: Column[] = [
  { id: "todo", title: "To Do", color: "border-t-slate-500", dotColor: "bg-slate-400" },
  { id: "in-progress", title: "In Progress", color: "border-t-primary", dotColor: "bg-primary" },
  { id: "review", title: "Review", color: "border-t-secondary", dotColor: "bg-secondary" },
  { id: "completed", title: "Completed", color: "border-t-emerald-500", dotColor: "bg-emerald-500" },
];

const priorityColors: Record<string, string> = {
  low: "bg-emerald-400",
  medium: "bg-amber-400",
  high: "bg-orange-400",
  critical: "bg-red-400",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<ActionItem[]>(actionItems);

  const getColumnItems = (status: ColumnId) =>
    tasks.filter((t) => t.status === status);

  const getMeetingTitle = (meetingId: string) =>
    meetings.find((m) => m.id === meetingId)?.title || "Unknown";

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggableId
          ? { ...t, status: destination.droppableId as ActionItem["status"] }
          : t
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-slate-400 mt-1">
            {tasks.length} tasks from {meetings.length} meetings
          </p>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((col) => {
            const items = getColumnItems(col.id);
            return (
              <div key={col.id} className={`glass rounded-2xl border-t-2 ${col.color}`}>
                <div className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                      <h3 className="font-semibold text-white text-sm">
                        {col.title}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 bg-dark-100 px-2 py-0.5 rounded-full">
                      {items.length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-2 min-h-[200px] space-y-2 transition-colors rounded-b-2xl ${
                        snapshot.isDraggingOver ? "bg-primary/5" : ""
                      }`}
                    >
                      {items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-dark/80 border border-white/5 rounded-xl p-3 space-y-2 transition-shadow ${
                                snapshot.isDragging
                                  ? "shadow-glow-lg ring-1 ring-primary/30"
                                  : "hover:border-white/10"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mt-0.5 text-slate-600 hover:text-slate-400 cursor-grab"
                                >
                                  <GripVertical className="w-3.5 h-3.5" />
                                </div>
                                <p className="text-sm text-white flex-1 leading-snug">
                                  {item.task}
                                </p>
                              </div>
                              <div className="flex items-center justify-between pl-5">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <User className="w-3 h-3" />
                                    {item.owner.split(" ")[0]}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.deadline).toLocaleDateString(
                                      "en-US",
                                      { month: "short", day: "numeric" }
                                    )}
                                  </div>
                                </div>
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    priorityColors[item.priority]
                                  }`}
                                  title={item.priority}
                                />
                              </div>
                              <p className="text-[10px] text-slate-600 pl-5 truncate">
                                {getMeetingTitle(item.meetingId)}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
