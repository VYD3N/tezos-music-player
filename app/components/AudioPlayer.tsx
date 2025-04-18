"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MusicTrack } from './PlayerControls';

interface AudioPlayerProps {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  onPlayStateChange: (isPlaying: boolean) => void;
  onTrackEnd: () => void;
  getStreamingUrl?: (trackId: string) => Promise<string>;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlayStateChange,
  onTrackEnd,
  getStreamingUrl
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [audioSrc, setAudioSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Update audio source when track changes
  useEffect(() => {
    async function updateAudioSource() {
      if (!currentTrack) return;
      
      setIsLoading(true);
      
      try {
        // If getStreamingUrl is provided, use it to get the streaming URL
        if (getStreamingUrl) {
          const streamingUrl = await getStreamingUrl(currentTrack.id);
          setAudioSrc(streamingUrl);
        } else {
          // Otherwise, use the track's artifactUri directly
          setAudioSrc(currentTrack.artifactUri);
        }
      } catch (error) {
        console.error('Error getting streaming URL:', error);
        // Fallback to the track's artifactUri
        setAudioSrc(currentTrack.artifactUri);
      } finally {
        setIsLoading(false);
      }
    }
    
    updateAudioSource();
  }, [currentTrack, getStreamingUrl]);
  
  // Update audio element when audio source changes
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing track:', error);
          onPlayStateChange(false);
        });
      }
    }
  }, [audioSrc, isPlaying, onPlayStateChange]);
  
  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing track:', error);
          onPlayStateChange(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, onPlayStateChange]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Format time in MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (volume > 0) {
        setVolume(0);
      } else {
        setVolume(0.7);
      }
    }
  };
  
  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg">
      {currentTrack ? (
        <div className="flex flex-col">
          {isLoading ? (
            <div className="text-center py-2">
              <p className="text-sm text-gray-400">Loading audio...</p>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="flex items-center mb-2">
                <span className="text-xs text-gray-400 w-10">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="audio-progress mx-2 flex-grow"
                />
                <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
              </div>
              
              {/* Volume control */}
              <div className="flex items-center mt-2">
                <button onClick={toggleMute} className="p-2 text-gray-400 hover:text-white">
                  {volume === 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="audio-progress w-24 ml-2"
                />
              </div>
            </>
          )}
          
          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            onDurationChange={() => setDuration(audioRef.current?.duration || 0)}
            onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
            onEnded={onTrackEnd}
            onError={() => onPlayStateChange(false)}
            className="hidden"
          />
        </div>
      ) : (
        <div className="text-center py-2">
          <p className="text-sm text-gray-400">No track selected</p>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
