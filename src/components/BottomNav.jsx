import { NavLink } from "react-router-dom";
import { IconBoard, IconBudget, IconVendors, IconGuests, IconSettings } from "./Icons.jsx";
import { useLang } from "../context/LangContext.jsx";

const items = [
  { to: "/", key: "nav_board", Icon: IconBoard, end: true },
  { to: "/budget", key: "nav_budget", Icon: IconBudget },
  { to: "/vendors", key: "nav_vendors", Icon: IconVendors },
  { to: "/guests", key: "nav_guests", Icon: IconGuests },
  { to: "/settings", key: "nav_settings", Icon: IconSettings },
];

export default function BottomNav() {
  const { t } = useLang();
  return (
    <nav className="bottom-nav">
      {items.map(({ to, key, Icon, end }) => (
        <NavLink key={to} to={to} end={end} className="nav-item">
          <Icon />
          <span>{t(key)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
