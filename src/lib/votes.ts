export type VoteChoice = 'yes' | 'no';

/**
 * Swap point for a real backend. Pages render the seed probability from
 * content; this store only remembers the visitor's yes/no choice.
 *
 * A Supabase implementation would match VoteStore and replace `voteStore`
 * below. Do not change the displayed percentage from vote counts — that
 * number is the authored seed in the market entry.
 */
export interface VoteStore {
  getVote(marketId: string): Promise<VoteChoice | null>;
  setVote(marketId: string, choice: VoteChoice): Promise<void>;
  clearVote(marketId: string): Promise<void>;
}

export const VOTE_STORAGE_KEY = 'itsjim:votes:v1';

type VoteMap = Record<string, VoteChoice>;

function readAll(): VoteMap {
  try {
    const raw = localStorage.getItem(VOTE_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const votes: VoteMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value === 'yes' || value === 'no') votes[key] = value;
    }
    return votes;
  } catch {
    return {};
  }
}

function writeAll(votes: VoteMap): void {
  localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(votes));
}

export const localVoteStore: VoteStore = {
  async getVote(marketId) {
    return readAll()[marketId] ?? null;
  },
  async setVote(marketId, choice) {
    const votes = readAll();
    votes[marketId] = choice;
    writeAll(votes);
  },
  async clearVote(marketId) {
    const votes = readAll();
    delete votes[marketId];
    writeAll(votes);
  },
};

export const voteStore: VoteStore = localVoteStore;
