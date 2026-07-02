import { NavLink } from "react-router-dom";
import { IconBoard, IconBudget, IconVendors, IconGuests, IconSettings } from "./Icons.jsx";

const items = [
  { to: "/", label: "Board", Icon: IconBoard, end: true },
  { to: "/budget", label: "Budget", Icon: IconBudget },
  { to: "/vendors", label: "Vendors", Icon: IconVendors },
  { to: "/guests", label: "Guests", Icon: IconGuests },
  { to: "/settings", label: "Settings", Icon: IconSettings },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, Icon, end }) => (
        <NavLink key={to} to={to} end={end} className="nav-item">
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
