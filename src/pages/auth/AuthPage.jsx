import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthForm from "@/pages/auth/components/AuthForm";
import GoogleSignInButton from "@/pages/auth/components/GoogleSignInButton";
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

        <AuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          onSubmit={handleAuth}
          isSignup={isSignup}
        />

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-slate-600"></div>
          <span className="mx-4 text-sm text-slate-500">OR</span>
          <div className="flex-grow border-t border-slate-600"></div>
        </div>

        <GoogleSignInButton onClick={handleGoogleSignIn} />

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
