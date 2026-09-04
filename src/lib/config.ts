import { useEffect, useState } from 'react';
import { supabase } from './supabase';

const defaultSettings: Record<string, string> = {
  creator_name: 'BlockMaster',
  creator_tagline: 'Level Up Your Roblox Experience',
  creator_description: "Hey! I'm BlockMaster, a Roblox content creator creating entertaining gaming videos, challenges and community content.",
  youtube_subscribers: '2.5M',
  youtube_videos: '850+',
  youtube_views: '450M+',
  youtube_url: 'https://youtube.com/@blockmaster',
  instagram_url: 'https://instagram.com/blockmaster',
  discord_url: 'https://discord.gg/blockmaster',
  business_email: 'contact@blockmaster.store',
  whatsapp_number: '+91 98765 43210',
  upi_id: 'blockmaster@upi',
  support_page_url: 'https://buymeacoffee.com/blockmaster',
  hero_heading: 'Level Up Your Roblox Experience.',
  hero_subheading: 'Official creator merchandise, gaming gear and exclusive picks for the community.',
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
