import { CheckCircle, Database } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/atoms/Button";
import ErrorBoundary from "@/components/atoms/ErrorBoundary";
import AdminTeamList from "@/components/organisms/AdminTeamList";
import PageLayout from "@/components/templates/PageLayout";
import { useAuth } from "@/context/AuthContext";

const AdminDashboardPage = () => {
  const { loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const tabs = [
    { id: "all", label: "All Teams" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "system", label: "System" },
  ];

  if (authLoading) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }

  return (
    <PageLayout title="Admin Dashboard">
      <div className="mb-8 flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <CheckCircle className="text-blue-400" size={32} />
          Admin Dashboard
        </h1>
        <p className="text-slate-400">Manage user-submitted strategies.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-slate-700 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 pb-3 text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "text-blue-400 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ErrorBoundary>
        {activeTab === "system" ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3 text-blue-400">
                <Database size={24} />
                <h3 className="text-xl font-bold text-white">System Tools</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-slate-700/50 p-4">
                  <div>
                    <h4 className="font-bold text-white">Pokedex Editor</h4>
                    <p className="text-sm text-slate-400">
                      Manage Pokemon data
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/admin/pokedex-editor")}
                    variant="primary"
                    size="sm"
                  >
                    Open
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AdminTeamList status={activeTab} />
        )}
      </ErrorBoundary>
    </PageLayout>
  );
};

export default AdminDashboardPage;
