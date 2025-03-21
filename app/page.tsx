import ContestTracker from "@/components/contest-tracker";
import { PlatformFilter } from "@/components/platform-filter";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl">
          Coding Contest Tracker
        </h1>
        <ContestTracker />
      </div>
    </main>
  );
}
