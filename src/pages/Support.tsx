import {useMemo,useState} from 'react';
import {ArrowLeft,Check, Coffee, Copy, ExternalLink, Heart, IndianRupee, Smartphone} from 'lucide-react';
import {Link} from 'react-router-dom';
import {formatINR,useSettings} from '@/lib/config';

const PRESETS=[50,100,200,500,1000];

export default function Support(){
 const settings=useSettings();
 const [selected,setSelected]=useState<number>(100);
 const [custom,setCustom]=useState('');
 const [copied,setCopied]=useState(false);
 const amount=selected===0?Number(custom):selected;
 const upi=String(settings.upi_id||'').trim();
 const creator=String(settings.creator_name||'AccessStore').trim();
 const valid=Number.isFinite(amount)&&amount>0;
 const upiLink=useMemo(()=>valid&&upi?`upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(creator)}&am=${amount.toFixed(2)}&cu=INR`:'' ,[amount,creator,upi,valid]);
 const qr=upiLink?`https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(upiLink)}`:'';
 const copy=async()=>{if(!upi)return;try{await navigator.clipboard.writeText(upi);setCopied(true);setTimeout(()=>setCopied(false),1800)}catch{}};
 return <div className="min-h-screen bg-[#07090f] text-white px-4 py-10 sm:py-16">
  <div className="max-w-3xl mx-auto">
   <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold mb-8"><ArrowLeft size={17}/> Back to AccessStore</Link>
   <div className="rounded-[32px] border border-amber-400/20 bg-gradient-to-br from-amber-500/15 via-[#11151f] to-violet-500/10 p-6 sm:p-10">
    <div className="text-center">
     <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/15 border border-amber-300/20 grid place-items-center text-amber-300"><Coffee size={30}/></div>
     <p className="mt-5 text-amber-300 text-xs font-black tracking-[.2em]">CREATOR SUPPORT</p>
     <h1 className="text-3xl sm:text-5xl font-black mt-2">Buy me a coffee ☕</h1>
     <p className="text-slate-400 mt-3 max-w-xl mx-auto">If you enjoy AccessStore, you can support the creator directly through UPI.</p>
    </div>
    <div className="mt-8">
     <p className="text-sm font-bold text-slate-300 mb-3">Choose an amount</p>
     <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {PRESETS.map(v=><button key={v} onClick={()=>{setSelected(v);setCustom('')}} className={`rounded-2xl border px-3 py-3 font-black transition ${selected===v?'border-amber-300 bg-amber-400 text-black':'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}>{formatINR(v)}</button>)}
      <button onClick={()=>setSelected(0)} className={`rounded-2xl border px-3 py-3 font-black transition ${selected===0?'border-amber-300 bg-amber-400 text-black':'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}>Custom</button>
     </div>
     {selected===0&&<div className="mt-3 relative"><IndianRupee size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/><input autoFocus inputMode="decimal" min="1" value={custom} onChange={e=>setCustom(e.target.value.replace(/[^0-9.]/g,''))} placeholder="Enter amount" className="w-full rounded-2xl border border-white/10 bg-black/30 py-4 pl-10 pr-4 outline-none focus:border-amber-300 text-white"/></div>}
    </div>
    <div className="mt-8 grid md:grid-cols-2 gap-6 items-center">
     <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-center">
      {qr&&valid?<img src={qr} alt="UPI payment QR code" className="mx-auto w-64 h-64 rounded-2xl bg-white p-2"/>:<div className="w-64 h-64 mx-auto rounded-2xl border border-dashed border-white/10 grid place-items-center text-slate-500">Enter a valid amount</div>}
      <p className="text-xs text-slate-500 mt-3">Scan with any UPI app</p>
     </div>
     <div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
       <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Selected amount</p>
       <p className="text-4xl font-black mt-1">{valid?formatINR(amount):'₹0'}</p>
       <p className="text-sm text-slate-400 mt-4">Pay exactly this amount using the QR or your UPI app.</p>
       <a href={upiLink||'#'} onClick={e=>{if(!upiLink)e.preventDefault()}} className={`mt-5 w-full inline-flex justify-center items-center gap-2 rounded-2xl px-5 py-3.5 font-black ${valid&&upi?'bg-amber-400 text-black hover:bg-amber-300':'bg-white/10 text-slate-500 pointer-events-none'}`}><Smartphone size={18}/> Pay with UPI app <ExternalLink size={16}/></a>
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
       <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">UPI ID</p>
       <div className="flex items-center gap-2 mt-2"><code className="flex-1 text-sm text-white break-all">{upi||'UPI ID not configured'}</code><button onClick={copy} disabled={!upi} className="p-2 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40" aria-label="Copy UPI ID">{copied?<Check size={17}/>:<Copy size={17}/>}</button></div>
      </div>
     </div>
    </div>
    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500"><Heart size={14} className="text-amber-300"/> Every contribution helps keep AccessStore running.</div>
   </div>
  </div>
 </div>
}
