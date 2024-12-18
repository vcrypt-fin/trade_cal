// src/components/Hero.tsx

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketItem {
  name: string;
  price: string;
  change: string;
  volume: string;
  up: boolean;
}

const Hero: React.FC = () => {
  // Sample data for tabs
  const marketData = {
    crypto: [
      { name: "BTC/USD", price: "34,567.89", change: "+5.67%", volume: "2.1B", up: true },
      { name: "ETH/USD", price: "2,345.67", change: "-2.34%", volume: "1.5B", up: false },
      { name: "XRP/USD", price: "0.5678", change: "+1.23%", volume: "500M", up: true },
      { name: "ADA/USD", price: "1.2345", change: "+3.45%", volume: "300M", up: true },
    ],
    forex: [
      { name: "EUR/USD", price: "1.1234", change: "+0.25%", volume: "1.8B", up: true },
      { name: "GBP/USD", price: "1.3456", change: "-0.15%", volume: "1.2B", up: false },
      { name: "USD/JPY", price: "110.67", change: "+0.10%", volume: "900M", up: true },
      { name: "AUD/USD", price: "0.7890", change: "+0.30%", volume: "600M", up: true },
    ],
    stocks: [
      { name: "AAPL", price: "145.67", change: "+1.23%", volume: "5.2B", up: true },
      { name: "GOOGL", price: "2,789.45", change: "-0.45%", volume: "3.1B", up: false },
      { name: "TSLA", price: "678.90", change: "+2.34%", volume: "4.5B", up: true },
      { name: "AMZN", price: "3,456.78", change: "+0.67%", volume: "3.8B", up: true },
    ],
  };

  return (
    <section className="container mx-auto px-4 py-20 bg-black">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Textual Content */}
        <div className="space-y-8">
          <h1 className="text-purple-100 text-4xl md:text-6xl font-bold leading-tight">
            Elevate Your Trading with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              BUYDATE
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Track trades, analyze markets, and time your entries with precision. Your all-in-one platform for smarter trading.
          </p>
          <div className="flex flex-wrap">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
              Start Trading Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ml-4">
              View Tutorial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Right Side: Live Market Trends Card */}
        <div className="relative">
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-600 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>

          {/* Card Component */}
          <Card className="bg-[#1A1A1A] border-purple-700 text-white relative z-10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Live Market Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="crypto" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                  <TabsTrigger value="forex">Forex</TabsTrigger>
                  <TabsTrigger value="stocks">Stocks</TabsTrigger>
                </TabsList>

                {/* Crypto Tab Content */}
                <TabsContent value="crypto">
                  <div className="space-y-4">
                    {marketData.crypto.map((item, index) => (
                      <MarketRow key={index} item={item} />
                    ))}
                  </div>
                </TabsContent>

                {/* Forex Tab Content */}
                <TabsContent value="forex">
                  <div className="space-y-4">
                    {marketData.forex.map((item, index) => (
                      <MarketRow key={index} item={item} />
                    ))}
                  </div>
                </TabsContent>

                {/* Stocks Tab Content */}
                <TabsContent value="stocks">
                  <div className="space-y-4">
                    {marketData.stocks.map((item, index) => (
                      <MarketRow key={index} item={item} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Placeholder for Chart */}
              <div className="mt-6">
                <div className="w-full h-32 bg-[#2A1A4A] rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-end">
                    {[40, 60, 30, 70, 50, 80, 35, 65, 45, 75, 55, 85].map((height, index) => (
                      <div
                        key={index}
                        className="w-1/12 h-full bg-gradient-to-t from-purple-500 to-pink-500 opacity-75"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

interface MarketRowProps {
  item: MarketItem;
}

const MarketRow: React.FC<MarketRowProps> = ({ item }) => {
  return (
    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-[#2A1A4A] transition-colors">
      <div>
        <p className="font-semibold">{item.name}</p>
        <p className="text-sm text-gray-400">Vol: ${item.volume}</p>
      </div>
      <div className="text-right">
        <p className="font-bold">${item.price}</p>
        <p className={`text-sm flex items-center ${item.up ? 'text-green-500' : 'text-red-500'}`}>
          {item.up ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
          {item.change}
        </p>
      </div>
    </div>
  );
};

export default Hero;
