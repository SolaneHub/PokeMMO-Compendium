import { redirect } from "react-router-dom";

import { getCurrentUser } from "@/firebase/authUtils";
import { getUserTeams } from "@/pages/my-teams/services/teamsService";
import { Team } from "@/pages/my-teams/types/teams";
import { AppUser } from "@/types/auth";

export interface MyTeamsLoaderData {
  teams: Team[];
  user: AppUser;
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
    // You could throw an error or return an empty list
    return { teams: [], user };
  }
}
