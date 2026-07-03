import { useData } from "../context/DataContext.jsx";

export default function Countdown() {
  const { settings } = useData();
  const date = settings?.wedding_date;
  if (!date) return null;

  const d = new Date(date + "T00:00:00");
  if (isNaN(d)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((d - today) / 86400000);

  let text;
  if (days > 1) text = `${days} days to go`;
  else if (days === 1) text = "Tomorrow! 🎉";
  else if (days === 0) text = "Today! 🎉";
  else text = `Married ${Math.abs(days)} ${Math.abs(days) === 1 ? "day" : "days"} ago 🎉`;

  const nice = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="countdown">
      <span className="cd-ring">💍</span>
      <span className="cd-date">{nice}</span>
      <span className="cd-sep">·</span>
      <span className="cd-days">{text}</span>
    </div>
  );
}
