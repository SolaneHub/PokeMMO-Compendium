import { Loader2, Lock, Mail } from "lucide-react";

const AuthForm = ({ action, isPending, isSignup, recaptchaToken }) => {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">
          Email
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-5 w-5 text-slate-500" />
          </div>
          <input
            name="email"
            type="email"
            className="w-full rounded-lg border border-white/10 bg-[#0f1014] py-2.5 pr-4 pl-10 text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">
          Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-5 w-5 text-slate-500" />
          </div>
          <input
            name="password"
            type="password"
            className="w-full rounded-lg border border-white/10 bg-[#0f1014] py-2.5 pr-4 pl-10 text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isPending || !recaptchaToken}
        className="mt-2 flex w-full items-center justify-center rounded-lg bg-blue-600 py-2.5 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-700 hover:shadow-blue-900/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : isSignup ? (
          "Create Account"
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default AuthForm;
