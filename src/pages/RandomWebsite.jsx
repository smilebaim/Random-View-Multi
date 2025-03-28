
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

export default function RandomWebsite() {
  const [websites, setWebsites] = useState([])
  const [currentWebsite, setCurrentWebsite] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchWebsites()
  }, [])

  const fetchWebsites = async () => {
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('*')

      if (error) throw error

      setWebsites(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load websites",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRandomWebsite = () => {
    if (websites.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No websites available",
      })
      return
    }

    const randomIndex = Math.floor(Math.random() * websites.length)
    const website = websites[randomIndex]
    setCurrentWebsite(website)
    
    // Redirect to the website
    window.open(website.url, "_blank", "noopener,noreferrer")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="text-center max-w-2xl"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready for an Adventure?
        </h2>
        
        <p className="text-lg text-muted-foreground mb-8">
          Click the button below to discover a random website from our curated collection.
        </p>

        <Button
          size="lg"
          onClick={getRandomWebsite}
          className="text-lg px-8"
        >
          Take Me Somewhere
        </Button>

        {currentWebsite && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 border rounded-lg"
          >
            <p className="font-medium mb-2">
              Last visited:
            </p>
            <a
              href={currentWebsite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {currentWebsite.title}
            </a>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
