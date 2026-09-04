import { useState } from 'react';
import { Coffee, Heart, Smartphone, Shield, Check } from 'lucide-react';
import { useSettings, formatINR } from '@/lib/config';
import { supabase } from '@/lib/supabase';

export default function Support() {
  const settings = useSettings();
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const amounts = [50, 100, 250, 500, 1000];

  const finalAmount = customAmount ? Number(customAmount) : amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount < 1) return;

    const { error } = await supabase.from('support_payments').insert({
      name: name || null,
      email: email || null,
      amount: finalAmount,
      payment_method: 'UPI',
      message: message || null,
      status: 'pending',
    });

    if (!error) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <Coffee className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">Support the Creator</h1>
        <p className="text-gray-500 leading-relaxed max-w-xl mx-auto">
          If my Roblox content has entertained you, helped you or simply made your day a little better, you can support the channel and help me create more.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Thank you for your support!</h2>
          <p className="text-gray-500 text-sm">Your contribution means the world. You'll be redirected to complete your UPI payment.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Make another contribution
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Support card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h2 className="font-bold text-gray-900">Buy Me a Coffee</h2>
            </div>
            <p className="text-sm text-gray-500 mb-5">Choose an amount to support the channel.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Select Amount</label>
                <div className="grid grid-cols-3 gap-2">
                  {amounts.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => { setAmount(a); setCustomAmount(''); }}
                      className={`py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                        !customAmount && amount === a ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {formatINR(a)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Or enter custom amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input
                    type="number"
                    min={1}
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name (Optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Leave a message for the creator..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all hover:scale-[1.02]"
              >
                <Coffee className="w-5 h-5" />
                Support with {formatINR(finalAmount)}
              </button>
            </form>
          </div>

          {/* UPI info card */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="w-5 h-5 text-gray-900" />
                <h2 className="font-bold text-gray-900">Pay via UPI</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">You can also support directly using UPI.</p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">UPI ID</p>
                <p className="font-bold text-gray-900 text-lg">{settings.upi_id}</p>
              </div>
              <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-700">Your payment is secure. UPI payments are verified through the payment gateway.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-2">Why Support?</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" /> Helps create better content</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" /> Supports community events</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" /> Keeps content free for everyone</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" /> Funds new gaming equipment</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
