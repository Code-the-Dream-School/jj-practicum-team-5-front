import { getDueInfo } from "./due";

// Progress/status of a step based on subtasks or its own "completed" flag
export function derive(step) {
  const total = step?.subtasks?.length || 0;
  const done = step?.subtasks?.filter((t) => t.done).length || 0;

  let progress, status;

  if (step?.completed) {
    // ✅ completed flag always wins
    progress = 100;
    status = "Completed";
  } else if (total > 0) {
    // derive from subtasks
    progress = Math.round((done / total) * 100);
    if (done === 0) status = "Not Started";
    else if (done === total) status = "Completed";
    else status = "In Progress";
  } else {
    // no subtasks, rely on completed
    progress = 0;
    status = "Not Started";
  }

  // overdue check
  const overdue = step?.dueDate
    ? getDueInfo(step.dueDate, status === "Completed").overdue
    : false;

  if (overdue && status !== "Completed") {
    status = "Overdue";
  }

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
