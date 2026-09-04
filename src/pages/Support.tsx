import { useState } from 'react';
import { Coffee, Heart, Smartphone, Shield, Check, Copy, ExternalLink } from 'lucide-react';
import { useSettings, formatINR } from '@/lib/config';
import { supabase } from '@/lib/supabase';

const CREATOR_UPI_ID = '9958856831@pthdfc';

export default function Support() {
  const settings = useSettings();
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [utr, setUtr] = useState('');
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const amounts = [50, 100, 250, 500, 1000];
  const finalAmount = customAmount ? Number(customAmount) : amount;
  const upiId = CREATOR_UPI_ID;

  const copyUpi = async () => {
    try {
      await navigator.clipboard?.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable in some browsers; the UPI ID remains visible for manual copy.
    }
  };

  const startPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isFinite(finalAmount) || finalAmount < 1) return;

    const params = new URLSearchParams({
      pa: upiId,
      pn: 'AccessStore',
      am: finalAmount.toFixed(2),
      cu: 'INR',
      tn: 'AccessStore Creator Support',
    });
    const upiUrl = `upi://pay?${params.toString()}`;

    setPaymentStarted(true);
    window.location.assign(upiUrl);
  };

  const confirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utr.trim();
    if (!cleanUtr) return;

    const { error } = await supabase.from('support_payments').insert({
      name: name || null,
      email: email || null,
      amount: finalAmount,
      payment_method: 'UPI',
      message: message || null,
      status: 'pending_verification',
      utr: cleanUtr,
    });

    if (!error) setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5"><Coffee className="w-8 h-8 text-amber-600" /></div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">Support the Creator</h1>
        <p className="text-gray-500 leading-relaxed max-w-xl mx-auto">If my Roblox content has entertained you, helped you or simply made your day a little better, you can support the channel and help me create more.</p>
      </div>

      {submitted ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-green-600" /></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment submitted for verification</h2>
          <p className="text-gray-500 text-sm">Thank you! We received your UPI transaction reference. Your contribution will be marked as received after verification.</p>
          <button onClick={() => { setSubmitted(false); setPaymentStarted(false); setUtr(''); }} className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700">Make another contribution</button>
        </div>
      ) : paymentStarted ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <div className="text-center mb-7">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"><Smartphone className="w-8 h-8 text-blue-600" /></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Complete your UPI payment</h2>
            <p className="text-gray-500 text-sm">Pay {formatINR(finalAmount)} in your UPI app, then return here and enter your transaction ID / UTR.</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Pay to</p>
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold text-gray-900 break-all">{upiId}</p>
              <button type="button" onClick={copyUpi} className="shrink-0 p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100" aria-label="Copy UPI ID"><Copy className="w-4 h-4" /></button>
            </div>
            {copied && <p className="text-xs text-green-600 mt-2">UPI ID copied.</p>}
          </div>
          <form onSubmit={confirmPayment} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">UPI Transaction ID / UTR</label>
              <input required value={utr} onChange={e => setUtr(e.target.value)} placeholder="Enter the UTR shown in your UPI app" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all"><Check className="w-5 h-5" /> Submit Payment Details</button>
            <button type="button" onClick={() => setPaymentStarted(false)} className="w-full text-sm text-gray-500 hover:text-gray-900">Back</button>
          </form>
          <div className="flex items-start gap-2 mt-6 p-3 bg-amber-50 rounded-lg"><Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-amber-800">Clicking the payment button does not mean payment is completed. We use the transaction reference for verification.</p></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4"><Heart className="w-5 h-5 text-red-500" /><h2 className="font-bold text-gray-900">Buy Me a Coffee</h2></div>
            <p className="text-sm text-gray-500 mb-5">Choose an amount to support the channel.</p>
            <form onSubmit={startPayment} className="space-y-4">
              <div><label className="text-sm font-medium text-gray-700 mb-2 block">Select Amount</label><div className="grid grid-cols-3 gap-2">{amounts.map(a => <button key={a} type="button" onClick={() => { setAmount(a); setCustomAmount(''); }} className={`py-2.5 rounded-lg text-sm font-semibold border transition-colors ${!customAmount && amount === a ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>{formatINR(a)}</button>)}</div></div>
              <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Or enter custom amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span><input type="number" min={1} value={customAmount} onChange={e => setCustomAmount(e.target.value)} placeholder="Enter amount" className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div></div>
              <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Name (Optional)</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
              <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Email (Optional)</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
              <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Message (Optional)</label><textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Leave a message for the creator..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" /></div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all hover:scale-[1.02]"><ExternalLink className="w-5 h-5" /> Pay {formatINR(finalAmount)} via UPI</button>
            </form>
          </div>
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4"><Smartphone className="w-5 h-5 text-gray-900" /><h2 className="font-bold text-gray-900">Pay via UPI</h2></div>
              <p className="text-sm text-gray-500 mb-4">Pay directly from a supported UPI app. The amount is filled automatically.</p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1">UPI ID</p><div className="flex items-center justify-between gap-3"><p className="font-bold text-gray-900 text-lg break-all">{upiId}</p><button type="button" onClick={copyUpi} className="shrink-0 p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100" aria-label="Copy UPI ID"><Copy className="w-4 h-4" /></button></div>{copied && <p className="text-xs text-green-600 mt-2">UPI ID copied.</p>}</div>
              <div className="flex items-start gap-2 mt-4 p-3 bg-blue-50 rounded-lg"><Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-blue-700">After paying, return here and submit your UPI transaction ID / UTR. The contribution is only marked received after verification.</p></div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white"><h3 className="font-bold mb-2">Why Support?</h3><ul className="space-y-2 text-sm text-gray-300"><li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" /> Helps create better content</li><li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" /> Supports community events</li><li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" /> Keeps content free for everyone</li><li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" /> Funds new gaming equipment</li></ul></div>
          </div>
        </div>
      )}
    </div>
  );
}
