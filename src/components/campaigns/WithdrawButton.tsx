'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Loader2, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { withdrawFundsAction } from '@/app/actions';

export default function WithdrawButton({ campaignAddress }: { campaignAddress: string }) {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    const result = await withdrawFundsAction(campaignAddress);
    if (result.success) {
      toast({
        title: 'Withdrawal Successful',
        description: result.message,
      });
    } else {
      toast({
        title: 'Withdrawal Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsWithdrawing(false);
  };

  return (
    <Button onClick={handleWithdraw} disabled={isWithdrawing} className="w-full bg-accent hover:bg-accent/90">
      {isWithdrawing ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="mr-2 h-4 w-4" />
      )}
      {isWithdrawing ? 'Withdrawing...' : 'Withdraw Funds'}
    </Button>
  );
}
