
import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.h1 
          className="text-4xl sm:text-6xl font-bold mb-6"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Discover New Websites
        </motion.h1>
        
        <motion.p
          className="text-xl text-muted-foreground mb-8 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Explore the web in a new way. Click the button below to be taken to a random curated website.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/random">
            <Button size="lg" className="text-lg px-8">
              Take Me Somewhere
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="text-center p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-2">Curated Content</h3>
          <p className="text-muted-foreground">
            All websites are manually reviewed for quality and safety
          </p>
        </div>

        <div className="text-center p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-2">Daily Updates</h3>
          <p className="text-muted-foreground">
            New websites are added regularly to keep content fresh
          </p>
        </div>

        <div className="text-center p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-2">Safe Browsing</h3>
          <p className="text-muted-foreground">
            All links are verified and monitored for security
          </p>
        </div>
      </motion.div>
    </div>
  )
}
