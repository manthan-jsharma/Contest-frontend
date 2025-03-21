import type { Contest } from "./types";
export async function fetchContests(): Promise<Contest[]> {
  try {
    const response = await fetch("http://localhost:5000/api/contests");
    if (!response.ok) {
      throw new Error("Failed to fetch contests ");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching contests:", error);
    throw error;
  }
}

export async function toggleBookmark(
  email: string,
  contestId: string
): Promise<string[]> {
  try {
    const response = await fetch("http://localhost:5000/api/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, contestId }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle bookmark");
    }

    const data = await response.json();
    return data.bookmarkedContests;
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw error;
  }
}

export async function getBookmarkedContests(email: string): Promise<string[]> {
  try {
    const response = await fetch(
      `http://localhost:5000/api/bookmarks/${email}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch bookmarks");
    }

    const data = await response.json();
    return data.bookmarkedContests;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}
