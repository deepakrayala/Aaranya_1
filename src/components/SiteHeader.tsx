import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";

const navItems = [
  { to: "/philosophy", label: "Philosophy" },
  { to: "/products", label: "Products" },
  { to: "/lifestyle", label: "Lifestyle" },
  { to: "/rituals", label: "Rituals" },
  { to: "/journal", label: "Journal" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const closeMenu = () => setMobileOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout.mutateAsync();
  };

  return (
    <header className="relative z-50 border-b border-cream/8 bg-[#0e0c0a]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="font-display text-xl tracking-[0.18em] text-cream"
        >
          ARANYA
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[10px] uppercase tracking-[0.2em] text-cream/55 transition hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop account actions */}
        <div className="hidden items-center gap-5 sm:flex">
          {user ? (
            <>
              <Link
                to="/account"
                className="text-[10px] uppercase tracking-[0.2em] text-cream/55 transition hover:text-cream"
              >
                Account
              </Link>

              {user.role === 1 && (
                <Link
                  to="/admin"
                  className="text-[10px] uppercase tracking-[0.2em] text-terra transition hover:text-cream"
                >
                  Admin
                </Link>
              )}

              <button
                type="button"
                onClick={() => void handleLogout()}
                disabled={logout.isPending}
                className="text-[10px] uppercase tracking-[0.2em] text-cream/55 transition hover:text-cream disabled:opacity-50"
              >
                {logout.isPending ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[10px] uppercase tracking-[0.2em] text-cream/55 transition hover:text-cream"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="text-[10px] uppercase tracking-[0.2em] text-cream/55 transition hover:text-cream"
              >
                Join
              </Link>
            </>
          )}
        </div>

        {/* Right side: cart + mobile menu */}
        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            onClick={closeMenu}
            aria-label="Shopping cart"
            className="text-cream/65 transition hover:text-cream"
          >
            <ShoppingBag className="h-5 w-5" />
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="text-cream/65 transition hover:text-cream md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-cream/8 bg-[#0e0c0a] md:hidden">
          <nav className="px-6 py-5">
            <div className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className="border-b border-cream/8 py-4 text-[11px] uppercase tracking-[0.2em] text-cream/65 transition hover:text-cream"
                >
                  {item.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    to="/account"
                    onClick={closeMenu}
                    className="border-b border-cream/8 py-4 text-[11px] uppercase tracking-[0.2em] text-cream/65 transition hover:text-cream"
                  >
                    Account
                  </Link>

                  {user.role === 1 && (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="border-b border-cream/8 py-4 text-[11px] uppercase tracking-[0.2em] text-terra"
                    >
                      Admin
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    disabled={logout.isPending}
                    className="py-4 text-left text-[11px] uppercase tracking-[0.2em] text-cream/65 transition hover:text-cream disabled:opacity-50"
                  >
                    {logout.isPending ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="border-b border-cream/8 py-4 text-[11px] uppercase tracking-[0.2em] text-cream/65 transition hover:text-cream"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="py-4 text-[11px] uppercase tracking-[0.2em] text-cream/65 transition hover:text-cream"
                  >
                    Join
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
