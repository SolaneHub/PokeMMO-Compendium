import { redirect } from "react-router-dom";

import { getCurrentUser } from "@/firebase/authUtils";
import { getUserTeams } from "@/firebase/services/teamsService";
import { Team } from "@/types/teams";

export interface MyTeamsLoaderData {
  teams: Team[];
  user: any; // We can use User type from firebase
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
