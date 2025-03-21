"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Platform } from "@/lib/types";

interface PlatformFilterProps {
  selectedPlatforms: Platform[];
  onChange: (platforms: Platform[]) => void;
}

export function PlatformFilter({
  selectedPlatforms,
  onChange,
}: PlatformFilterProps) {
  const platforms: { value: Platform; label: string }[] = [
    { value: "codeforces", label: "Codeforces" },
    { value: "codechef", label: "CodeChef" },
    { value: "leetcode", label: "LeetCode" },
  ];

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      // Don't allow deselecting if it's the last selected platform
      if (selectedPlatforms.length > 1) {
        onChange(selectedPlatforms.filter((p) => p !== platform));
      }
    } else {
      onChange([...selectedPlatforms, platform]);
    }
  };

  const selectAll = () => {
    onChange(platforms.map((p) => p.value));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium">Filter by platform:</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Platforms ({selectedPlatforms.length})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Coding Platforms</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {platforms.map((platform) => (
            <DropdownMenuCheckboxItem
              key={platform.value}
              checked={selectedPlatforms.includes(platform.value)}
              onCheckedChange={() => togglePlatform(platform.value)}
            >
              {platform.label}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={selectAll}
          >
            <Check className="mr-2 h-4 w-4" />
            Select All
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <Button
            key={platform.value}
            variant={
              selectedPlatforms.includes(platform.value) ? "default" : "outline"
            }
            size="sm"
            onClick={() => togglePlatform(platform.value)}
            disabled={
              selectedPlatforms.length === 1 &&
              selectedPlatforms.includes(platform.value)
            }
          >
            {platform.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
