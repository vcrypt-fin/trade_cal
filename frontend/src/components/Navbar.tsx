import { Button } from "@/components/ui/button"
import { LineChart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-900/20 bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/20">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-2">
          <LineChart className="h-6 w-6 text-purple-500" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-200">
            TradeMind
          </span>
        </div>
        <nav className="flex flex-1 items-center justify-end space-x-6">
          <a href="#features" className="text-sm font-medium text-purple-200/70 hover:text-purple-200">
            Features
          </a>
          <a href="#showcase" className="text-sm font-medium text-purple-200/70 hover:text-purple-200">
            Examples
          </a>
          <a href="#testimonials" className="text-sm font-medium text-purple-200/70 hover:text-purple-200">
            Testimonials
          </a>
          <a href="#pricing" className="text-sm font-medium text-purple-200/70 hover:text-purple-200">
            Pricing
          </a>
          <Button 
            className="bg-purple-600 text-white hover:bg-purple-500"
            onClick={() => navigate('/auth')}
          >
            Sign In
          </Button>
        </nav>
      </div>
    </header>
  )
}
