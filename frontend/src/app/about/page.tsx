import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Users, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/LandingPage/Header';
import Footer from '@/components/LandingPage/Footer';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A] text-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          About TradeMind
        </h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              <span className="text-purple-400 font-bold">TradeMind</span> is a specialized branch of <span className="text-purple-400 font-bold">Vcrypt Financial</span>, a fintech company known for its innovative algorithmic trading strategies. While Vcrypt focuses on developing sophisticated trading algorithms, TradeMind emerged from our <span className="text-purple-400 font-bold">deep understanding of traders' needs</span> for better journaling tools. Our <span className="text-purple-400 font-bold">mission</span> is to leverage Vcrypt's technical expertise to <span className="text-purple-400 font-bold">redefine the trading journaling experience</span>. As traders ourselves, we understand the challenges of navigating complex interfaces and inflated pricing. That's why we're <span className="text-purple-400 font-bold">committed to simplifying trading journaling while keeping it accessible to everyone</span>. We aim to <span className="text-purple-400 font-bold">empower traders of all levels</span> by providing a platform that is both <span className="text-purple-400 font-bold">intuitive and affordable</span>, enabling them to focus on what truly matters—<span className="text-purple-400 font-bold">improving their trades</span>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-purple-300">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-purple-900/20 p-6 rounded-lg border border-purple-700/30">
                <Target className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-purple-200">Innovation</h3>
                <p className="text-gray-300">
                  We constantly explore new ways to make trading analytics and journaling smarter, simpler, and more effective.
                </p>
              </div>
              <div className="bg-purple-900/20 p-6 rounded-lg border border-purple-700/30">
                <Users className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-purple-200">Community</h3>
                <p className="text-gray-300">
                  Traders are stronger together. We’re fostering a community that shares knowledge, experiences, and support.
                </p>
              </div>
              <div className="bg-purple-900/20 p-6 rounded-lg border border-purple-700/30">
                <Shield className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-purple-200">Trust</h3>
                <p className="text-gray-300">
                  Your data and privacy matter to us. We prioritize security to give you peace of mind.
                </p>
              </div>
              <div className="bg-purple-900/20 p-6 rounded-lg border border-purple-700/30">
                <Sparkles className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-purple-200">Excellence</h3>
                <p className="text-gray-300">
                  We hold ourselves to the highest standards, ensuring every feature we build exceeds your expectations.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">Our Story</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Vcrypt was born in <span className="text-purple-400 font-bold">Corvallis, Oregon</span>, founded by a team of engineers from <span className="text-purple-400 font-bold">Oregon State University</span>. As active traders and fintech enthusiasts, we saw firsthand the frustrations caused by existing trading journaling platforms—clunky user interfaces, steep learning curves, and unjustifiable costs. Determined to solve these issues, we pooled our expertise in <span className="text-purple-400 font-bold">software engineering and financial technology</span> to create a solution that aligns with traders' needs.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              What began as a side project to improve our own trading practices quickly grew into something much bigger. Today, TradeMind is a <span className="text-purple-400 font-bold">cutting-edge trading journal platform</span> that blends simplicity with sophistication, offering powerful analytics, data-driven insights, and an intuitive interface at a fraction of the cost of our competitors. Our unique combination of <span className="text-purple-400 font-bold">trading expertise and technological innovation</span> allows us to push the boundaries of what's possible in trading analytics, with an exciting roadmap of features ahead.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">Join Our Journey</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              We’re more than just a company; we’re a community of innovators, traders, and problem solvers. If you’re as passionate about revolutionizing the trading industry as we are, we invite you to be part of our journey. Explore opportunities to join our team on our{' '}
              <a href="/careers" className="text-purple-400 hover:text-purple-300">
                careers page
              </a>
              .
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">Contact Us</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Got questions? Want to learn more about how Vcrypt can transform your trading journey? Reach out to us at{' '}
              <a href="mailto:contact@vcryptfinancial.com" className="text-purple-400 hover:text-purple-300">
                contact@vcryptfinancial.com
              </a>
              . We’re here to help.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
