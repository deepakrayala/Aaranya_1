import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Mail, Search } from "lucide-react";
import { formatINRPaise, getAdminCustomers, type AdminCustomer } from "@/lib/api/admin";
import { StatusPill } from "./admin.index";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersAdmin,
});

const tiers = ["All", "VIP", "Returning", "New"] as const;

function CustomersAdmin() {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<(typeof tiers)[number]>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const customers = useQuery({
    queryKey: ["admin", "customers", q, tier],
    queryFn: () => getAdminCustomers({ search: q, tier }),
  });

  const list = customers.data?.customers ?? [];
  const selected = useMemo(() => list.find((customer) => customer.id === selectedId) ?? list[0] ?? null, [list, selectedId]);
  const totalLtv = list.reduce((sum, customer) => sum + Number(customer.total_spent_paise), 0);

  return (
    <div className="space-y-6 px-6 py-8 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Customers</h1>
          <p className="mt-1 text-sm text-cream/55">
            {list.length} people - {formatINRPaise(totalLtv)} lifetime value
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-cream/10 bg-[#161310] px-3 py-2 text-sm">
          <Search className="h-4 w-4 text-cream/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email..."
            className="flex-1 bg-transparent text-cream outline-none placeholder:text-cream/40"
          />
        </div>
        <div className="flex gap-1.5">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`rounded-md border px-3 py-1.5 text-xs uppercase tracking-[0.2em] ${
                tier === t ? "border-terra/50 bg-terra/15 text-cream" : "border-cream/10 text-cream/55 hover:bg-cream/[0.04]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {customers.isPending ? (
        <div className="rounded-lg border border-cream/8 bg-[#161310] px-4 py-12 text-center text-sm text-cream/45">Loading customers...</div>
      ) : customers.isError ? (
        <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-4 text-sm text-rose-200">{customers.error.message}</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="overflow-hidden rounded-lg border border-cream/8 bg-[#161310]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream/8 text-[10px] uppercase tracking-[0.22em] text-cream/45">
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">City</th>
                    <th className="px-4 py-3 text-left">Tier</th>
                    <th className="px-4 py-3 text-right">Orders</th>
                    <th className="px-4 py-3 text-right">LTV</th>
                    <th className="px-4 py-3 text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => setSelectedId(customer.id)}
                      className={`cursor-pointer border-b border-cream/5 last:border-0 hover:bg-cream/[0.02] ${
                        selected?.id === customer.id ? "bg-terra/[0.06]" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="text-cream">{customer.name}</div>
                        <div className="text-xs text-cream/45">{customer.email}</div>
                      </td>
                      <td className="px-4 py-3 text-cream/65">{customer.city || "Not set"}</td>
                      <td className="px-4 py-3"><StatusPill status={customer.tier} /></td>
                      <td className="px-4 py-3 text-right">{customer.order_count}</td>
                      <td className="px-4 py-3 text-right">{formatINRPaise(customer.total_spent_paise)}</td>
                      <td className="px-4 py-3 text-cream/55">{new Date(customer.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {list.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-cream/45">No customers match these filters.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-cream/8 bg-[#161310] p-6">
            {selected ? <CustomerDetail customer={selected} /> : (
              <div className="flex h-full items-center justify-center text-center text-sm text-cream/45">
                Select a customer to view details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomerDetail({ customer }: { customer: AdminCustomer }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-cream/45">Customer</div>
          <h2 className="mt-1 font-display text-2xl">{customer.name}</h2>
          <div className="mt-1 text-sm text-cream/55">{customer.email}</div>
        </div>
        <StatusPill status={customer.tier} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <Stat label="Orders" value={String(customer.order_count)} />
        <Stat label="LTV" value={formatINRPaise(customer.total_spent_paise)} />
        <Stat label="AOV" value={formatINRPaise(Math.round(Number(customer.total_spent_paise) / Math.max(1, customer.order_count)))} />
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <Row k="City" v={customer.city || "Not set"} />
        <Row k="Last order" v={customer.last_order_at ? new Date(customer.last_order_at).toLocaleDateString() : "No orders yet"} />
        <Row k="Registered" v={new Date(customer.created_at).toLocaleDateString()} />
        <Row k="Role" v="User" />
      </div>

      <div className="mt-6">
        <a
          href={`mailto:${customer.email}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-terra px-4 py-2 text-xs uppercase tracking-[0.22em] text-umber hover:bg-terra/90"
        >
          <Mail className="h-3.5 w-3.5" /> Send dispatch
        </a>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-cream/8 bg-cream/[0.02] py-3">
      <div className="text-[10px] uppercase tracking-[0.22em] text-cream/45">{label}</div>
      <div className="mt-1 font-display text-lg text-cream">{value}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-cream/8 pb-1.5 text-sm">
      <span className="text-cream/50">{k}</span>
      <span className="text-cream/85">{v}</span>
    </div>
  );
}
