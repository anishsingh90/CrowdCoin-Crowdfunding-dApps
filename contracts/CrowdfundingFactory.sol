// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Crowdfunding.sol";

contract CrowdfundingFactory{
    address public owner;
    bool public paused;


    struct CampaignInfo{
        address campaignAddress;
        address owner;
        string name;
        uint256 creationTime;
    }

    CampaignInfo[] public campaigns;
    mapping (address => CampaignInfo[]) public userCampaigns;

    event CampaignCreated(address indexed campaignAddress, address indexed owner, string name, uint256 creationTime);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier notPaused() {
        require(!paused, "Factory is paused");
        _;
    }

    constructor(){
        owner = msg.sender;
    }

    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _goal,
        uint256 _durationInDays
    ) external notPaused returns (address) {
        Crowdfunding newCampaign = new Crowdfunding(
            msg.sender,
            _name,
            _description,
            _goal,
            _durationInDays
        );
        address campaignAddress = address(newCampaign);

        CampaignInfo memory campaign = CampaignInfo({
            campaignAddress: campaignAddress,
            owner: msg.sender,
            name: _name,
            creationTime: block.timestamp
        });

        campaigns.push(campaign);
        userCampaigns[msg.sender].push(campaign);

        emit CampaignCreated(campaignAddress, msg.sender, _name, block.timestamp);
        return campaignAddress;
    }

    function getUsersCampaigns(address _user) external view returns(CampaignInfo[] memory){
        return userCampaigns[_user];
    }

    function getAllCampaigns() external view returns(CampaignInfo[] memory){
        return campaigns;
    }

    function togglePause() external onlyOwner{
        paused = !paused;
    }
}