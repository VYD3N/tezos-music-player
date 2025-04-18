export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  platform: string;
  thumbnailUrl: string;
  audioUrl: string;
  duration: number;
  uploadedAt: Date;
  description?: string;
  mood?: string;
  tokenId?: string;
  contractAddress?: string;
  mimeType?: string;
  ipfsGateway?: string;
} 