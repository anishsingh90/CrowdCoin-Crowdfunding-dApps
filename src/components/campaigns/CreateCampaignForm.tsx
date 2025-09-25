'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createCampaignAction } from '@/app/actions';
import { useWallet } from '@/hooks/use-wallet';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(5, 'Name must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  goal: z.coerce.number().positive('Goal must be a positive number.'),
  durationInDays: z.coerce
    .number()
    .int()
    .min(1, 'Duration must be at least 1 day.')
    .max(90, 'Duration cannot exceed 90 days.'),
});

export default function CreateCampaignForm() {
  const { address, connectWallet } = useWallet();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      goal: 10,
      durationInDays: 30,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to create a campaign.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newCampaign = await createCampaignAction(
        address,
        values.name,
        values.description,
        values.goal,
        values.durationInDays
      );
      toast({
        title: 'Campaign Created!',
        description: `Your campaign "${newCampaign.name}" is now live.`,
      });
      router.push(`/campaigns/${newCampaign.campaignAddress}`);
    } catch (error) {
      toast({
        title: 'Error creating campaign',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Project" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your campaign's title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your project..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of your campaign.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal (ETH)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      The amount you want to raise.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationInDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      How long your campaign will run.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {address ? (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Creating...' : 'Create Campaign'}
              </Button>
            ) : (
              <Button type="button" className="w-full" onClick={connectWallet}>
                Connect Wallet to Create
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
