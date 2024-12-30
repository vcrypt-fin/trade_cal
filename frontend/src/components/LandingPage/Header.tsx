import { Button } from "@/components/ui/button"
import { Menu, ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  const navigateToSection = (section: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${section}`)
    } else {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {!isLandingPage && (
            <Button 
              variant="ghost" 
              className="text-purple-400 hover:text-purple-300 -ml-3"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">TradeMind</div>
            <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white">BETA</span>
          </div>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li><button onClick={() => navigateToSection('home')} className="hover:text-purple-400 transition-colors">Home</button></li>
            <li><button onClick={() => navigateToSection('features')} className="hover:text-purple-400 transition-colors">Features</button></li>
            <li><button onClick={() => navigateToSection('pricing')} className="hover:text-purple-400 transition-colors">Pricing</button></li>
            <li><button onClick={() => navigateToSection('faq')} className="hover:text-purple-400 transition-colors">FAQs</button></li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => navigate('/auth')}
          >
            Sign Up
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6">
                <ul className="space-y-4">
                  <li><button onClick={() => navigateToSection('home')} className="block py-2 hover:text-purple-400 transition-colors w-full text-left">Home</button></li>
                  <li><button onClick={() => navigateToSection('features')} className="block py-2 hover:text-purple-400 transition-colors w-full text-left">Features</button></li>
                  <li><button onClick={() => navigateToSection('pricing')} className="block py-2 hover:text-purple-400 transition-colors w-full text-left">Pricing</button></li>
                  <li><button onClick={() => navigateToSection('faq')} className="block py-2 hover:text-purple-400 transition-colors w-full text-left">FAQs</button></li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
} 