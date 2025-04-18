# Tezos Blockchain and IPFS Integration Research

## Overview of Tezos Blockchain

Tezos is an open source, decentralized blockchain network that serves as a platform for executing peer-to-peer transactions and deploying smart contracts. It has gained popularity for NFTs due to its low transaction costs (gas fees) compared to Ethereum and its supportive community environment.

## Music NFT Platforms on Tezos

Several music NFT platforms have been developed on the Tezos blockchain:

### 1. Radion.fm
- One of the first platforms on Tezos to focus exclusively on music
- Focuses on copyright protection by embedding a public hash key into audio files
- Enables direct payments to artists when songs are downloaded or purchased
- Interface similar to Web 2.0 streaming platforms (Spotify, Apple Music)
- Features billboard charts, trending artists, radio stream
- Requires user signup with personal and artist information for music industry compliance
- Artists can select from standard copyright licenses and set secondary sale royalties (up to 20%)
- Uses RADIO as native utility token

### 2. Henradio.xyz
- Born out of the early Tezos NFT platform Hic Et Nunc
- Uses teia.art minting contract
- Simple UI layout with continuous vertical feed showing latest mints
- Stream function plays songs on feed in order
- Allows artists to build playlists
- Designed exclusively for music NFTs
- Easy minting process with cover image upload and royalty settings (10-25%)
- No native utility token

### 3. DNS.xyz
- Started as a profile platform, expanded to focus on Web3 music infrastructure
- Features cross-chain support (Tezos, Ethereum, Polygon)
- Indexes and displays NFTs from various popular minting contracts
- UI/UX similar to social media platform and Soundcloud
- Offers hyperminter and batch transaction cart
- Planning album minting capabilities

### 4. OneOf
- Mainstream-focused NFT platform using Tezos blockchain
- Partnered with major artists and the Grammy Awards
- Different from other platforms as it doesn't strive to be a Web3 music streaming platform
- Uses traditional Web 2.0 style login rather than Web3 crypto wallet

## IPFS Integration with Tezos

The InterPlanetary File System (IPFS) is commonly used with Tezos for storing NFT content, including music files. The integration works as follows:

1. Content (music files, images) is uploaded to IPFS, which generates a unique Content Identifier (CID)
2. The CID is stored in the token's metadata on the Tezos blockchain
3. When accessing the content, applications use the CID to retrieve the file from IPFS

### Creating NFTs on Tezos with IPFS

The process typically involves:

1. Uploading an image/music file to IPFS (can be done through services like Filebase)
2. Getting the IPFS CID for the uploaded content
3. Creating a token using the FA2 standard on Tezos
4. Including the IPFS CID in the token's metadata
5. Minting the token on the Tezos blockchain

## FA2 Token Standard

FA2 is the token standard (TZIP-12) on Tezos that provides an API standard for token transfers, balance inquiries, and managing token metadata. It supports multiple token types including fungible and non-fungible tokens.

Key features of FA2:
- Supports several different token types in a single contract
- Each token type has an ID (if only one type, ID must be 0)
- Allows operators (accounts authorized to transfer tokens on behalf of owners)
- Required entrypoints: transfer, balance_of, update_operators
