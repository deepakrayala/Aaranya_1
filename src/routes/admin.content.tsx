import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Trash2, X, ExternalLink } from "lucide-react";
import { sitePages as seed, type SitePage } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/content")({
  component: ContentAdmin,
});

function ContentAdmin() {
  const [list, setList] = useState<SitePage[]>(seed);
  const [editing, setEditing] = useState<SitePage | null>(null);
  const [creating, setCreating] = useState(false);

  const remove = (slug: string) => setList((l) => l.filter((p) => p.slug !== slug));
  const upsert = (p: SitePage) =>
    setList((l) => (l.some((x) => x.slug === p.slug) ? l.map((x) => (x.slug === p.slug ? p : x)) : [p, ...l]));

  return (
    <div className="space-y-6 px-6 py-8 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Site content</h1>
          <p className="mt-1 text-sm text-cream/55">
            Every page on aranya.co — edit copy, manage SEO, schedule drafts.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-md bg-terra px-4 py-2 text-xs uppercase tracking-[0.22em] text-umber hover:bg-terra/90"
        >
          <Plus className="h-3.5 w-3.5" /> New page
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-cream/8 bg-[#161310]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream/8 text-[10px] uppercase tracking-[0.22em] text-cream/45">
                <th className="px-4 py-3 text-left">Page</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Views 30d</th>
                <th className="px-4 py-3 text-left">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.slug} className="border-b border-cream/5 last:border-0 hover:bg-cream/[0.02]">
                  <td className="px-4 py-3 text-cream">{p.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-cream/55">{p.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${
                        p.status === "Published"
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                          : "border-cream/15 bg-cream/10 text-cream/60"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{p.views30d.toLocaleString()}</td>
                  <td className="px-4 py-3 text-cream/55">{p.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <a
                        href={p.slug}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded p-1.5 text-cream/55 hover:bg-cream/10 hover:text-cream"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => setEditing(p)}
                        className="rounded p-1.5 text-cream/55 hover:bg-cream/10 hover:text-cream"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => remove(p.slug)}
                        className="rounded p-1.5 text-cream/55 hover:bg-rose-500/15 hover:text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || creating) && (
        <PageDrawer
          initial={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={(p) => {
            upsert(p);
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function PageDrawer({
  initial,
  onSave,
  onClose,
}: {
  initial: SitePage | null;
  onSave: (p: SitePage) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<SitePage>(
    initial ?? {
      slug: "/new-page",
      title: "Untitled page",
      status: "Draft",
      views30d: 0,
      avgTime: "—",
      bounce: 0,
      updatedAt: new Date().toISOString().slice(0, 10),
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-cream/10 bg-[#161310] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-cream/45">
              {initial ? "Edit page" : "Create page"}
            </div>
            <h2 className="mt-1 font-display text-2xl">{form.title}</h2>
          </div>
          <button onClick={onClose} className="rounded p-2 text-cream/60 hover:bg-cream/10">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm">
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} />
          </Field>
          <Field label="Slug">
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inp} />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as SitePage["status"] })}
              className={inp}
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </Field>
          <Field label="Meta description">
            <textarea
              rows={3}
              placeholder="160 characters or less…"
              className={inp}
              defaultValue=""
            />
          </Field>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => onSave({ ...form, updatedAt: new Date().toISOString().slice(0, 10) })}
            className="flex-1 rounded-md bg-terra px-4 py-2.5 text-xs uppercase tracking-[0.22em] text-umber hover:bg-terra/90"
          >
            Save page
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-cream/15 px-4 py-2.5 text-xs uppercase tracking-[0.22em] text-cream/70 hover:bg-cream/5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const inp = "w-full rounded-md border border-cream/10 bg-[#0e0c0a] px-3 py-2 text-cream outline-none focus:border-terra/50";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-cream/45">{label}</span>
      {children}
    </label>
  );
}
