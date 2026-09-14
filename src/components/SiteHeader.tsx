import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, LayoutDashboard } from "lucide-react";
import { AranyaMark } from "./AranyaMark";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { useCart } from "@/lib/cart";

const links = [
  { to: "/philosophy", label: "Philosophy" },
  { to: "/products", label: "Products" },
  { to: "/lifestyle", label: "Lifestyle" },
  { to: "/rituals", label: "Rituals" },
  { to: "/journal", label: "Journal" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const { count } = useCart();

  function handleLogout(): void {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate({ to: "/" }),
    });
  }

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <Link to="/" className="flex items-center gap-3 text-cream">
          <AranyaMark size={36} className="text-sand" />
          <span className="font-display text-2xl tracking-[0.18em] uppercase">
            aranya
          </span>
        </Link>
        <nav className="hidden items-center gap-10 text-[13px] tracking-[0.2em] uppercase text-cream/80 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="transition hover:text-cream"
              activeProps={{ className: "text-cream" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-[11px] uppercase tracking-[0.18em] text-cream/65 lg:block">{user.name.split(" ")[0]}</span>
              <Link to="/account" className="hidden text-[10px] uppercase tracking-[0.2em] text-cream/80 hover:text-sand sm:inline">Account</Link>
              {user.role === 1 && (
                <Link
                  to="/admin"
                  aria-label="Admin Panel"
                  title="Admin Panel"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 bg-cream/5 text-cream/90 backdrop-blur-sm transition hover:bg-cream/15"
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
              )}
              <button onClick={handleLogout} disabled={logoutMutation.isPending} className="hidden rounded-full border border-cream/20 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-cream/85 transition hover:border-sand/60 hover:text-sand disabled:opacity-60 sm:inline-flex">
                {logoutMutation.isPending ? "Leaving" : "Logout"}
              </button>
            </>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link to="/login" className="text-[10px] uppercase tracking-[0.22em] text-cream/80 transition hover:text-sand">Login</Link>
              <Link to="/signup" className="rounded-full border border-sand/40 bg-sand/10 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-sand transition hover:bg-sand hover:text-umber">Join</Link>
            </div>
          )}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 bg-cream/5 text-cream/90 backdrop-blur-sm transition hover:bg-cream/15"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sand px-1 text-[10px] font-semibold text-umber">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
