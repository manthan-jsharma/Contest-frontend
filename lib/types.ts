export type Platform = "codeforces" | "codechef" | "leetcode";

export interface Contest {
  id: string;
  name: string;
  url: string;
  platform: Platform;
  startTime: string;
  endTime?: string;
  duration?: number; // in seconds
}
