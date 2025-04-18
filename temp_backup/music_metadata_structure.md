# Music Metadata Structure on Tezos

## Token Metadata Standards

Tezos uses several standards for token metadata:

1. **TZIP-12 (FA2)**: The main token standard on Tezos that supports multiple token types including fungible and non-fungible tokens.

2. **TZIP-16**: Describes the format of contract metadata, which provides information about the token contract itself.

3. **TZIP-21**: Describes rich token metadata format specifically for tokens, including NFTs.

## Music NFT Metadata Structure

For music NFTs on Tezos, the metadata typically follows the TZIP-21 standard with specific attributes relevant to music. The metadata is stored in JSON format and linked to the token on the blockchain.

### Key Metadata Attributes for Music NFTs

1. **Basic Attributes**:
   - `name`: The name of the music track/album
   - `description`: Description of the music
   - `decimals`: Always set to `0` for NFTs
   - `isBooleanAmount`: Always set to `true` for NFTs

2. **Media-Related Attributes**:
   - `artifactUri`: The link to the actual music file (MP3, WAV, etc.) typically stored on IPFS
   - `displayUri`: The link to the album cover or artwork image
   - `thumbnailUri`: The link to a smaller version of the artwork for thumbnails
   - `formats`: Can specify the media format details (audio/mp3, audio/wav, etc.)

3. **Music-Specific Attributes**:
   - `artist`: The musician or band name
   - `genre` or `musicType`: The genre or type of music
   - `platform`: The platform where the music was originally released
   - `duration`: Length of the track
   - `releaseDate`: When the music was released
   - `bpm`: Beats per minute (for electronic music)
   - `license`: Copyright information

### Example Music NFT Metadata JSON

```json
{
  "name": "Song Title",
  "description": "Description of the song",
  "decimals": "0",
  "isBooleanAmount": true,
  "artifactUri": "ipfs://QmSongFileIPFSHash",
  "displayUri": "ipfs://QmAlbumCoverIPFSHash",
  "thumbnailUri": "ipfs://QmThumbnailIPFSHash",
  "formats": [
    {
      "uri": "ipfs://QmSongFileIPFSHash",
      "mimeType": "audio/mp3"
    },
    {
      "uri": "ipfs://QmAlbumCoverIPFSHash",
      "mimeType": "image/jpeg"
    }
  ],
  "attributes": [
    {
      "name": "artist",
      "value": "Artist Name"
    },
    {
      "name": "genre",
      "value": "Electronic"
    },
    {
      "name": "platform",
      "value": "Radion.fm"
    },
    {
      "name": "duration",
      "value": "3:45"
    },
    {
      "name": "releaseDate",
      "value": "2025-01-15"
    }
  ]
}
```

## Storage and Retrieval Process

1. **Storage Process**:
   - Music files are uploaded to IPFS, generating a unique Content Identifier (CID)
   - Metadata JSON file is created with references to the IPFS CIDs
   - Metadata file is also uploaded to IPFS, generating its own CID
   - The metadata CID is stored in the token's metadata on the Tezos blockchain

2. **Retrieval Process**:
   - Applications query the Tezos blockchain for token information
   - The metadata CID is retrieved from the token
   - The metadata JSON is fetched from IPFS using the CID
   - Music files and images are fetched from IPFS using the CIDs in the metadata

## Platform-Specific Implementations

Different music NFT platforms on Tezos may implement additional metadata fields or have specific requirements:

### Radion.fm
- Embeds a public hash key into audio files for copyright protection
- Requires standard copyright license information
- Supports secondary sale royalties (up to 20%)

### Henradio.xyz
- Simple metadata structure focusing on audio files and cover images
- Supports secondary sales royalties (10-25%)

### DNS.xyz
- Cross-chain support with metadata compatible across Tezos, Ethereum, and Polygon
- Supports album minting with related tracks grouped together

## Accessing Music NFTs via APIs

To build a music player that can access music NFTs on Tezos:

1. Query the Tezos blockchain for FA2 tokens with music-related metadata
2. Filter tokens based on metadata attributes (artist, music type, platform)
3. Display thumbnailUri images alongside song names
4. Use artifactUri to access and play the actual music files

This structure allows for a flexible and extensible music player that can work with various music NFT implementations on the Tezos blockchain.
