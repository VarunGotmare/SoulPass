// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract SoulPassNFT is ERC721Enumerable, ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    mapping(string => string) public codeToTokenURI;
    mapping(string => mapping(address => bool)) public codeClaimedByWallet;

    constructor(address initialOwner)
        ERC721("SoulPass", "SPASS")
        Ownable(initialOwner)
    {}

    function setClaimCode(string memory code, string memory uri) public onlyOwner {
        require(bytes(codeToTokenURI[code]).length == 0, "Code already exists");
        codeToTokenURI[code] = uri;
    }

    function claimWithCode(string memory code) public {
        require(!codeClaimedByWallet[code][msg.sender], "Already claimed");
        string memory uri = codeToTokenURI[code];
        require(bytes(uri).length > 0, "Invalid code");

        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        nextTokenId++;

        codeClaimedByWallet[code][msg.sender] = true;
    }

    function mintAttendance(address to, string memory uri) public onlyOwner {
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        nextTokenId++;
    }

    // ======================= OVERRIDES =======================

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage, ERC721)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0), "SoulPass: Token is soulbound and non-transferable");
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    // =============== DISABLE TRANSFER/APPROVAL ===============

    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert("SoulPass: approvals disabled");
    }

    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert("SoulPass: approvals disabled");
    }

    function getApproved(uint256) public view override(ERC721, IERC721) returns (address) {
        revert("SoulPass: approvals disabled");
    }

    function isApprovedForAll(address, address) public view override(ERC721, IERC721) returns (bool) {
        revert("SoulPass: approvals disabled");
    }
}
