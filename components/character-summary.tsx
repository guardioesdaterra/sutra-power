"use client"

import { useState, useEffect } from "react"
import { getSutraSummary } from "@/lib/sutra-data"
import { Sparkles } from "lucide-react"

interface CharacterSummaryProps {
  characterId: number
}

export function CharacterSummary({ characterId }: CharacterSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = () => {
      try {
        const summaryData = getSutraSummary(characterId)
        setSummary(summaryData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching summary:", error)
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [characterId])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <p className="text-muted-foreground">Loading summary...</p>
      </div>
    )
  }

  if (!summary) {
    return <p className="text-muted-foreground">No summary available for this character.</p>
  }

  return (
    <div className="prose dark:prose-invert max-w-none text-sm">
      <div dangerouslySetInnerHTML={{ __html: summary }} />
    </div>
  )
}
