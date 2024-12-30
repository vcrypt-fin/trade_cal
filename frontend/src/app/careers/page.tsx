import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, LineChart, Users, MessageSquare, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/LandingPage/Header';
import Footer from '@/components/LandingPage/Footer';

export default function Careers() {
  const navigate = useNavigate();

  const positions = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      icon: Code,
      description: "Join our engineering team to build and scale our trading platform. Work with modern technologies like React, Node.js, and cloud infrastructure."
    },
    {
      title: "Quantitative Analyst",
      department: "Research",
      location: "Remote",
      type: "Full-time",
      icon: LineChart,
      description: "Help develop and implement trading algorithms and analytical tools. Strong background in mathematics and statistics required."
    },
    {
      title: "Community Manager",
      department: "Community",
      location: "Remote",
      type: "Full-time",
      icon: Users,
      description: "Build and nurture our trading community. Create engaging content and organize community events."
    },
    {
      title: "Technical Support Specialist",
      department: "Support",
      location: "Remote",
      type: "Full-time",
      icon: MessageSquare,
      description: "Provide excellent technical support to our users. Help traders get the most out of our platform."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A] text-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Join Our Team
          </h1>

          <p className="text-xl text-gray-300 mb-12">
            Help us revolutionize the trading industry. We're looking for passionate individuals who want 
            to make a difference in how traders analyze and improve their performance.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-purple-300">Why Join TradeMind?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-900/20 p-6 rounded-lg border border-purple-700/30">
                <h3 className="text-xl font-semibold mb-3 text-purple-200">Remote-First Culture</h3>
                <p className="text-gray-300">
                  Work from anywhere in the world. We believe in giving our team the flexibility to work 
                  where they're most productive.
                </p>
              </div>
              <div className="bg-purple-900/20 p-6 rounded-lg border border-purple-700/30">
                <h3 className="text-xl font-semibold mb-3 text-purple-200">Competitive Benefits</h3>
                <p className="text-gray-300">
                  Comprehensive health coverage, generous vacation policy, and competitive compensation 
                  packages.
                </p>
              </div>
              <div className="bg-purple-900/20 p-6 rounded-lg border border-purple-700/30">
                <h3 className="text-xl font-semibold mb-3 text-purple-200">Growth Opportunities</h3>
                <p className="text-gray-300">
                  Continuous learning and development opportunities. We invest in our team's growth and 
                  success.
                </p>
              </div>
              <div className="bg-purple-900/20 p-6 rounded-lg border border-purple-700/30">
                <h3 className="text-xl font-semibold mb-3 text-purple-200">Innovative Environment</h3>
                <p className="text-gray-300">
                  Work on cutting-edge technology and help shape the future of trading analytics.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-purple-300">Open Positions</h2>
            <div className="space-y-6">
              {positions.map((position, index) => (
                <div 
                  key={index}
                  className="bg-purple-900/20 p-6 rounded-lg border border-purple-700/30 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <position.icon className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-purple-200">{position.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2 mb-4">
                        <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                          {position.department}
                        </span>
                        <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                          {position.location}
                        </span>
                        <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                          {position.type}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{position.description}</p>
                      <Button 
                        className="bg-purple-600 hover:bg-purple-500 text-white"
                        onClick={() => window.location.href = 'mailto:careers@vcryptfinancial.com'}
                      >
                        Apply Now
                        <Mail className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">Don't See a Perfect Fit?</h2>
            <p className="text-gray-300 mb-6">
              We're always looking for talented individuals. Send us your resume and tell us how you can 
              contribute to TradeMind.
            </p>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              onClick={() => window.location.href = 'mailto:careers@vcryptfinancial.com'}
            >
              Get in Touch
              <Mail className="ml-2 h-4 w-4" />
            </Button>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
} 