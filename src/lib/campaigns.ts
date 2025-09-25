'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Campaign, CampaignState, Tier, Backer } from './types';

const MOCK_OWNER_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const MOCK_USER_ADDRESS_2 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

let campaigns: Campaign[] = [
  {
    campaignAddress: '0xCampaign1',
    owner: MOCK_OWNER_ADDRESS,
    name: 'Eco-Friendly Smartwatch',
    description:
      'A stylish smartwatch made from recycled materials. Features include heart rate monitoring, GPS, and a 2-week battery life. Join us in making tech sustainable.',
    goal: 50,
    deadline: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
    state: CampaignState.Active,
    currentAmount: 27,
    tiers: [
      { id: 't1-1', name: 'Early Bird', amount: 0.1, backers: 120, description: 'Get one smartwatch at a special early price.' },
      { id: 't1-2', name: 'Standard', amount: 0.15, backers: 100, description: 'The standard package for one smartwatch.' },
      { id: 't1-3', name: 'Couple Pack', amount: 0.25, backers: 25, description: 'Two smartwatches for you and a partner.' },
    ],
    backers: [],
  },
  {
    campaignAddress: '0xCampaign2',
    owner: MOCK_USER_ADDRESS_2,
    name: 'Indie Video Game: "Cosmic Drift"',
    description: 'A story-driven RPG set in a vast, explorable galaxy. Your choices shape the narrative. Help us bring this universe to life with a captivating soundtrack and beautiful art.',
    goal: 25,
    deadline: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60, // 60 days
    state: CampaignState.Active,
    currentAmount: 15,
    tiers: [
      { id: 't2-1', name: 'Digital Copy', amount: 0.02, backers: 500, description: 'A digital copy of the game on release.' },
      { id: 't2-2', name: 'Soundtrack Bundle', amount: 0.03, backers: 150, description: 'Game + Digital Soundtrack.' },
      { id: 't2-3', name: 'Become an NPC', amount: 0.5, backers: 10, description: 'Get immortalized in the game as a non-playable character.' },
    ],
    backers: [],
  },
  {
    campaignAddress: '0xCampaign3',
    owner: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    name: 'Open Source AI Assistant',
    description: 'We are building a privacy-focused, open-source AI assistant that runs locally on your device. Your data stays with you. Support the future of private AI.',
    goal: 100,
    deadline: Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60, // 15 days
    state: CampaignState.Successful,
    currentAmount: 112,
    tiers: [
        { id: 't3-1', name: 'Supporter', amount: 0.01, backers: 1000, description: 'Your name in the contributors list.' },
        { id: 't3-2', name: 'Developer Access', amount: 0.1, backers: 120, description: 'Early access to the developer APIs and source code.' },
    ],
    backers: [],
  },
  {
    campaignAddress: '0xCampaign4',
    owner: MOCK_OWNER_ADDRESS,
    name: 'Community Art Mural',
    description: 'A project to create a large-scale public mural in the city center, designed and painted by local artists and community members.',
    goal: 10,
    deadline: Math.floor(Date.now() / 1000) - 5 * 24 * 60 * 60, // Ended 5 days ago
    state: CampaignState.Failed,
    currentAmount: 3,
    tiers: [{ id: 't4-1', name: 'Contributor', amount: 0.01, backers: 300, description: 'Contribute to the art supplies.' }],
    backers: [{ address: MOCK_OWNER_ADDRESS, totalContribution: 0.01, fundedTiers: ['t4-1']}],
  },
];

// --- "READ" functions ---

export const getAllCampaigns = async (): Promise<Campaign[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return JSON.parse(JSON.stringify(campaigns));
};

export const getCampaign = async (address: string): Promise<Campaign | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const campaign = campaigns.find((c) => c.campaignAddress === address);
  return campaign ? JSON.parse(JSON.stringify(campaign)) : undefined;
};

export const getUserCampaigns = async (userAddress: string): Promise<Campaign[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return JSON.parse(JSON.stringify(campaigns.filter((c) => c.owner === userAddress)));
};

