import { Check, Clock, LucideIcon, XCircle } from "lucide-react";

import { TeamStatus } from "@/types/teams";

interface StatusBadgeProps {
  status: TeamStatus;
}

interface StatusConfig {
  color: string;
  icon?: LucideIcon;
  label: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const configs: Record<TeamStatus, StatusConfig> = {
    approved: { color: "text-green-400", icon: Check, label: "Approved" },
    rejected: { color: "text-red-400", icon: XCircle, label: "Rejected" },
    pending: { color: "text-amber-400", icon: Clock, label: "Pending" },
    draft: { color: "text-slate-500", label: "Draft" },
  };
  const config = configs[status] || configs.draft;
  const Icon = config.icon;
  return (
    <span
      className={`flex items-center gap-1 text-xs font-bold ${config.color}`}
    >
      {Icon && <Icon size={12} />} {config.label}
    </span>
  );
};

export default StatusBadge;
