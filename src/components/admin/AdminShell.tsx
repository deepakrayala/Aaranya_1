import { useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { AranyaMark } from "@/components/AranyaMark";
import { useCurrentUser } from "@/hooks/use-auth";

type NavItem = {
  to: string;
  label: string;
  icon: any;
  exact?: boolean;
};

const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FileText },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/content", label: "Site Content", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function initialsForName(name: string | undefined): string {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return "??";
}

export function AdminShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const path = useRouterState({
    select: (s) => s.location.pathname,
  });

  const { data: user } = useCurrentUser();

  const current =
    nav.find((n) =>
      n.exact ? path === n.to : path.startsWith(n.to),
    )?.label ?? "Admin";

  const initials = initialsForName(user?.name);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0e0c0a] text-cream">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden w-[248px] shrink-0 flex-col border-r border-cream/8 bg-[#161310] md:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <AranyaMark size={28} className="text-sand" />

          <div className="leading-tight">
            <div className="font-display text-lg tracking-[0.18em] uppercase">
              aranya
            </div>

            <div className="text-[10px] uppercase tracking-[0.28em] text-cream/40">
              Console
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="flex items-center gap-2 rounded-md border border-cream/10 bg-cream/[0.03] px-3 py-2 text-xs text-cream/50">
            <Search className="h-3.5 w-3.5" />

            <span>Search…</span>

            <span className="ml-auto rounded border border-cream/10 px-1.5 py-0.5 text-[10px]">
              ⌘K
            </span>
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-1 px-3">
          <div className="px-3 pb-2 text-[10px] uppercase tracking-[0.28em] text-cream/35">
            Workspace
          </div>

          {nav.map((item) => {
            const Icon = item.icon;

            const active = item.exact
              ? path === item.to
              : path.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to as any}
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-terra/15 text-cream"
                    : "text-cream/60 hover:bg-cream/[0.04] hover:text-cream"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    active ? "text-terra" : "text-cream/45"
                  }`}
                />

                {item.label}

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-terra" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="m-4 rounded-md border border-cream/10 bg-cream/[0.03] p-4">
          <div className="text-[10px] uppercase tracking-[0.28em] text-cream/40">
            Signed in
          </div>

          <div className="mt-2 font-display text-base">
            {user?.name ?? "Signed in"}
          </div>

          <div className="text-xs text-cream/50">
            {user?.email ?? ""}
          </div>

          <Link
            to="/"
            className="mt-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-terra/90 hover:text-terra"
          >
            View site
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-cream/8 bg-[#0e0c0a]/85 px-4 py-4 backdrop-blur md:px-6">
          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            aria-label={
              mobileMenuOpen ? "Close admin menu" : "Open admin menu"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-md border border-cream/10 p-2 text-cream/60 transition hover:bg-cream/[0.05] hover:text-cream md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>

          <div className="flex items-baseline gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-cream/40">
              Console
            </span>

            <ChevronRight className="h-3 w-3 text-cream/30" />

            <span className="font-display text-lg">{current}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-md border border-cream/10 p-2 text-cream/60 transition hover:bg-cream/[0.05] hover:text-cream"
            >
              <Bell className="h-4 w-4" />
            </button>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terra/30 text-xs font-semibold text-cream">
              {initials}
            </div>
          </div>
        </header>

        {/* MOBILE ADMIN MENU */}
        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-[65px] z-20 border-b border-cream/10 bg-[#161310] shadow-2xl md:hidden">
            <div className="px-4 py-5">
              <div className="mb-4 flex items-center gap-3 border-b border-cream/8 px-2 pb-5">
                <AranyaMark size={30} className="text-sand" />

                <div className="leading-tight">
                  <div className="font-display text-lg tracking-[0.18em] uppercase">
                    aranya
                  </div>

                  <div className="text-[9px] uppercase tracking-[0.28em] text-cream/40">
                    Console
                  </div>
                </div>
              </div>

              <div className="mb-3 px-3 text-[10px] uppercase tracking-[0.28em] text-cream/35">
                Workspace
              </div>

              <nav className="space-y-1">
                {nav.map((item) => {
                  const Icon = item.icon;

                  const active = item.exact
                    ? path === item.to
                    : path.startsWith(item.to);

                  return (
                    <Link
                      key={item.to}
                      to={item.to as any}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm transition ${
                        active
                          ? "bg-terra/15 text-cream"
                          : "text-cream/60 hover:bg-cream/[0.04] hover:text-cream"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          active ? "text-terra" : "text-cream/45"
                        }`}
                      />

                      {item.label}

                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-terra" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-5 border-t border-cream/8 pt-4">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between rounded-md px-3 py-3 text-[11px] uppercase tracking-[0.22em] text-terra/90 transition hover:bg-cream/[0.04] hover:text-terra"
                >
                  View site
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
