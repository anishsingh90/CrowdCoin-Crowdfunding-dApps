export enum CampaignState {
  Active,
  Successful,
  Failed,
}

export interface Tier {
  id: string;
  name: string;
  amount: number;
  backers: number;
  description: string;
}

export interface Backer {
  address: string;
  totalContribution: number;
  fundedTiers: string[]; // array of tier ids
}

export interface Campaign {
  campaignAddress: string;
  owner: string;
  name: string;
  description: string;
  goal: number;
  deadline: number; // unix timestamp
  state: CampaignState;
  tiers: Tier[];
  currentAmount: number;
  backers: Backer[];
}
