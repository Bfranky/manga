import { StoryData, Profile, CreditLedgerEntry } from "../types/manga";
import { SAMPLE_STORIES } from "../sample-data";

// In-memory persistent state store for seamless out-of-the-box local operation
const globalStore = global as unknown as {
  __MANGA_STORIES__?: Map<string, StoryData>;
  __MANGA_PROFILES__?: Map<string, Profile>;
  __MANGA_LEDGER__?: CreditLedgerEntry[];
};

if (!globalStore.__MANGA_STORIES__) {
  globalStore.__MANGA_STORIES__ = new Map();
  // Prepopulate with sample story
  SAMPLE_STORIES.forEach((story) => {
    globalStore.__MANGA_STORIES__!.set(story.id, story);
  });
}

if (!globalStore.__MANGA_PROFILES__) {
  globalStore.__MANGA_PROFILES__ = new Map();
  globalStore.__MANGA_PROFILES__.set("user-demo", {
    id: "user-demo",
    displayName: "Blessed Mangaka",
    email: "blessed@mangaforge.app",
    credits: 8,
    plan: "mangaka_pro",
    createdAt: new Date().toISOString(),
  });
}

if (!globalStore.__MANGA_LEDGER__) {
  globalStore.__MANGA_LEDGER__ = [
    {
      id: "ledger-init",
      userId: "user-demo",
      delta: 10,
      reason: "Welcome Bonus Credits",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "ledger-story-1",
      userId: "user-demo",
      delta: -2,
      reason: "Generated Story: Shadow Blade",
      storyId: "demo-story-01",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];
}

export const dbService = {
  // Story operations
  async getStory(id: string): Promise<StoryData | null> {
    return globalStore.__MANGA_STORIES__?.get(id) || null;
  },

  async getAllStories(userId?: string): Promise<StoryData[]> {
    const stories = Array.from(globalStore.__MANGA_STORIES__?.values() || []);
    if (!userId) return stories;
    return stories.filter((s) => s.userId === userId || s.userId === "user-demo");
  },

  async saveStory(story: StoryData): Promise<StoryData> {
    story.updatedAt = new Date().toISOString();
    globalStore.__MANGA_STORIES__?.set(story.id, story);
    return story;
  },

  async deleteStory(id: string): Promise<boolean> {
    return globalStore.__MANGA_STORIES__?.delete(id) || false;
  },

  // Profile & Credits
  async getProfile(userId = "user-demo"): Promise<Profile> {
    let profile = globalStore.__MANGA_PROFILES__?.get(userId);
    if (!profile) {
      profile = {
        id: userId,
        displayName: "Mangaka Creator",
        email: "user@mangaforge.app",
        credits: 5,
        plan: "free",
        createdAt: new Date().toISOString(),
      };
      globalStore.__MANGA_PROFILES__?.set(userId, profile);
    }
    return profile;
  },

  async updateCredits(userId = "user-demo", delta: number, reason: string, storyId?: string): Promise<number> {
    const profile = await this.getProfile(userId);
    profile.credits = Math.max(0, profile.credits + delta);
    globalStore.__MANGA_PROFILES__?.set(userId, profile);

    globalStore.__MANGA_LEDGER__?.unshift({
      id: `ledger-${Date.now()}`,
      userId,
      delta,
      reason,
      storyId,
      createdAt: new Date().toISOString(),
    });

    return profile.credits;
  },

  async getLedger(userId = "user-demo"): Promise<CreditLedgerEntry[]> {
    return (globalStore.__MANGA_LEDGER__ || []).filter((e) => e.userId === userId);
  },
};