// --- "WRITE" functions (Server Actions) ---

export const createCampaign = async (
  owner: string,
  name: string,
  description: string,
  goal: number,
  durationInDays: number
): Promise<Campaign> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newCampaign: Campaign = {
    campaignAddress: `0xCampaign${campaigns.length + 1}`,
    owner,
    name,
    description,
    goal,
    deadline: Math.floor(Date.now() / 1000) + durationInDays * 24 * 60 * 60,
    state: CampaignState.Active,
    currentAmount: 0,
    tiers: [],
    backers: [],
  };

  campaigns.unshift(newCampaign);
  revalidatePath('/');
  revalidatePath('/my-campaigns');
  
  return newCampaign;
};

export const fundCampaign = async (
  campaignAddress: string,
  tierId: string,
  backerAddress: string
): Promise<{success: boolean, message: string}> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const campaign = campaigns.find((c) => c.campaignAddress === campaignAddress);
  if (!campaign) return { success: false, message: 'Campaign not found' };

  const tier = campaign.tiers.find((t) => t.id === tierId);
  if (!tier) return { success: false, message: 'Tier not found' };

  if(campaign.state !== CampaignState.Active) return { success: false, message: 'Campaign is not active' };

  campaign.currentAmount += tier.amount;
  tier.backers++;

  let backer = campaign.backers.find(b => b.address === backerAddress);
  if (backer) {
    backer.totalContribution += tier.amount;
    backer.fundedTiers.push(tier.id);
  } else {
    campaign.backers.push({ address: backerAddress, totalContribution: tier.amount, fundedTiers: [tier.id] });
  }

  if (campaign.currentAmount >= campaign.goal) {
    campaign.state = CampaignState.Successful;
  }
  
  revalidatePath(`/campaigns/${campaignAddress}`);
  return { success: true, message: `Successfully funded ${tier.name}!`};
};

export const addTierToCampaign = async (
  campaignAddress: string,
  name: string,
  description: string,
  amount: number
): Promise<{success: boolean, message: string}> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const campaign = campaigns.find((c) => c.campaignAddress === campaignAddress);
  if (!campaign) return { success: false, message: 'Campaign not found' };

  const newTier: Tier = {
    id: `t${campaign.campaignAddress.slice(-1)}-${campaign.tiers.length + 1}`,
    name,
    description,
    amount,
    backers: 0
  };

  campaign.tiers.push(newTier);
  revalidatePath(`/campaigns/${campaignAddress}`);
  return { success: true, message: `Tier "${name}" added successfully.` };
};

export const withdrawFunds = async (campaignAddress: string): Promise<{success: boolean, message: string}> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const campaign = campaigns.find((c) => c.campaignAddress === campaignAddress);
  if (!campaign) return { success: false, message: 'Campaign not found' };

  if (campaign.state !== CampaignState.Successful) {
    return { success: false, message: 'Campaign is not successful' };
  }
  
  const withdrawnAmount = campaign.currentAmount;
  campaign.currentAmount = 0;

  revalidatePath(`/campaigns/${campaignAddress}`);
  return { success: true, message: `Successfully withdrew ${withdrawnAmount} ETH.` };
};

export const claimRefund = async(campaignAddress: string, backerAddress: string): Promise<{success: boolean, message: string}> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const campaign = campaigns.find((c) => c.campaignAddress === campaignAddress);
    if (!campaign) return { success: false, message: 'Campaign not found' };

    if (campaign.state !== CampaignState.Failed) {
      return { success: false, message: 'Refunds not available' };
    }

    const backer = campaign.backers.find(b => b.address === backerAddress);
    if (!backer || backer.totalContribution === 0) {
      return { success: false, message: 'No contribution to refund' };
    }

    const refundAmount = backer.totalContribution;
    backer.totalContribution = 0;

    revalidatePath(`/campaigns/${campaignAddress}`);
    return { success: true, message: `Successfully refunded ${refundAmount} ETH.` };
}
