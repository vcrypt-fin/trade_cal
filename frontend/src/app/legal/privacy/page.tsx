import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/LandingPage/Header';
import Footer from '@/components/LandingPage/Footer';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A] text-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Privacy Policy
        </h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">1. Information We Collect</h2>
            <p className="text-gray-300">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-300">
              <li>Account registration information (name, email, etc.)</li>
              <li>Trading data and journal entries</li>
              <li>Usage information and platform preferences</li>
              <li>Communication data when you contact us</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">2. How We Use Your Information</h2>
            <p className="text-gray-300">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-300">
              <li>Provide and improve our services</li>
              <li>Personalize your experience</li>
              <li>Process your transactions</li>
              <li>Send you updates and marketing communications</li>
              <li>Ensure platform security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">3. Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-300">
              <li>Encryption of sensitive data</li>
              <li>Regular security audits</li>
              <li>Secure data storage practices</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">4. Data Sharing</h2>
            <p className="text-gray-300">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-300">
              <li>Service providers who assist in platform operations</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners with your consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">5. Your Rights</h2>
            <p className="text-gray-300">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-300">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">6. Contact Us</h2>
            <p className="text-gray-300">
              If you have questions about our Privacy Policy, please contact us at{' '}
              <a href="mailto:contact@vcryptfinancial.com" className="text-purple-400 hover:text-purple-300">
                contact@vcryptfinancial.com
              </a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
} 