import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { AuthPageShell, authInputClassName } from "@/components/AuthPageShell";
import { AuthApiError, signup } from "@/lib/api/auth";
import { currentUserQueryKey } from "@/hooks/use-auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [{ title: "Create an account — Aranya" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: async ({ user }) => {
      queryClient.setQueryData(currentUserQueryKey, user);
      await navigate({ to: "/" });
    },
    onError: (error) => {
      setFormError(error instanceof AuthApiError ? error.message : "Unable to create your account. Please try again.");
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setFormError(null);

    if (name.trim().length < 2) {
      setFormError("Enter your name.");
      return;
    }
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setFormError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    signupMutation.mutate({ name: name.trim(), email: normalizedEmail, password });
    setPassword("");
  }

  return (
    <AuthPageShell
      eyebrow="Begin your ritual"
      title={<>Make room for <em className="not-italic italic text-terra">wellness.</em></>}
      subtitle="Create an Aranya account to stay close to new harvests, dispatches, and your rituals."
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-sand/70">Create an account</p>
      <h2 className="mt-2 font-display text-3xl">A little more yours.</h2>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
        <div>
          <label htmlFor="signup-name" className="text-[10px] uppercase tracking-[0.28em] text-sand/70">Full name</label>
          <input id="signup-name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className={authInputClassName} placeholder="Ananya Rao" disabled={signupMutation.isPending} />
        </div>
        <div>
          <label htmlFor="signup-email" className="text-[10px] uppercase tracking-[0.28em] text-sand/70">Email</label>
          <input id="signup-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={authInputClassName} placeholder="you@domain.com" disabled={signupMutation.isPending} />
        </div>
        <div>
          <label htmlFor="signup-password" className="text-[10px] uppercase tracking-[0.28em] text-sand/70">Password</label>
          <input id="signup-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={authInputClassName} placeholder="At least 8 characters" disabled={signupMutation.isPending} />
        </div>

        {formError && <p role="alert" className="rounded-sm border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{formError}</p>}

        <button type="submit" disabled={signupMutation.isPending} className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-cream px-6 py-3.5 text-[12px] uppercase tracking-[0.25em] text-umber transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-60">
          {signupMutation.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-cream/60">Already have an account? <Link to="/login" className="text-sand underline-offset-4 hover:text-cream hover:underline">Sign in</Link></p>
    </AuthPageShell>
  );
}
