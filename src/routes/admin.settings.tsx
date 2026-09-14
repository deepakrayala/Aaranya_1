import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  return (
    <div className="space-y-6 px-6 py-8 md:px-10">
      <div>
        <h1 className="font-display text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-cream/55">Brand, taxes, shipping zones and operator access.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Store" sub="Storefront identity">
          <Row k="Brand name" v="Aranya Botanicals" />
          <Row k="Currency" v="INR — ₹" />
          <Row k="Timezone" v="Asia/Kolkata" />
          <Row k="Public URL" v="aranya.co" />
        </Card>
        <Card title="Operations" sub="Logistics defaults">
          <Row k="Fulfilment" v="In-house · Karnataka" />
          <Row k="Free shipping" v="Orders above ₹ 1,500" />
          <Row k="GST" v="18% inclusive" />
          <Row k="Returns window" v="14 days" />
        </Card>
        <Card title="Notifications" sub="Email + SMS">
          <Row k="Order placed" v="Customer + ops@aranya.co" />
          <Row k="Low-stock alert" v="ops@aranya.co · 50 units" />
          <Row k="Wholesale renewal" v="founders@aranya.co" />
        </Card>
        <Card title="Operators" sub="Studio access">
          <Row k="Founders' Studio" v="Owner · 2FA on" />
          <Row k="Ops · Priya" v="Editor" />
          <Row k="Wholesale · Vikram" v="Viewer" />
        </Card>
      </div>
    </div>
  );
}

function Card({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-cream/8 bg-[#161310] p-6">
      <div className="text-[10px] uppercase tracking-[0.28em] text-cream/45">{sub}</div>
      <div className="mt-1 font-display text-xl">{title}</div>
      <div className="mt-4 space-y-2">{children}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-cream/8 pb-2 text-sm last:border-0">
      <span className="text-cream/55">{k}</span>
      <span className="text-cream/85">{v}</span>
    </div>
  );
}
