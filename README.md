# Tezos Music Player

A web-based music player for NFT audio tracks on the Tezos blockchain. Built with Next.js, React, and Supabase.

## Features

- 🎵 Play audio NFTs from the Tezos blockchain
- 🔍 Advanced search functionality
- 🏷️ Filter by genre, mood, and platform (HEN, OBJKT, VERSUM)
- 📊 Audio characteristics filtering (tempo, energy, danceability)
- 📱 Responsive design with Tailwind CSS
- 📋 Playlist management
- 🎨 Modern and intuitive user interface

## Tech Stack

- Next.js
- React
- TypeScript
- Supabase
- Tailwind CSS
- IPFS integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/VYD3N/tezos-music-player.git
cd tezos-music-player
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses a Supabase database with the following main table:

### audio_nfts
- id (uuid)
- name (text)
- artist (text)
- genre (text)
- mood (text)
- platform (text)
- duration (double precision)
- playback_url (text)
- thumbnail_uri (text)
- display_uri (text)
- artifact_uri (text)
- description (text)
- token_id (text)
- contract_address (text)
- mime_type (text)
- ipfs_gateway (text)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the Tezos blockchain community
- Powered by Supabase
- IPFS integration for decentralized storage 