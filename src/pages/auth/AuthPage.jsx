import { useActionState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthForm from "@/pages/auth/components/AuthForm";
import GoogleSignInButton from "@/pages/auth/components/GoogleSignInButton";
import PageTitle from "@/shared/components/PageTitle";
import { useToast } from "@/shared/components/ToastNotification";
import { useAuth } from "@/shared/context/AuthContext";

const AuthPage = ({ isSignup = false }) => {
  const navigate = useNavigate();
  const showToast = useToast();
  const { signup, login, googleSignIn } = useAuth();

  const handleAuth = async (previousState, formData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      if (isSignup) {
        await signup(email, password);
        showToast("Account created successfully!", "success");
      } else {
        await login(email, password);
        showToast("Logged in successfully!", "success");
      }
      navigate("/my-teams");
      return { success: true };
    } catch (error) {
      console.error(error);
      let message = error.message;
      if (error.code === "auth/email-already-in-use")
        message = "Email already in use.";
      if (error.code === "auth/wrong-password") message = "Incorrect password.";
      if (error.code === "auth/user-not-found") message = "User not found.";
      showToast(message, "error");
      return { success: false, error: message };
    }
  };

  const [, formAction, isPending] = useActionState(handleAuth, null);

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
    <div className="flex min-h-full flex-col items-center justify-center p-4 sm:p-8">
      <PageTitle title={isSignup ? "Sign Up" : "Login"} />

      <div className="animate-fade-in w-full max-w-md rounded-2xl border border-white/5 bg-[#1a1b20] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isSignup
              ? "Join the community and build your ultimate teams"
              : "Sign in to access your saved strategies"}
          </p>
        </div>

        <AuthForm
          action={formAction}
          isPending={isPending}
          isSignup={isSignup}
        />

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="mx-4 text-xs font-medium text-slate-400 uppercase">
            Or continue with
          </span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <GoogleSignInButton onClick={handleGoogleSignIn} />

        <p className="mt-8 text-center text-sm text-slate-400">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            to={isSignup ? "/login" : "/signup"}
            className="font-medium text-blue-400 transition-colors hover:text-blue-300 hover:underline"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
