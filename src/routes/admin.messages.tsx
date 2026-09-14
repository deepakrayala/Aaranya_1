import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, RefreshCw } from "lucide-react";
import { getAdminContactMessages } from "@/lib/api/messages";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessages,
});

function AdminMessages() {
  const messages = useQuery({
    queryKey: ["admin", "contact-messages"],
    queryFn: getAdminContactMessages,
  });

  if (messages.isPending) {
    return (
      <div className="px-6 py-8 md:px-10">
        <div className="text-sm text-cream/55">
          Loading messages...
        </div>
      </div>
    );
  }

  if (messages.isError) {
    return (
      <div className="px-6 py-8 md:px-10">
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-5">
          <div className="text-sm text-rose-300">
            Unable to load messages.
          </div>

          <button
            type="button"
            onClick={() => messages.refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-cream/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cream/70 transition hover:bg-cream/[0.05] hover:text-cream"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const contactMessages = messages.data.messages;

  return (
    <div className="space-y-8 px-6 py-8 md:px-10">
      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-terra" />

            <span className="text-[10px] uppercase tracking-[0.28em] text-cream/45">
              Customer communication
            </span>
          </div>

          <h1 className="mt-2 font-display text-3xl">
            Messages
          </h1>

          <p className="mt-1 text-sm text-cream/55">
            Contact messages from registered customers.
          </p>
        </div>

        <div className="rounded-full border border-cream/10 bg-cream/[0.03] px-4 py-2 text-xs text-cream/55">
          {contactMessages.length}{" "}
          {contactMessages.length === 1 ? "message" : "messages"}
        </div>
      </div>

      {/* EMPTY STATE */}
      {contactMessages.length === 0 ? (
        <div className="rounded-lg border border-cream/8 bg-[#161310] px-6 py-16 text-center">
          <Mail className="mx-auto h-8 w-8 text-cream/25" />

          <h2 className="mt-4 font-display text-xl">
            No messages yet
          </h2>

          <p className="mt-2 text-sm text-cream/45">
            Customer contact messages will appear here.
          </p>
        </div>
      ) : (
        /* MESSAGES */
        <div className="space-y-4">
          {contactMessages.map((message) => (
            <article
              key={message.id}
              className="rounded-lg border border-cream/8 bg-[#161310] p-5 md:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                {/* CUSTOMER */}
                <div>
                  <div className="font-display text-xl text-cream">
                    {message.name}
                  </div>

                  <div className="mt-1 text-sm text-cream/50">
                    {message.email}
                  </div>

                  {message.account_name && (
                    <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-terra/80">
                      Account: {message.account_name}
                    </div>
                  )}
                </div>

                {/* DATE */}
                <div className="text-xs text-cream/40 lg:text-right">
                  {new Date(message.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Kolkata",
                  })}
                </div>
              </div>

              {/* SUBJECT */}
              <div className="mt-5">
                <span className="inline-flex rounded-full border border-sand/20 bg-sand/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-sand">
                  {message.subject}
                </span>
              </div>

              {/* MESSAGE */}
              <div className="mt-5 border-t border-cream/8 pt-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-cream/70">
                  {message.message}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
