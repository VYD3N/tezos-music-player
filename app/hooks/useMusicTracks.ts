"use client";

import { useState, useEffect } from 'react';
import { MusicTrack } from '../types/MusicTrack';
import { fetchMusicTracksFromSupabase, getStreamingUrl } from '../lib/supabaseClient';

export function useMusicTracks() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        setLoading(true);
        const fetchedTracks = await fetchMusicTracksFromSupabase();
        setTracks(fetchedTracks);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load tracks'));
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, []);

  const getTrackStreamingUrl = async (trackId: string): Promise<string | null> => {
    try {
      return await getStreamingUrl(trackId);
    } catch (err) {
      console.error('Error getting streaming URL:', err);
      return null;
    }
  };

  return {
    tracks,
    loading,
    error,
    getTrackStreamingUrl,
  };
} 