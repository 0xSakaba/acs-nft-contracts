// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SonovaACSContract
 * @dev An open edition NFT contract.
 */
contract SonovaACSContract is ERC721Enumerable, Ownable {
    using SafeERC20 for IERC20;

    uint256 public constant MAX_SUPPLY = 1_000_000;
    uint256 public constant MINT_PRICE = 10 ether; // Assuming ERC20 token with 18 decimals
    IERC20 public paymentToken;

    uint256 public startTimestamp;
    uint256 public endTimestamp;
    string private _baseTokenURI;

    // record minted count per wallet
    mapping(address => uint256) private _mintedPerWallet;

    event Minted(address indexed to, uint256 indexed tokenId);
    event Withdrawn(address indexed owner, uint256 amount);

    constructor(
        string memory baseTokenURI,
        address _paymentToken
    ) ERC721("Sonova ACS edition", "SACSE") Ownable(msg.sender) {
        require(_paymentToken != address(0), "Invalid token address");
        paymentToken = IERC20(_paymentToken);

        // 20/02/2025 0AM UTC
        startTimestamp = 1740009600;
        // 30/05/2025 11:59:59 PM UTC
        endTimestamp = 1748649599;
        // max mint per wallet
        _baseTokenURI = baseTokenURI;
    }

    /**
     * @dev mint NFT
     */
    function mint() external {
        // check if start selling and not end
        require(block.timestamp >= startTimestamp, "Sale has not started");
        require(block.timestamp <= endTimestamp, "Sale has ended");

        uint256 newTokenId = totalSupply() + 1;
        // increment minted count
        require(newTokenId <= MAX_SUPPLY, "Max supply reached");

        // Check if user has enough tokens
        require(
            paymentToken.balanceOf(msg.sender) >= MINT_PRICE,
            "Insufficient token balance"
        );
        require(
            paymentToken.allowance(msg.sender, address(this)) >= MINT_PRICE,
            "Token allowance not enough"
        );

        _safeMint(msg.sender, newTokenId);
        _mintedPerWallet[msg.sender]++;

        // Transfer payment
        paymentToken.safeTransferFrom(msg.sender, address(this), MINT_PRICE);

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
     * @dev Withdraw ERC20 tokens to owner
     */
    function withdrawToken() external onlyOwner {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        paymentToken.safeTransfer(owner(), balance);
        emit Withdrawn(owner(), balance);
    }

    /**
     * @dev check each wallet's minted count
     */
    function mintedCount(address wallet) external view returns (uint256) {
        return _mintedPerWallet[wallet];
    }

    /**
     * @dev Check contract's token balance
     */
    function contractPaymentTokenBalance() external view returns (uint256) {
        return paymentToken.balanceOf(address(this));
    }
}
