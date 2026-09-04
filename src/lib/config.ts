import { useEffect, useState } from 'react';
import { API } from './api';

const defaultSettings: Record<string,string> = {
 creator_name:'AccessStore', creator_tagline:'Level Up Your Roblox Experience', creator_description:'Welcome to AccessStore — your creator store for gaming gear, merchandise and community picks.',
 youtube_subscribers:'', youtube_videos:'', youtube_views:'', youtube_url:'', instagram_url:'', discord_url:'', business_email:'', whatsapp_number:'', upi_id:'9958856831@pthdfc', support_page_url:'',
 hero_heading:'Level Up Your Roblox Experience.', hero_subheading:'Gaming gear, creator merchandise and handpicked products for the community.'
};
let cachedSettings:Record<string,string>|null=null;
export async function fetchSettings(){ if(cachedSettings) return cachedSettings; try { const r=await fetch(`${API}/api/settings`); if(r.ok){ const d=await r.json(); cachedSettings={...defaultSettings,...(d.settings||{})}; return cachedSettings; } } catch {} cachedSettings=defaultSettings; return cachedSettings; }
export function useSettings(){ const [settings,setSettings]=useState(defaultSettings); useEffect(()=>{fetchSettings().then(setSettings)},[]); return settings; }
export const formatINR=(amount:number)=>'₹'+Number(amount||0).toLocaleString('en-IN',{maximumFractionDigits:0});
