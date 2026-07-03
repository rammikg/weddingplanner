import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { DataProvider, useData } from "./context/DataContext.jsx";
import { LangProvider } from "./context/LangContext.jsx";
import AuthGate from "./components/AuthGate.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Countdown from "./components/Countdown.jsx";
import Kanban from "./modules/Kanban.jsx";
import Budget from "./modules/Budget.jsx";
import Vendors from "./modules/Vendors.jsx";
import Guests from "./modules/Guests.jsx";
import Settings from "./modules/Settings.jsx";

function Frame() {
  return (
    <div className="shell">
      <main className="app">
        <Countdown />
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

function Root() {
  const { ready, session, isConfigured } = useData();

  if (isConfigured && !session) return <AuthGate />;
  if (!ready) return <div className="loading">Loading…</div>;

  return (
    <Routes>
      <Route element={<Frame />}>
        <Route path="/" element={<Kanban />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/guests" element={<Guests />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <LangProvider>
      <DataProvider>
        <BrowserRouter>
          <Root />
        </BrowserRouter>
      </DataProvider>
    </LangProvider>
  );
}
