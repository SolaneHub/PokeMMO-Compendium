import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageTitle from "@/shared/components/PageTitle";
import { useToast } from "@/shared/components/ToastNotification";
import { useAuth } from "@/shared/context/AuthContext";

const AuthPage = ({ isSignup = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();
  const { signup, login, googleSignIn } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, password);
        showToast("Account created successfully!", "success");
      } else {
        await login(email, password);
        showToast("Logged in successfully!", "success");
      }
      navigate("/my-teams");
    } catch (error) {
      console.error(error);
      let message = error.message;
      if (error.code === "auth/email-already-in-use")
        message = "Email already in use.";
      if (error.code === "auth/wrong-password") message = "Incorrect password.";
      if (error.code === "auth/user-not-found") message = "User not found.";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      showToast("Logged in with Google!", "success");
      navigate("/my-teams");
    } catch (error) {
      console.error(error);
      showToast("Google Sign In failed.", "error");
    }
  };

  return (
    <div className="animate-fade-in flex h-full flex-col items-center justify-center p-8 text-slate-200">
      <PageTitle title={isSignup ? "Sign Up" : "Login"} />
      <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-8 shadow-xl">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
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

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-slate-600"></div>
          <span className="mx-4 text-sm text-slate-500">OR</span>
          <div className="flex-grow border-t border-slate-600"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded border border-slate-600 bg-white py-2.5 font-bold text-slate-900 transition hover:bg-slate-100 active:scale-[0.98]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            to={isSignup ? "/login" : "/signup"}
            className="font-medium text-pink-400 transition-colors hover:text-pink-300 hover:underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
