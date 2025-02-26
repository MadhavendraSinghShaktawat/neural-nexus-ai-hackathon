export interface MoodTrend {
  date: string;
  averageRating: number;
  count: number;
}

export interface TagFrequency {
  tag: string;
  count: number;
}

export interface MoodStats {
  overallStats: {
    averageRating: number;
    totalEntries: number;
    highestRating: number;
    lowestRating: number;
  };
  weeklyTrends: MoodTrend[];
  monthlyTrends: MoodTrend[];
  popularTags: TagFrequency[];
} 