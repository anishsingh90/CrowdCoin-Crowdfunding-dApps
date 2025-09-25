'use server';

import * as campaignService from '@/lib/campaigns';
import { Campaign } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function createCampaignAction(
  owner: string,
  name: string,
  description: string,
  goal: number,
  durationInDays: number
): Promise<Campaign> {
  const newCampaign = await campaignService.createCampaign(owner, name, description, goal, durationInDays);
  revalidatePath('/');
  revalidatePath('/my-campaigns');
  return newCampaign;
}

export async function addTierAction(
  campaignAddress: string,
  name: string,
  description: string,
  amount: number
) {
  const result = await campaignService.addTierToCampaign(campaignAddress, name, description, amount);
  revalidatePath(`/campaigns/${campaignAddress}`);
  return result;
}

export async function fundCampaignAction(
  campaignAddress: string,
  tierId: string,
  backerAddress: string
) {
  const result = await campaignService.fundCampaign(campaignAddress, tierId, backerAddress);
  revalidatePath(`/campaigns/${campaignAddress}`);
  revalidatePath('/');
  return result;
}

export async function withdrawFundsAction(campaignAddress: string) {
    const result = await campaignService.withdrawFunds(campaignAddress);
    revalidatePath(`/campaigns/${campaignAddress}`);
    return result;
}

export async function claimRefundAction(campaignAddress: string, backerAddress: string) {
    const result = await campaignService.claimRefund(campaignAddress, backerAddress);
    revalidatePath(`/campaigns/${campaignAddress}`);
    return result;
}
