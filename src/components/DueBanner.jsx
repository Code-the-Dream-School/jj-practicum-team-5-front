export default function DueBanner({
  dueInfo,
  text = "less than 24 hours to the deadline",
}) {
  if (!dueInfo?.dueSoon) return null;
  return (
    <div className="mb-4 rounded-md border border-red-300 bg-orange-50 text-orange-900 text-xs px-3 py-2">
      <span className="font-semibold">Reminder:</span> {text}
      {typeof dueInfo.hoursLeft === "number"
        ? ` (${dueInfo.hoursLeft}h left)`
        : ""}
    </div>
  );
}
