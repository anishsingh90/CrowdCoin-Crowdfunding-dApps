'use client';

import { Campaign, CampaignState } from '@/lib/types';
import { formatEther, timeLeft } from '@/lib/utils';
import {
  Clock,
  Target,
  Users,
  Award,
  Wallet,
  CheckCircle,
  XCircle,
  PlusCircle,
  FileText,
  User,
} from 'lucide-react';
import { Progress } from '../ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import TierCard from './TierCard';
import { useWallet } from '@/hooks/use-wallet';
import AddTierDialog from './AddTierDialog';
import WithdrawButton from './WithdrawButton';
import { Button } from '../ui/button';
import { claimRefundAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function CampaignDetailsClient({ campaign }: { campaign: Campaign }) {
  const { address } = useWallet();
  const { toast } = useToast();
  const [isRefunding, setIsRefunding] = useState(false);
  
  const isOwner = address === campaign.owner;
  const progress = Math.min((campaign.currentAmount / campaign.goal) * 100, 100);

  const canRefund = campaign.state === CampaignState.Failed &&
                    campaign.backers.some(b => b.address === address && b.totalContribution > 0);

  const handleRefund = async () => {
    if (!address) return;
    setIsRefunding(true);
    const result = await claimRefundAction(campaign.campaignAddress, address);
    if(result.success) {
      toast({ title: 'Success', description: result.message });
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
    setIsRefunding(false);
  }

  const campaignStats = [
    {
      icon: Target,
      label: 'Goal',
      value: formatEther(campaign.goal),
    },
    {
      icon: Award,
      label: 'Raised',
      value: formatEther(campaign.currentAmount),
    },
    {
      icon: Users,
      label: 'Backers',
      value: campaign.tiers.reduce((acc, t) => acc + t.backers, 0).toString(),
    },
    {
      icon: Clock,
      label: 'Time Left',
      value: timeLeft(campaign.deadline),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground -mt-24 relative text-white shadow-2xl p-4 bg-black/10 rounded-lg backdrop-blur-sm">
            {campaign.name}
          </h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>Created by</span>
            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{campaign.owner}</span>
          </div>
        </div>

        <div>
          <Progress value={progress} className="h-3" />
          <p className="mt-2 text-lg">
            <span className="font-bold font-headline">{progress.toFixed(2)}%</span> funded
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <FileText />
              About this project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-base leading-relaxed whitespace-pre-wrap">
              {campaign.description}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Campaign Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaignStats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center text-muted-foreground">
                  <stat.icon className="h-5 w-5 mr-3" />
                  <span>{stat.label}</span>
                </div>
                <span className="font-bold text-foreground">{stat.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {campaign.state === CampaignState.Successful && (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center gap-3">
            <CheckCircle className="h-6 w-6" />
            <p className="font-semibold">This campaign was successful!</p>
          </div>
        )}

        {campaign.state === CampaignState.Failed && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex flex-col gap-3">
             <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6" />
                <p className="font-semibold">This campaign did not meet its goal.</p>
             </div>
             {canRefund && (
                 <Button onClick={handleRefund} disabled={isRefunding} variant="destructive" className="w-full">
                     {isRefunding ? 'Refunding...' : 'Claim Refund'}
                 </Button>
             )}
          </div>
        )}
        
        {isOwner && (
            <Card>
                <CardHeader><CardTitle className="font-headline">Owner Actions</CardTitle></CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {campaign.state === CampaignState.Active && <AddTierDialog campaignAddress={campaign.campaignAddress} />}
                    {campaign.state === CampaignState.Successful && campaign.currentAmount > 0 && <WithdrawButton campaignAddress={campaign.campaignAddress} />}
                    {campaign.state !== CampaignState.Successful && <Button variant="secondary" disabled>Withdraw (not successful)</Button>}
                </CardContent>
            </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-headline">Support this project</h2>
          {campaign.tiers.length > 0 ? (
            campaign.tiers.map((tier) => (
              <TierCard key={tier.id} tier={tier} campaignAddress={campaign.campaignAddress} campaignState={campaign.state} />
            ))
          ) : (
            <p className="text-muted-foreground">This campaign has no reward tiers yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
