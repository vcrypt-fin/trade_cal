import { Card } from "@/components/ui/card"

interface ShowcaseCardProps {
  title: string
  description: string
  content: React.ReactNode
}

export function ShowcaseCard({ title, description, content }: ShowcaseCardProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-950 to-black border-purple-800/30 p-6 shadow-lg hover:shadow-purple-800/20 transition-all duration-300">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">{title}</h3>
      <p className="text-purple-200 mb-6">{description}</p>
      {content}
    </Card>
  )
}

