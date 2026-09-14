import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { useCurrentUser } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Aranya Console — Admin" },
      { name: "description", content: "Aranya operations console — orders, products, customers, analytics." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const { data: user, isPending } = useCurrentUser();

  if (isPending) {
    return <div className="min-h-screen bg-[#0e0c0a]" />;
  }

  if (user?.role !== 1) {
    return <Navigate to={user ? "/" : "/login"} />;
  }

  return <AdminShell />;
}
