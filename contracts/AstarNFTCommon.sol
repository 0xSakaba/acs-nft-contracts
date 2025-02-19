// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AstarNFTCommon
 * @dev An example of an open edition NFT contract.
 */
contract AstarNFTCommon is ERC721Enumerable, Ownable {
    uint256 public startTimestamp;
    uint256 public endTimestamp;

    uint256 public maxMintPerWallet;

    string private _baseTokenURI;

    // record minted count per wallet
    mapping(address => uint256) private _mintedPerWallet;

    event Minted(address indexed to, uint256 indexed tokenId);

    constructor(
        string memory baseTokenURI
    ) ERC721("Astar Expansion: Soneium Genesis", "AESG") Ownable(msg.sender) {
        // 18/02/2025 11PM UTC
        startTimestamp = 1739919600;
        // 25/02/2025 11PM UTC
        endTimestamp = 1740524400;
        // max mint per wallet
        maxMintPerWallet = 1;
        _baseTokenURI = baseTokenURI;
    }

    /**
     * @dev mint NFT
     */
    function mint() external {
        // check if start selling and not end
        require(block.timestamp >= startTimestamp, "Sale has not started");
        require(block.timestamp <= endTimestamp, "Sale has ended");

        require(
            _mintedPerWallet[msg.sender] < maxMintPerWallet,
            "Max mint limit reached for wallet"
        );

        uint256 newTokenId = totalSupply() + 1;
        _safeMint(msg.sender, newTokenId);

        // increment minted count
        _mintedPerWallet[msg.sender]++;

        emit Minted(msg.sender, newTokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _baseTokenURI;
    }

    /**
     * @dev owner can set the base URI
     */
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        _baseTokenURI = _newBaseURI;
    }

    /**
     * @dev withdraw the contract balance
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev owner can set the end timestamp
     */
    function setEndTimestamp(uint256 _setEndTimestamp) external onlyOwner {
        endTimestamp = _setEndTimestamp;
    }

    /**
     * @dev owner can set the end timestamp
     */
    function setStartTimestamp(uint256 _setStartTimestamp) external onlyOwner {
        startTimestamp = _setStartTimestamp;
    }

    /**
     * @dev check each wallet's minted count
     */
    function mintedCount(address wallet) external view returns (uint256) {
        return _mintedPerWallet[wallet];
    }

    /**
     * @dev set max mint per wallet
     */
    function setMaxMintPerWallet(uint256 _maxMint) external onlyOwner {
        maxMintPerWallet = _maxMint;
    }
}
