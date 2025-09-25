'use client';

import { CampaignState, Tier } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { formatEther } from '@/lib/utils';
import { Users } from 'lucide-react';
import FundDialog from './FundDialog';

interface TierCardProps {
  tier: Tier;
  campaignAddress: string;
  campaignState: CampaignState;
}

export default function TierCard({ tier, campaignAddress, campaignState }: TierCardProps) {

  const canFund = campaignState === CampaignState.Active;

  return (
    <Card className="hover:border-primary transition-colors">
      <CardHeader>
        <div className='flex justify-between items-start'>
            <div>
                <CardTitle className="font-headline">{tier.name}</CardTitle>
                <CardDescription className="font-bold text-lg text-primary">{formatEther(tier.amount)}</CardDescription>
            </div>
            <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                <Users className='w-4 h-4' />
                <span>{tier.backers}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground font-body">{tier.description}</p>
      </CardContent>
      <CardFooter>
        <FundDialog tier={tier} campaignAddress={campaignAddress} disabled={!canFund}>
            <Button className="w-full" disabled={!canFund}>
                {canFund ? 'Select Reward' : 'Funding Closed'}
            </Button>
        </FundDialog>
      </CardFooter>
    </Card>
  );
}
