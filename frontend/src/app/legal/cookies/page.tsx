import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/LandingPage/Header';
import Footer from '@/components/LandingPage/Footer';

export default function CookiePolicy() {
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
          Cookie Policy
        </h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">1. What Are Cookies?</h2>
            <p className="text-gray-300">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              how you use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">2. How We Use Cookies</h2>
            <p className="text-gray-300">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-300">
              <li>Essential cookies for platform functionality</li>
              <li>Authentication and security</li>
              <li>User preferences and settings</li>
              <li>Analytics and performance monitoring</li>
              <li>Feature optimization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">3. Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-200">Essential Cookies</h3>
                <p className="text-gray-300">
                  Required for basic platform functionality and security. These cannot be disabled.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-200">Preference Cookies</h3>
                <p className="text-gray-300">
                  Remember your settings and preferences for a better experience.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-200">Analytics Cookies</h3>
                <p className="text-gray-300">
                  Help us understand how users interact with our platform.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">4. Managing Cookies</h2>
            <p className="text-gray-300">
              You can control and/or delete cookies as you wish. You can delete all cookies that are 
              already on your computer and you can set most browsers to prevent them from being placed. 
              However, if you do this, you may have to manually adjust some preferences every time you 
              visit our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">5. Third-Party Cookies</h2>
            <p className="text-gray-300">
              Some of our features use third-party cookies. These cookies are governed by the respective 
              privacy policies of these third parties. We recommend reviewing their privacy policies for 
              more information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">6. Updates to This Policy</h2>
            <p className="text-gray-300">
              We may update this Cookie Policy from time to time. We will notify you of any changes by 
              posting the new Cookie Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">7. Contact Us</h2>
            <p className="text-gray-300">
              If you have questions about our Cookie Policy, please contact us at{' '}
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