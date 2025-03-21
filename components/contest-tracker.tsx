"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContestCard } from "@/components/contest-card";
import { PlatformFilter } from "@/components/platform-filter";
import { fetchContests } from "@/lib/api";
import type { Contest, Platform } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function ContestTracker() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "codeforces",
    "codechef",
    "leetcode",
  ]);
  const [bookmarkedContests, setBookmarkedContests] = useLocalStorage<string[]>(
    "bookmarkedContests",
    []
  );

  useEffect(() => {
    const getContests = async () => {
      try {
        setLoading(true);
        const data = await fetchContests();
        setContests(data);
      } catch (err) {
        setError("Failed to fetch contests. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getContests();
  }, []);

  const toggleBookmark = (contestId: string) => {
    setBookmarkedContests((prev) => {
      if (prev.includes(contestId)) {
        return prev.filter((id) => id !== contestId);
      } else {
        return [...prev, contestId];
      }
    });
  };

  const filteredContests = contests.filter((contest) =>
    selectedPlatforms.includes(contest.platform)
  );

  const upcomingContests = filteredContests
    .filter((contest) => new Date(contest.startTime) > new Date())
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  const pastContests = filteredContests
    .filter((contest) => new Date(contest.startTime) <= new Date())
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

  const bookmarkedUpcomingContests = upcomingContests.filter((contest) =>
    bookmarkedContests.includes(contest.id)
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading contests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PlatformFilter
        selectedPlatforms={selectedPlatforms}
        onChange={setSelectedPlatforms}
      />

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingContests.length})
          </TabsTrigger>
          <TabsTrigger value="bookmarked">
            Bookmarked ({bookmarkedUpcomingContests.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastContests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {upcomingContests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  isBookmarked={bookmarkedContests.includes(contest.id)}
                  onToggleBookmark={() => toggleBookmark(contest.id)}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No upcoming contests found for the selected platforms.
            </p>
          )}
        </TabsContent>

        <TabsContent value="bookmarked" className="mt-4">
          {bookmarkedUpcomingContests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookmarkedUpcomingContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  isBookmarked={true}
                  onToggleBookmark={() => toggleBookmark(contest.id)}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No bookmarked contests. Bookmark contests to see them here.
            </p>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {pastContests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  isBookmarked={bookmarkedContests.includes(contest.id)}
                  onToggleBookmark={() => toggleBookmark(contest.id)}
                  isPast={true}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No past contests found for the selected platforms.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
