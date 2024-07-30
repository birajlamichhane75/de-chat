// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Dappcord is ERC721 {
    address public owner;
    uint256 public channelId = 0;
    uint256 public totalSupply = 0;

    struct Channel {
        uint256 id;
        string name;
        uint256 cost;
    }

    mapping(uint256 => Channel) public channels;
    mapping(uint256 => mapping(address => bool)) public hasJoined;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function createChannel(string memory _name, uint256 _cost) public {
        channelId++;
        Channel memory channel = Channel(channelId, _name, _cost);
        channels[channelId] = channel;
    }

    function getChannel(uint256 _id) public view returns(Channel memory){
        return channels[_id];
    }

    function mint(uint256 _id) public payable{
        totalSupply++;
        // Mint nfts
        _safeMint(msg.sender, totalSupply);
        // Join channel
        hasJoined[_id][msg.sender] = true;
    }

    function withdraw() public {
        (bool success,) = owner.call{value:address(this).balance}("");
        require(success);
    }
}
