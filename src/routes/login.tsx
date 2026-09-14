import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { AuthPageShell, authInputClassName } from "@/components/AuthPageShell";
import { AuthApiError, login } from "@/lib/api/auth";
import { currentUserQueryKey } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Login — Aranya" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async ({ user }) => {
      queryClient.setQueryData(currentUserQueryKey, user);
      await navigate({ to: user.role === 1 ? "/admin" : "/" });
    },
    onError: (error) => {
      setFormError(error instanceof AuthApiError ? error.message : "Unable to log in. Please try again.");
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setFormError(null);

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setFormError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setFormError("Enter your password.");
      return;
    }

    loginMutation.mutate({ email: normalizedEmail, password });
    setPassword("");
  }

  return (
    <AuthPageShell
      eyebrow="Return to the ritual"
      title={<>Welcome <em className="not-italic italic text-terra">back.</em></>}
      subtitle="Sign in to keep your Aranya account close at hand."
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-sand/70">Sign in</p>
      <h2 className="mt-2 font-display text-3xl">Your quiet corner.</h2>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
        <div>
          <label htmlFor="login-email" className="text-[10px] uppercase tracking-[0.28em] text-sand/70">Email</label>
          <input id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={authInputClassName} placeholder="you@domain.com" disabled={loginMutation.isPending} />
        </div>
        <div>
          <label htmlFor="login-password" className="text-[10px] uppercase tracking-[0.28em] text-sand/70">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className={authInputClassName} placeholder="Your password" disabled={loginMutation.isPending} />
        </div>

        {formError && <p role="alert" className="rounded-sm border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{formError}</p>}

        <button type="submit" disabled={loginMutation.isPending} className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-cream px-6 py-3.5 text-[12px] uppercase tracking-[0.25em] text-umber transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-60">
          {loginMutation.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <>Enter Aranya <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-cream/60">New to Aranya? <Link to="/signup" className="text-sand underline-offset-4 hover:text-cream hover:underline">Create an account</Link></p>
    </AuthPageShell>
  );
}
