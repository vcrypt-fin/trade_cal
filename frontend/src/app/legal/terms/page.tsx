import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/LandingPage/Header';
import Footer from '@/components/LandingPage/Footer';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A] text-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-12 flex-grow">
        {/* <Button 
          variant="ghost" 
          className="mb-8 text-purple-400 hover:text-purple-300"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button> */}

        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Terms of Service
        </h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing and using TradeMind's services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">2. Description of Service</h2>
            <p className="text-gray-300">
              TradeMind provides a trading journal and analytics platform designed to help traders track and 
              improve their trading performance. Our services include trade logging, performance analytics, 
              and educational resources.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">3. User Accounts</h2>
            <p className="text-gray-300">
              To access certain features of our platform, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-300">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">4. Privacy and Data Protection</h2>
            <p className="text-gray-300">
              Your privacy is important to us. Our collection and use of personal information is governed by 
              our Privacy Policy, which is incorporated into these Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">5. Service Modifications</h2>
            <p className="text-gray-300">
              We reserve the right to modify, suspend, or discontinue any part of our service at any time. 
              We will provide notice of significant changes when possible.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">6. Limitation of Liability</h2>
            <p className="text-gray-300">
              TradeMind is not responsible for any financial losses incurred through trading. Our platform 
              is a tool for analysis and journaling, not financial advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">7. Contact Information</h2>
            <p className="text-gray-300">
              For questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:contact@vcryptfinancial.com" className="text-purple-400 hover:text-purple-300">
                contact@vcryptfinancial.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 text-center text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      <Footer />
    </div>
  );
} 