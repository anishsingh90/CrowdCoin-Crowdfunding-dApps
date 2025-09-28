'use client';

import { useEffect, useState } from 'react';
import CampaignCard from '@/components/campaigns/CampaignCard';
import { Button } from '@/components/ui/button';
import { getUserCampaigns } from '@/lib/campaigns';
import type { Campaign } from '@/lib/types';
import { useWallet } from '@/hooks/use-wallet';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function CampaignsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyCampaignsPage() {
  const { address, connectWallet } = useWallet();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address) {
      setIsLoading(true);
      getUserCampaigns(address).then((userCampaigns) => {
        setCampaigns(userCampaigns);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [address]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl font-headline font-bold text-foreground">
          My Campaigns
        </h1>
        <Button asChild size="lg" className="font-headline">
          <Link href="/create">Create a Campaign</Link>
        </Button>
      </div>

      {!address && !isLoading && (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-card rounded-lg shadow-sm">
          <h2 className="text-2xl font-headline font-semibold text-foreground mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-muted-foreground mb-6">
            Please connect your wallet to view and manage your campaigns.
          </p>
          <Button onClick={connectWallet}>Connect Wallet</Button>
        </div>
      )}

      {address && isLoading && <CampaignsSkeleton />}

      {address && !isLoading && campaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.campaignAddress}
              campaign={campaign}
            />
          ))}
        </div>
      )}

      {address && !isLoading && campaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-card rounded-lg shadow-sm">
          <h2 className="text-2xl font-headline font-semibold text-foreground mb-2">
            No Campaigns Found
          </h2>
          <p className="text-muted-foreground mb-6">
            You haven't created any campaigns yet. Why not start one now?
          </p>
          <Button asChild>
            <Link href="/create">Create Your First Campaign</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
