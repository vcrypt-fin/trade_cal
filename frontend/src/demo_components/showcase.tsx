import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, BarChart, Calendar, Table, Filter, PlusCircle, BookOpen, Play, Presentation, GraduationCap, Settings } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'

export function Showcase() {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="py-20 bg-black" id="showcase">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-100">
          Bluenotes in Action
        </h2>
        
        <div className="mb-12">
          <div className="flex justify-center space-x-4 overflow-x-auto pb-4">
            {features.map((feature, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"  // Consistent button size
                className="flex flex-col items-center gap-2 min-w-[100px] text-purple-200/70 hover:bg-purple-800/20 hover:text-purple-200 transition-all p-8"
              >
                <feature.icon className="h-6 w-6" />
                <span className="text-xs">{feature.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="relative px-12">
          <Carousel plugins={[plugin.current]} className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {showcaseItems.map((item, index) => (
                <CarouselItem key={index}>
                  <ShowcaseCard
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    content={item.content}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 border-purple-700 text-purple-200 p-3 rounded-full bg-black hover:bg-purple-800/20 transition-all mx-4" />
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 border-purple-700 text-purple-200 p-3 rounded-full bg-black hover:bg-purple-800/20  transition-all mx-4" />          
          </Carousel>
        </div>
      </div>
    </section>
  )
}

const features = [
  { name: "Notebook", icon: Table },
  { name: "Reporting", icon: BarChart },
  { name: "Backtesting", icon: Settings },
  { name: "Replay", icon: Play },
  { name: "Playbook", icon: BookOpen },
  { name: "Mentoring", icon: Presentation },
  { name: "Education", icon: GraduationCap },
]

const showcaseItems = [
  {
    title: "Dashboard Overview",
    description: "Get a comprehensive view of your trading performance",
    icon: LineChart,
    content: <img src="hotdog.gif" alt="Dashboard Overview" className="w-3/4 rounded-lg shadow-lg mx-auto" />,
  },
  {
    title: "Daily Journal", 
    description: "Record and review your daily trading activities",
    icon: BookOpen,
    content: <img src="hotdog.gif" alt="Daily Journal" className="w-3/4 rounded-lg shadow-lg mx-auto" />,
  },
  {
    title: "Trade Log",
    description: "Detailed log of all your trades with advanced filtering",
    icon: Table,
    content: <img src="hotdog.gif" alt="Trade Log" className="w-3/4 rounded-lg shadow-lg object-contain mx-auto" />,
  },
]

function ShowcaseCard({
  title,
  description,
  icon: Icon,
  content
}: {
  title: string
  description: string
  icon: React.ElementType
  content: React.ReactNode
}) {
  return (
    <Card className="bg-purple-900/20 border-2 border-purple-800 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-purple-900/50 p-4 rounded-full">
            <Icon className="h-8 w-8 text-purple-300" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-purple-100">{title}</h3>
            <p className="text-sm text-purple-200/70">{description}</p>
          </div>
        </div>
        {content}
      </CardContent>
    </Card>
  )
}
