import { getDueInfo } from "./due";

// Progress/status of a step based on its subtasks and deadline
export function derive(step) {
  const total = step?.subtasks?.length || 0;
  const done = step?.subtasks?.filter((t) => t.done).length || 0;
  const progress = total ? Math.round((done / total) * 100) : 0;

  const overdue = step?.dueDate
    ? getDueInfo(step.dueDate, done === total).overdue
    : false;

  let status = "Not Started";
  if (overdue) status = "Overdue";
  else if (done === 0) status = "Not Started";
  else if (done === total) status = "Completed";
  else status = "In Progress";

  return { progress, status, total, done };
}

// Map domain statuses to UI variants
export function toVariant(status) {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "warning";
    case "Overdue":
      return "error";
    default:
      return "neutral";
  }
}
