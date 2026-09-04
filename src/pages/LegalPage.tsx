import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '@/lib/config';

export default function LegalPage({ type }: { type: 'privacy' | 'terms' | 'refund' | 'shipping' }) {
  const settings = useSettings();

  const content = {
    privacy: {
      title: 'Privacy Policy',
      sections: [
        { heading: 'Information We Collect', body: 'We collect information you provide when placing an order, including your name, email, phone number, and shipping address. We also collect payment information which is processed securely through our payment gateway.' },
        { heading: 'How We Use Your Information', body: 'Your information is used to process orders, provide customer support, send order updates, and improve our services. We never sell your personal information to third parties.' },
        { heading: 'Data Security', body: 'All personal data is stored securely and encrypted. Payment details are processed through certified payment gateways and we never store your complete payment information.' },
        { heading: 'Your Rights', body: 'You have the right to access, correct, or delete your personal information. Contact us at ' + settings.business_email + ' for any privacy-related requests.' },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      sections: [
        { heading: 'Acceptance of Terms', body: 'By using this website and placing orders, you agree to these terms and conditions. If you do not agree, please do not use this service.' },
        { heading: 'Products & Pricing', body: 'All products are subject to availability. Prices are listed in Indian Rupees (INR) and may change without notice. We reserve the right to refuse or cancel any order.' },
        { heading: 'Payment', body: 'Payments are accepted via UPI and other supported methods. Orders are confirmed only after payment verification through the payment gateway.' },
        { heading: 'Shipping', body: 'Orders are typically shipped within 2-3 business days. Delivery times vary by location. Free shipping is available on orders above ₹999.' },
        { heading: 'Intellectual Property', body: 'All content on this website, including logos, designs, and text, is the property of ' + settings.creator_name + ' and may not be reproduced without permission.' },
      ],
    },
    refund: {
      title: 'Refund & Cancellation Policy',
      sections: [
        { heading: 'Cancellation', body: 'Orders can be cancelled before they are shipped. To cancel an order, contact us immediately at ' + settings.business_email + ' with your Order ID.' },
        { heading: 'Return Policy', body: 'We offer 7-day returns on most products. Items must be unused, in original packaging, and with all tags attached. Certain items like apparel must be unworn.' },
        { heading: 'Refund Process', body: 'Once we receive and inspect your return, a refund will be initiated to your original payment method within 5-7 business days.' },
        { heading: 'Non-Refundable Items', body: 'Certain items such as collectibles with broken seals, personalized items, and digital products are non-refundable unless damaged or defective.' },
      ],
    },
    shipping: {
      title: 'Shipping Policy',
      sections: [
        { heading: 'Processing Time', body: 'Orders are processed within 1-2 business days after payment confirmation. You will receive a confirmation email once your order is shipped.' },
        { heading: 'Delivery Time', body: 'Standard delivery takes 5-7 business days for most locations in India. Remote areas may take additional time.' },
        { heading: 'Shipping Charges', body: 'Free shipping is available on all orders above ₹999. Orders below ₹999 incur a flat shipping charge of ₹49.' },
        { heading: 'Tracking', body: 'Once your order is shipped, you will receive a tracking link via email and SMS. You can also track your order anytime using our Track Order page.' },
      ],
    },
  };

  const data = content[type];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">{data.title}</h1>

      <div className="space-y-6">
        {data.sections.map((section, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-2">{section.heading}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">Last updated: September 2026</p>
    </div>
  );
}
