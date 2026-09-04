import { useEffect, useState } from 'react';
import { supabase } from './supabase';

const defaultSettings: Record<string, string> = {
  creator_name: 'AccessStore',
  creator_tagline: 'Level Up Your Roblox Experience',
  creator_description: "Welcome to AccessStore — your creator store for gaming gear, merchandise and community picks.",
  youtube_subscribers: '',
  youtube_videos: '',
  youtube_views: '',
  youtube_url: '',
  instagram_url: '',
  discord_url: '',
  business_email: '',
  whatsapp_number: '',
  upi_id: '9958856831@pthdfc',
  support_page_url: '',
  hero_heading: 'Level Up Your Roblox Experience.',
  hero_subheading: 'Gaming gear, creator merchandise and handpicked products for the community.',
};

let cachedSettings: Record<string, string> | null = null;
let fetchPromise: Promise<Record<string, string>> | null = null;

export async function fetchSettings(): Promise<Record<string, string>> {
  if (cachedSettings) return cachedSettings;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (error) throw error;
      const settings: Record<string, string> = { ...defaultSettings };
      for (const row of data || []) {
        try {
          const parsed = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
          settings[row.key] = String(parsed);
        } catch {
          settings[row.key] = String(row.value);
        }
      }
      cachedSettings = settings;
      return settings;
    } catch {
      return defaultSettings;
    }
  })();

  return fetchPromise;
}

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  return settings;
}

export const formatINR = (amount: number): string => {
  return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};
