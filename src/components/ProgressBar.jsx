const barColors = {
  success: "bg-green-500",
  warning: "bg-orange-500",
  error: "bg-red-500",
  neutral: "bg-white border border-gray-400",
};

const cx = (...a) => a.filter(Boolean).join(" ");

export default function ProgressBar({
  value = 0,
  status = "neutral",
  className,
}) {
  const pct = Math.max(0, Math.min(100, value));
  const color = barColors[status] ?? barColors.neutral;

  return (
    <div
      className={cx(
        "w-full h-2 rounded bg-gray-100",
        status === "neutral" ? "bg-white border border-gray-400" : "",
        className
      )}
    >
      <div className={cx("h-2 rounded", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}
