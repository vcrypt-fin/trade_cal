import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="border-t border-purple-900/20 bg-black">
      <div className="container flex flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-purple-900 opacity-75 blur" />
          <h2 className="relative text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-100">
            Ready to Transform Your Trading?
          </h2>
        </div>
        <p className="mx-auto max-w-[600px] text-purple-200/70 md:text-xl">
          Join thousands of traders using Bluenotes to achieve consistent profiftability
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20">
            Start Free Trial
          </Button>
          <Button variant="outline" size="lg" className="border-purple-700 text-purple-300 bg-purple-900/50 hover:bg-purple-900/80 hover:text-purple-200">
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  )
}

