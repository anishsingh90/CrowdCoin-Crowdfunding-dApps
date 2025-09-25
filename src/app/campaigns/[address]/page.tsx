import CampaignDetailsClient from '@/components/campaigns/CampaignDetailsClient';
import { getCampaign } from '@/lib/campaigns';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
  
  // Deterministic image selection based on campaign address
  const imageIndex = parseInt(campaign.campaignAddress.slice(-1), 16) % PlaceHolderImages.length;
  const image = PlaceHolderImages[imageIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 shadow-lg">
        <Image
          src={image.imageUrl}
          alt={campaign.name}
          fill
          className="object-cover"
          data-ai-hint={image.imageHint}
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <CampaignDetailsClient campaign={campaign} />
    </div>
  );
}
