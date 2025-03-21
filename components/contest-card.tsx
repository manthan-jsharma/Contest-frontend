"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, Clock } from "lucide-react";
import type { Contest } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";

interface ContestCardProps {
  contest: Contest;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isPast?: boolean;
}

export function ContestCard({
  contest,
  isBookmarked,
  onToggleBookmark,
  isPast = false,
}: ContestCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (isPast) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const startTime = new Date(contest.startTime);

      if (startTime <= now) {
        setTimeRemaining("Started");
        return;
      }

      setTimeRemaining(formatDistanceToNow(startTime, { addSuffix: true }));
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [contest.startTime, isPast]);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "codeforces":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "codechef":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "leetcode":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Badge
            className={cn("capitalize", getPlatformColor(contest.platform))}
          >
            {contest.platform}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onToggleBookmark();
            }}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark
              className={cn(
                "h-5 w-5",
                isBookmarked
                  ? "fill-primary text-primary"
                  : "text-muted-foreground"
              )}
            />
          </Button>
        </div>
        <CardTitle className="line-clamp-2 text-lg">{contest.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(contest.startTime), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
          {!isPast && (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  timeRemaining === "Started"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : ""
                }
              >
                {timeRemaining}
              </Badge>
            </div>
          )}
          {contest.duration && (
            <div className="text-muted-foreground">
              Duration: {Math.round(contest.duration / 60)} minutes
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-20"
          onClick={() => (window.location.href = "https://www.facebook.com")}
        ></Button>

        <Button
          variant="outline"
          size="sm"
          className="gap w-50"
          onClick={() => window.open(contest.url, "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Visit Contest
        </Button>
      </CardFooter>
    </Card>
  );
}
