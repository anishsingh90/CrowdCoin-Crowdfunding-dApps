import CreateCampaignForm from "@/components/campaigns/CreateCampaignForm";

export default function CreateCampaignPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-foreground">Launch Your Idea</h1>
        <p className="text-muted-foreground mt-2 font-body">
          Fill in the details below to create your crowdfunding campaign.
        </p>
      </div>
      <CreateCampaignForm />
    </div>
  );
}
