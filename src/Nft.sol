// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error Nft__OnlyOneNftAllowed();
error Nft__InvalidCode();

// "awes123" : 1,
// "qwe123" :2,
// "aws142":3,
// "cxz132":4

contract Nft is ERC721 {
    //event
    event NftMinted(
        address indexed buyer,
        string indexed code,
        uint256 indexed tokenId
    );

    //mapping
    mapping(address => uint256) private owner_listing;
    mapping(string => uint256) private code_listing;

    constructor() ERC721("Doggie", "Dog") {
        code_listing["awes123"] = 1;
        code_listing["qwe123"] = 2;
        code_listing["aws142"] = 3;
        code_listing["cxz132"] = 4;
    }

    function claim(string memory code) public {
        //check whether the code is correct or not.
        if (code_listing[code] == 0) {
            revert Nft__InvalidCode(); //Using revert instead of require as it is more gas efficient.
        }
        //Check if the user alredy claimed its NFT.
        if (owner_listing[msg.sender] != 0) {
            revert Nft__OnlyOneNftAllowed();
        }

        uint256 tokenId = code_listing[code];
        _safeMint(msg.sender, tokenId);

        owner_listing[msg.sender] = tokenId;

        emit NftMinted(msg.sender, code, tokenId);
    }

    function getOwner(address nftAddress) public view returns (uint256) {
        return owner_listing[nftAddress];
    }

    function getCode(string memory code) public view returns (uint256) {
        return code_listing[code];
    }
}
