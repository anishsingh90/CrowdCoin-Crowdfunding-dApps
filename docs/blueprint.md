# **App Name**: CrowdCoin

## Core Features:

- Create Campaign: Allow users to create crowdfunding campaigns with details such as name, description, goal, and duration, using the CrowdfundingFactory contract.
- Campaign Listing: Display a list of all active crowdfunding campaigns, fetched from the CrowdfundingFactory contract, with key details.
- User Campaigns: Display campaigns created by a specific user, fetched from the CrowdfundingFactory contract.
- Fund Campaign: Enable users to contribute to a campaign by selecting a tier and sending the corresponding amount of Ether using the Crowdfunding contract's fund function.
- Campaign Details: Show detailed information about a selected campaign, including its name, description, goal, deadline, owner, and current state, fetched from the Crowdfunding contract.
- Tier Management: Allow the campaign owner to add and remove tiers using the Crowdfunding contract's addTier and removeTier functions.
- Withdraw Funds: Enable the campaign owner to withdraw funds if the campaign is successful using the Crowdfunding contract's withdraw function.

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to convey trust and innovation in the crowdfunding space.
- Background color: A light, desaturated blue (#E0F7FA) to provide a clean and calming backdrop.
- Accent color: An energetic orange (#FF9800) to highlight calls to action and important information.
- Headline font: 'Poppins' (sans-serif) for a modern and geometric look, perfect for headlines and short descriptions.
- Body font: 'PT Sans' (sans-serif) as it combines a modern look and warmth, for the longer form text in the Campaign Details.
- Use clean, outlined icons to represent different aspects of crowdfunding campaigns (e.g., fundraising goals, deadlines, backers).
- Use a card-based layout to present campaign information in a clear and organized manner.