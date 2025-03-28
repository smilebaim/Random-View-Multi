
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const [websites, setWebsites] = useState([])
  const [newUrl, setNewUrl] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { isAdmin, user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchWebsites()
  }, [])

  const fetchWebsites = async () => {
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false })

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

  const handleAddWebsite = async (e) => {
    e.preventDefault()
    
    if (!newUrl || !newTitle) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      })
      return
    }

    try {
      const { error } = await supabase
        .from('websites')
        .insert([
          {
            url: newUrl,
            title: newTitle,
            created_by: user.id
          }
        ])

      if (error) throw error

      setNewUrl("")
      setNewTitle("")
      
      toast({
        title: "Success",
        description: "Website added successfully",
      })

      fetchWebsites()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add website",
      })
    }
  }

  const handleDeleteWebsite = async (id) => {
    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      toast({
        title: "Success",
        description: "Website deleted successfully",
      })

      fetchWebsites()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete website",
      })
    }
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

      {isAdmin && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 p-6 border rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Add New Website</h3>
          
          <form onSubmit={handleAddWebsite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Website Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 rounded-md border"
                placeholder="Enter website title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full p-2 rounded-md border"
                placeholder="https://example.com"
              />
            </div>

            <Button type="submit">
              Add Website
            </Button>
          </form>
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold mb-4">Website List</h3>
        
        <div className="space-y-4">
          {websites.map((website) => (
            <motion.div
              key={website.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h4 className="font-medium">{website.title}</h4>
                <a 
                  href={website.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {website.url}
                </a>
              </div>

              {isAdmin && (
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteWebsite(website.id)}
                >
                  Delete
                </Button>
              )}
            </motion.div>
          ))}

          {websites.length === 0 && (
            <p className="text-center text-muted-foreground">
              No websites added yet.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
