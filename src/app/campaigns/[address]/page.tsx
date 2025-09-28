import CampaignDetailsClient from '@/components/campaigns/CampaignDetailsClient';
import { getCampaign } from '@/lib/campaigns';
import { CampaignState } from '@/lib/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function CampaignPage({
  params,
}: {
  params: { address: string };
}) {
  const campaign = await getCampaign(params.address);

  if (!campaign) {
    notFound();
  }

  const imageUrl =
    campaign.state === CampaignState.Active
      ? '/Campaignlive.png'
      : '/Campaignclose.png';
  const imageAlt =
    campaign.state === CampaignState.Active
      ? 'Live campaign image'
      : 'Closed campaign image';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
        />
      </div>
      <CampaignDetailsClient campaign={campaign} />
    </div>
  );
}
