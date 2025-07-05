// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract SoulPassNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    mapping(string => bool) public usedCodes;
    mapping(string => string) public codeToTokenURI;

    constructor(address initialOwner)
        ERC721("SoulPass", "SPASS")
        Ownable(initialOwner)
    {}

    /// @notice Mint directly by the contract owner (manual mint)
    function mintAttendance(address to, string memory uri) public onlyOwner {
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        nextTokenId++;
    }

    /// @notice Preload a code and URI for a future claim
    function setClaimCode(string memory code, string memory uri) public onlyOwner {
        require(!usedCodes[code], "Code already used");
        require(bytes(codeToTokenURI[code]).length == 0, "Code already exists");
        codeToTokenURI[code] = uri;
    }

    /// @notice Allow users to claim a soulbound NFT with a valid code
    function claimWithCode(string memory code) public {
        require(!usedCodes[code], "Code already used");
        string memory uri = codeToTokenURI[code];
        require(bytes(uri).length > 0, "Invalid code");

        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        nextTokenId++;

        usedCodes[code] = true;
    }

    /// @notice Prevent transfers (soulbound enforcement)
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0), "SoulPass: Token is soulbound and non-transferable");
        return super._update(to, tokenId, auth);
    }

    // Disable approvals completely
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
