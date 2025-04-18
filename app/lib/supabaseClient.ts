"use client";

import { createClient } from '@supabase/supabase-js';
import { MusicTrack } from '../types/MusicTrack';

// Initialize the Supabase client
const supabaseUrl = 'https://qxzmlxrfmwowplrtgpuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4em1seHJmbXdvd3BscnRncHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2OTM1MzYsImV4cCI6MjA1ODI2OTUzNn0.sv_Xad0x2y3vE_uKP4NA0zg0xQfMJBEdrJ3Q2y0tY_Q';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to process IPFS URLs
function processIpfsUrl(url: string): string {
  if (!url) return '/placeholder-album.png';
  
  // If it's already an HTTP URL, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's an IPFS URL, convert it to use a public gateway
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  
  // If it's just a CID, add the IPFS gateway prefix
  if (url.match(/^[a-zA-Z0-9]{46}$/) || url.match(/^Qm[a-zA-Z0-9]{44}$/)) {
    return `https://ipfs.io/ipfs/${url}`;
  }
  
  // Return the original URL if we can't process it
  return url;
}

// Function to fetch music tracks from Supabase
export async function fetchMusicTracksFromSupabase(): Promise<MusicTrack[]> {
  try {
    const { data, error } = await supabase
      .from('audio_nfts')
      .select('*');

    if (error) {
      console.error('Error fetching music tracks from Supabase:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No music tracks found in Supabase');
      return [];
    }

    // Transform the data into MusicTrack objects
    const tracks: MusicTrack[] = data.map((item: any) => ({
      id: item.id,
      title: item.name,
      artist: item.artist_name || item.artist,
      genre: item.genre || '',
      platform: item.platform,
      thumbnailUrl: processIpfsUrl(item.thumbnail_uri),
      audioUrl: processIpfsUrl(item.artifact_uri),
      duration: item.duration || 0,
      uploadedAt: new Date(item.uploaded_at || Date.now()),
      description: item.description || '',
      mood: item.mood || '',
      tokenId: item.token_id,
      contractAddress: item.contract_address,
      mimeType: item.mime_type || '',
      ipfsGateway: item.ipfs_gateway || 'https://ipfs.io/ipfs/'
    }));

    return tracks;
  } catch (error) {
    console.error('Error in fetchMusicTracksFromSupabase:', error);
    return [];
  }
}

// Function to get streaming URL for a track
export async function getStreamingUrl(trackId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('audio_nfts')
      .select('playback_url')
      .eq('id', trackId)
      .single();

    if (error) {
      console.error('Error getting streaming URL:', error);
      return null;
    }

    return data?.playback_url || null;
  } catch (error) {
    console.error('Error in getStreamingUrl:', error);
    return null;
  }
}

// Function to search music tracks
export async function searchMusicTracks(
  query: string,
  fields: string[] = ['title', 'artist']
): Promise<MusicTrack[]> {
  try {
    let searchQuery = supabase
      .from('audio_nfts')
      .select('*');

    // Add search conditions for each field
    fields.forEach(field => {
      const dbField = field === 'title' ? 'name' : field;
      searchQuery = searchQuery.or(`${dbField}.ilike.%${query}%`);
    });

    const { data, error } = await searchQuery;

    if (error) {
      console.error('Error searching music tracks:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data into MusicTrack objects
    const tracks: MusicTrack[] = data.map((item: any) => ({
      id: item.id,
      title: item.name,
      artist: item.artist_name || item.artist,
      genre: item.genre || '',
      platform: item.platform,
      thumbnailUrl: processIpfsUrl(item.thumbnail_uri),
      audioUrl: processIpfsUrl(item.artifact_uri),
      duration: item.duration || 0,
      uploadedAt: new Date(item.uploaded_at || Date.now()),
      description: item.description || '',
      mood: item.mood || '',
      tokenId: item.token_id,
      contractAddress: item.contract_address,
      mimeType: item.mime_type || '',
      ipfsGateway: item.ipfs_gateway || 'https://ipfs.io/ipfs/'
    }));

    return tracks;
  } catch (error) {
    console.error('Error in searchMusicTracks:', error);
    return [];
  }
}

// Function to filter music tracks
export async function filterMusicTracks(
  artist?: string,
  genre?: string,
  platform?: string
): Promise<MusicTrack[]> {
  try {
    let query = supabase.from('audio_nfts').select('*');

    if (artist) {
      query = query.ilike('artist', `%${artist}%`);
    }
    if (genre) {
      query = query.eq('genre', genre);
    }
    if (platform) {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching music tracks:', error);
      throw error;
    }

    return data.map((item: any): MusicTrack => ({
      id: item.id,
      title: item.name,
      artist: item.artist_name || item.artist,
      genre: item.genre || '',
      platform: item.platform,
      thumbnailUrl: processIpfsUrl(item.thumbnail_uri),
      audioUrl: processIpfsUrl(item.artifact_uri),
      duration: item.duration || 0,
      uploadedAt: new Date(item.uploaded_at || Date.now()),
      description: item.description || '',
      mood: item.mood || '',
      tokenId: item.token_id,
      contractAddress: item.contract_address,
      mimeType: item.mime_type || '',
      ipfsGateway: item.ipfs_gateway || 'https://ipfs.io/ipfs/'
    }));
  } catch (error) {
    console.error('Error in filterMusicTracks:', error);
    throw error;
  }
}

// Add a new function to fetch filter options
export async function fetchFilterOptions() {
  try {
    // For Supabase, we need to use a different approach to get distinct values
    const genres = await supabase
      .from('audio_nfts')
      .select('genre')
      .not('genre', 'is', null);

    const moods = await supabase
      .from('audio_nfts')
      .select('mood')
      .not('mood', 'is', null);

    const platforms = await supabase
      .from('audio_nfts')
      .select('platform')
      .not('platform', 'is', null);

    // Process results to get unique values
    const uniqueGenres = [...new Set(genres.data?.map(g => g.genre))];
    const uniqueMoods = [...new Set(moods.data?.map(m => m.mood))];
    const uniquePlatforms = [...new Set(platforms.data?.map(p => p.platform))];

    return {
      genres: uniqueGenres,
      moods: uniqueMoods,
      platforms: uniquePlatforms.length > 0 ? uniquePlatforms : ['HEN', 'OBJKT', 'VERSUM']
    };
  } catch (error) {
    console.error('Error in fetchFilterOptions:', error);
    return {
      genres: ['blues', 'classical', 'country', 'disco', 'hiphop', 'jazz', 'metal', 'pop', 'reggae', 'rock'],
      moods: ['calm', 'energetic', 'neutral'],
      platforms: ['HEN', 'OBJKT', 'VERSUM']
    };
  }
} 