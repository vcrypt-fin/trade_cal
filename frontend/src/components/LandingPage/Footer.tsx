import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-gradient-to-b from-transparent via-[#1A0E2E] to-[#0A0A0A] text-gray-400 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/about')} className="hover:text-purple-400 transition-colors">About Us</button></li>
              <li><button onClick={() => navigate('/careers')} className="hover:text-purple-400 transition-colors">Careers</button></li>
              <li><button onClick={() => navigate('/contact')} className="hover:text-purple-400 transition-colors">Contact</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/#features')} className="hover:text-purple-400 transition-colors">Features</button></li>
              <li><button onClick={() => navigate('/#pricing')} className="hover:text-purple-400 transition-colors">Pricing</button></li>
              
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/legal/terms')} className="hover:text-purple-400 transition-colors">Terms of Service</button></li>
              <li><button onClick={() => navigate('/legal/privacy')} className="hover:text-purple-400 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => navigate('/legal/cookies')} className="hover:text-purple-400 transition-colors">Cookie Policy</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <p className="mb-4">Stay up to date with the latest features and releases.</p>
            <a 
              href="mailto:contact@vcryptfinancial.com" 
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              contact@vcryptfinancial.com
            </a>
          </div>
        </div>
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} TradeMind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 