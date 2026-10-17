import { redirect } from "react-router-dom";

import { getCurrentUser } from "@/firebase/authUtils";
import { getUserTeams } from "@/firebase/services/teamsService";
import { AppUser } from "@/types/auth";
import { Team } from "@/types/teams";

export interface MyTeamsLoaderData {
  teams: Team[];
  user: AppUser;
  error?: string | null;
}

export async function myTeamsLoader(): Promise<MyTeamsLoaderData | Response> {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/login");
  }

  try {
    const teams = await getUserTeams(user.uid);
    return { teams, user };
  } catch (error) {
    console.error("Failed to fetch user teams:", error);
    return {
      teams: [],
      user,
      error:
        "Failed to load your teams. Please check your network connection and refresh.",
    };
  }
}
