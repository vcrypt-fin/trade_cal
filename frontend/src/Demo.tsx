import { Navbar } from "./demo_components/navbar"
import { Hero } from "./demo_components/hero"
import { Features } from "./demo_components/features"
import { Showcase } from "./demo_components/showcase"
import { Testimonials } from "./demo_components/testimonials"
import { Pricing } from "./demo_components/pricing"
import { CTA } from "./demo_components/cta"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-[#090909]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Showcase />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
    </div>
  )
}

