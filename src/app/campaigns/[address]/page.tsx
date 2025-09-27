import CampaignDetailsClient from '@/components/campaigns/CampaignDetailsClient';
import { getCampaign } from '@/lib/campaigns';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <CampaignDetailsClient campaign={campaign} />
    </div>
  );
}
