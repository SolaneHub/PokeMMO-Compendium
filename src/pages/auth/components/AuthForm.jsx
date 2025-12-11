const AuthForm = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  isSignup,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-400">
          Email
        </label>
        <input
          type="email"
          className="w-full rounded border border-slate-600 bg-slate-900/50 p-2.5 text-white transition-colors focus:border-pink-500 focus:outline-none"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-400">
          Password
        </label>
        <input
          type="password"
          className="w-full rounded border border-slate-600 bg-slate-900/50 p-2.5 text-white transition-colors focus:border-pink-500 focus:outline-none"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded bg-pink-600 py-2.5 font-bold text-white transition hover:bg-pink-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Processing...
          </span>
        ) : isSignup ? (
          "Sign Up"
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
};
export default AuthForm;
