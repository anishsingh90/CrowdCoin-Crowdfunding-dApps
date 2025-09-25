'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Tier } from '@/lib/types';
import { formatEther } from '@/lib/utils';
import { useWallet } from '@/hooks/use-wallet';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { fundCampaignAction } from '@/app/actions';
import { Loader2 } from 'lucide-react';

interface FundDialogProps {
  tier: Tier;
  campaignAddress: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function FundDialog({ tier, campaignAddress, children, disabled }: FundDialogProps) {
  const { address, connectWallet } = useWallet();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isFunding, setIsFunding] = useState(false);

  const handleFund = async () => {
    if (!address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to fund a campaign.',
        variant: 'destructive',
      });
      return;
    }

    setIsFunding(true);
    const result = await fundCampaignAction(campaignAddress, tier.id, address);

    if (result.success) {
      toast({
        title: 'Contribution Successful!',
        description: result.message,
      });
      setIsOpen(false);
    } else {
      toast({
        title: 'Contribution Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsFunding(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">Confirm Your Contribution</DialogTitle>
          <DialogDescription>
            You are about to contribute to this campaign by selecting the "{tier.name}" tier.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center p-4 rounded-lg bg-muted">
            <span className="text-muted-foreground">Tier</span>
            <span className="font-bold">{tier.name}</span>
          </div>
          <div className="flex justify-between items-center p-4 rounded-lg bg-muted">
            <span className="text-muted-foreground">Contribution Amount</span>
            <span className="font-bold text-primary">{formatEther(tier.amount)}</span>
          </div>
          {address ? (
            <div className="flex justify-between items-center p-4 rounded-lg bg-muted">
              <span className="text-muted-foreground">Your Wallet</span>
              <span className="font-mono text-sm">{address}</span>
            </div>
          ) : (
            <p className="text-center text-destructive">Your wallet is not connected.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          {address ? (
            <Button onClick={handleFund} disabled={isFunding}>
              {isFunding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isFunding ? 'Processing...' : `Fund ${formatEther(tier.amount)}`}
            </Button>
          ) : (
            <Button onClick={connectWallet}>Connect Wallet</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
