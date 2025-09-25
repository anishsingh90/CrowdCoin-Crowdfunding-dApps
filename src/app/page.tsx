import CampaignCard from '@/components/campaigns/CampaignCard';
import { Button } from '@/components/ui/button';
import { getAllCampaigns } from '@/lib/campaigns';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default async function Home() {
  const campaigns = await getAllCampaigns();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl font-headline font-bold text-foreground">
          Explore Campaigns
        </h1>
        <Button asChild size="lg" className="font-headline">
          <Link href="/create">Create a Campaign</Link>
        </Button>
      </div>

      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign, index) => (
            <CampaignCard
              key={campaign.campaignAddress}
              campaign={campaign}
              image={PlaceHolderImages[index % PlaceHolderImages.length]}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-card rounded-lg shadow-sm">
          <h2 className="text-2xl font-headline font-semibold text-foreground mb-2">
            No Campaigns Yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Be the first to start a new crowdfunding journey on CrowdCoin.
          </p>
          <Button asChild>
            <Link href="/create">Create Your First Campaign</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
