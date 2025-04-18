"use client";

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = 'https://qxzmlxrfmwowplrtgpuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4em1seHJmbXdvd3BscnRncHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2OTM1MzYsImV4cCI6MjA1ODI2OTUzNn0.sv_Xad0x2y3vE_uKP4NA0zg0xQfMJBEdrJ3Q2y0tY_Q';
const supabase = createClient(supabaseUrl, supabaseKey);

import { MusicTrack } from '../components/PlayerControls';

// Function to process IPFS URLs
function processIpfsUrl(url: string): string {
  if (!url) return 'https://via.placeholder.com/150';
  
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
    // Query the audio_nfts table based on the provided schema
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

    console.log('Fetched tracks from Supabase:', data.length);
    
    // Log a sample of the data to debug thumbnail issues
    if (data.length > 0) {
      console.log('Sample track data:', {
        id: data[0].id,
        name: data[0].name,
        thumbnail_uri: data[0].thumbnail_uri,
        display_uri: data[0].display_uri,
        artifact_uri: data[0].artifact_uri
      });
    }

    // Transform the Supabase data to match our MusicTrack interface
    // Using the exact field names from the provided schema
    return data.map(track => ({
      id: track.id || track.uuid || '',
      name: track.name || 'Unknown Track',
      artist: track.artist || track.artist_name || 'Unknown Artist',
      musicType: track.genre || 'Unknown Genre',
      platform: track.platform || 'Tezos',
      // Process thumbnail URI to ensure it's a valid URL
      thumbnailUri: processIpfsUrl(track.thumbnail_uri) || 
                   processIpfsUrl(track.display_uri) || 
                   'https://via.placeholder.com/150',
      // Process artifact URI for audio playback
      artifactUri: processIpfsUrl(track.playback_url || track.artifact_uri) || '',
      // Additional fields that might be useful
      description: track.description || '',
      duration: track.duration || 0,
      mimeType: track.mime_type || '',
      mood: track.mood || '',
      tokenId: track.token_id || '',
      contractAddress: track.contract_address || '',
    }));
  } catch (error) {
    console.error('Error in fetchMusicTracksFromSupabase:', error);
    return [];
  }
}

// Function to get a streaming URL for a track
export async function getStreamingUrl(trackId: string): Promise<string | null> {
  try {
    // First, get the track details
    const { data: track, error: trackError } = await supabase
      .from('audio_nfts')
      .select('playback_url, artifact_uri, ipfs_gateway')
      .eq('id', trackId)
      .single();

    if (trackError) {
      console.error('Error fetching track details:', trackError);
      return null;
    }

    // If the track has a direct playback_url, process and return it
    if (track.playback_url) {
      return processIpfsUrl(track.playback_url);
    }

    // If the track has an artifact_uri, process and use it
    if (track.artifact_uri) {
      return processIpfsUrl(track.artifact_uri);
    }

    return null;
  } catch (error) {
    console.error('Error in getStreamingUrl:', error);
    return null;
  }
}

// Function to search music tracks
export async function searchMusicTracks(query: string, fields: string[] = ['name', 'artist']): Promise<MusicTrack[]> {
  try {
    // Map our field names to the actual column names in the database
    const fieldMapping: {[key: string]: string} = {
      'name': 'name',
      'artist': 'artist',
      'musicType': 'genre',
      'platform': 'platform'
    };
    
    // Start with a base query
    let supabaseQuery = supabase.from('audio_nfts').select('*');

    // Apply search filters based on the specified fields
    if (query && fields.length > 0) {
      const searchConditions = fields.map(field => {
        // Get the corresponding column name
        const columnName = fieldMapping[field] || field;
        return `${columnName}.ilike.%${query}%`;
      });

      supabaseQuery = supabaseQuery.or(searchConditions.join(','));
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Error searching music tracks:', error);
      throw error;
    }

    // Transform the data to match our MusicTrack interface
    return data.map(track => ({
      id: track.id || track.uuid || '',
      name: track.name || 'Unknown Track',
      artist: track.artist || track.artist_name || 'Unknown Artist',
      musicType: track.genre || 'Unknown Genre',
      platform: track.platform || 'Tezos',
      thumbnailUri: processIpfsUrl(track.thumbnail_uri) || 
                   processIpfsUrl(track.display_uri) || 
                   'https://via.placeholder.com/150',
      artifactUri: processIpfsUrl(track.playback_url || track.artifact_uri) || '',
      description: track.description || '',
      duration: track.duration || 0,
      mimeType: track.mime_type || '',
      mood: track.mood || '',
      tokenId: track.token_id || '',
      contractAddress: track.contract_address || '',
    }));
  } catch (error) {
    console.error('Error in searchMusicTracks:', error);
    return [];
  }
}

// Function to filter music tracks
export async function filterMusicTracks(filters: {
  artist?: string;
  musicType?: string;
  platform?: string;
}): Promise<MusicTrack[]> {
  try {
    // Map our filter names to the actual column names in the database
    const filterMapping: {[key: string]: string} = {
      'artist': 'artist',
      'musicType': 'genre',
      'platform': 'platform'
    };
    
    let query = supabase.from('audio_nfts').select('*');

    // Apply filters using the correct column names
    if (filters.artist) {
      query = query.eq(filterMapping.artist, filters.artist);
    }
    
    if (filters.musicType) {
      query = query.eq(filterMapping.musicType, filters.musicType);
    }
    
    if (filters.platform) {
      query = query.eq(filterMapping.platform, filters.platform);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error filtering music tracks:', error);
      throw error;
    }

    // Transform the data to match our MusicTrack interface
    return data.map(track => ({
      id: track.id || track.uuid || '',
      name: track.name || 'Unknown Track',
      artist: track.artist || track.artist_name || 'Unknown Artist',
      musicType: track.genre || 'Unknown Genre',
      platform: track.platform || 'Tezos',
      thumbnailUri: processIpfsUrl(track.thumbnail_uri) || 
                   processIpfsUrl(track.display_uri) || 
                   'https://via.placeholder.com/150',
      artifactUri: processIpfsUrl(track.playback_url || track.artifact_uri) || '',
      description: track.description || '',
      duration: track.duration || 0,
      mimeType: track.mime_type || '',
      mood: track.mood || '',
      tokenId: track.token_id || '',
      contractAddress: track.contract_address || '',
    }));
  } catch (error) {
    console.error('Error in filterMusicTracks:', error);
    return [];
  }
}

// Export the Supabase client for direct use in components if needed
export { supabase };
