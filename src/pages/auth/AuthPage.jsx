import { useNavigate } from "react-router-dom";

import GoogleSignInButton from "@/components/molecules/GoogleSignInButton";
import PageLayout from "@/components/templates/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
const AuthPage = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const { googleSignIn } = useAuth();
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      showToast("Logged in with Google!", "success");
      navigate("/my-teams");
    } catch (error) {
      showToast("Google Sign In failed.", "error");
    }
  };
  return (
    <PageLayout
      title="Sign In"
      containerClassName="flex items-center justify-center min-h-[60vh]"
    >
      {" "}
      <div className="animate-fade-in w-full max-w-md rounded-2xl border border-white/5 bg-[#1a1b20] p-8 shadow-2xl">
        {" "}
        <div className="mb-8 text-center">
          {" "}
          <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
            {" "}
            Welcome{" "}
          </h1>{" "}
          <p className="mt-2 text-sm">
            {" "}
            Sign in to access your saved teams and strategies{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex flex-col gap-4">
          {" "}
          <GoogleSignInButton onClick={handleGoogleSignIn} />{" "}
        </div>{" "}
      </div>{" "}
    </PageLayout>
  );
};
export default AuthPage;
