import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-900/90 to-purple-700/50" id="testimonials">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-100">
          What Our Traders Say
        </h2>
        <div className="flex justify-center">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-purple-300/20 border border-purple-700/50 shadow-lg"
              >
                <CardContent className="p-8">
                  <p className="text-purple-100 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-purple-100 font-semibold">{testimonial.name}</p>
                      <p className="text-purple-300 text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const testimonials = [
  {
    quote: "Bluenotes has transformed my trading. The AI insights have helped me identify patterns I never noticed before.",
    name: "Sarah Johnson",
    title: "Day Trader",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    quote: "The automated journaling feature saves me hours each week. I can focus on trading instead of record-keeping.",
    name: "Michael Chen",
    title: "Swing Trader",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    quote: "As a beginner, Bluenotes has been invaluable in helping me understand my strengths and weaknesses.",
    name: "Emily Rodriguez",
    title: "Novice Trader",
    avatar: "/placeholder.svg?height=40&width=40"
  }
]
