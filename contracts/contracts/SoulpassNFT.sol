// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol"; // ✅ Import explicitly

contract SoulPassNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor(address initialOwner) ERC721("SoulPass", "SPASS") Ownable(initialOwner) {}

    function mintAttendance(address to, string memory uri) public onlyOwner {
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        nextTokenId++;
    }

    // Soulbound: prevent transfers
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0), "SoulPass: Token is soulbound and non-transferable");
        return super._update(to, tokenId, auth);
    }

    // ✅ Correct overrides for both ERC721 and IERC721
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
