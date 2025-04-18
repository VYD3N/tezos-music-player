"use client";

import React, { useEffect, useRef } from 'react';
import { MusicTrack } from './PlayerControls';

interface AudioPlayerProps {
  track: MusicTrack | null;
  isPlaying: boolean;
  onEnded: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ track, isPlaying, onEnded }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && track) {
        console.log('Attempting to play track:', {
          name: track.name,
          playbackUrl: track.playbackUrl,
          artifactUri: track.artifactUri,
          mimeType: track.mimeType
        });
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          console.log('Audio element state:', {
            src: audioRef.current?.src,
            readyState: audioRef.current?.readyState,
            error: audioRef.current?.error
          });
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, track]);

  if (!track) return null;

  // Process the URL if it's an IPFS URL
  const processUrl = (url: string, gateway?: string) => {
    if (!url) return '';
    
    // If it's already an HTTP URL, return it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If we have a specific IPFS gateway, use it
    if (gateway) {
      if (url.startsWith('ipfs://')) {
        return url.replace('ipfs://', gateway);
      }
      return `${gateway}${url}`;
    }
    
    // If it's an IPFS URL, convert it to use a public gateway
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    
    // If it's just a CID, add the IPFS gateway prefix
    if (url.match(/^[a-zA-Z0-9]{46}$/) || url.match(/^Qm[a-zA-Z0-9]{44}$/)) {
      return `https://ipfs.io/ipfs/${url}`;
    }
    
    return url;
  };

  // Try playbackUrl first, fall back to artifactUri
  const audioUrl = track.playbackUrl || processUrl(track.artifactUri, track.ipfsGateway);
  console.log('Final audio URL:', audioUrl);

  return (
    <audio
      ref={audioRef}
      src={audioUrl}
      onEnded={onEnded}
      className="hidden"
      controls // Temporarily add controls for debugging
    />
  );
};

export default AudioPlayer; 