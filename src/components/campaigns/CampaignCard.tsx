import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Campaign, CampaignState } from '@/lib/types';
import { formatEther, timeLeft } from '@/lib/utils';
import { Clock, Target, Users, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Badge } from '../ui/badge';

const StateBadge = ({ state }: { state: CampaignState }) => {
  switch (state) {
    case CampaignState.Successful:
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Successful
        </Badge>
      );
    case CampaignState.Failed:
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      );
    case CampaignState.Active:
    default:
      return (
        <Badge variant="secondary">
          <Clock className="mr-1 h-3 w-3" />
          Active
        </Badge>
      );
  }
};

export default function CampaignCard({
  campaign,
  image,
}: {
  campaign: Campaign;
  image: ImagePlaceholder;
}) {
  const progress = Math.min((campaign.currentAmount / campaign.goal) * 100, 100);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-[3/2] w-full">
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-cover"
            data-ai-hint={image.imageHint}
          />
        </div>
        <div className="p-6 pb-2">
            <div className="flex justify-between items-center mb-2">
                <CardTitle className="font-headline text-xl leading-tight">
                    <Link href={`/campaigns/${campaign.campaignAddress}`} className="hover:text-primary transition-colors">
                        {campaign.name}
                    </Link>
                </CardTitle>
                <StateBadge state={campaign.state} />
            </div>
            <CardDescription className="font-body h-10 overflow-hidden text-ellipsis">
                {campaign.description}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-2">
        <div>
          <Progress value={progress} className="h-2" />
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="font-bold text-foreground">
              {formatEther(campaign.currentAmount)}
            </span> raised of {formatEther(campaign.goal)}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <div className="font-bold text-foreground">
                {campaign.tiers.reduce((acc, t) => acc + t.backers, 0)}
              </div>
              <div className="text-muted-foreground">Backers</div>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <div className="font-bold text-foreground">
                {timeLeft(campaign.deadline)}
              </div>
              <div className="text-muted-foreground">Time left</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full font-headline" variant="outline">
          <Link href={`/campaigns/${campaign.campaignAddress}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
