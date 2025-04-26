"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Mic, MicOff, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface VoiceAssistantProps {
  onClose: () => void
}

// Declare SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
    SpeechSynthesisUtterance: any
    speechSynthesis: any
  }
}

export function VoiceAssistant({ onClose }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const { toast } = useToast()

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")

        setTranscript(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
        toast({
          variant: "destructive",
          title: "Voice Recognition Error",
          description: "Failed to recognize speech. Please try again.",
        })
      }
    } else {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
      })
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [toast])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)

      // Process the transcript if it's not empty
      if (transcript.trim()) {
        processCommand(transcript)
      }
    } else {
      setTranscript("")
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const processCommand = async (command: string) => {
    setIsLoading(true)
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `User command: "${command}". Respond as a helpful voice assistant for a smart helmet app called CruzLink. Keep responses concise and focused on safety, navigation, or helmet features. If asked about navigation, mention you can help with directions. If asked about emergency features, mention the SOS button. If asked about music, mention you can control playback.`,
        maxTokens: 150,
      })

      setResponse(text)

      // Use speech synthesis to speak the response
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error("Error processing command:", error)
      setResponse("I'm sorry, I couldn't process that request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (transcript.trim()) {
      processCommand(transcript)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl w-[90%] max-w-md overflow-hidden shadow-xl">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold">Voice Assistant</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4 h-64 overflow-y-auto">
            {response ? (
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4">
                <p className="text-sm">{response}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                <Mic className="h-12 w-12 mb-3 text-gray-400 dark:text-gray-600" />
                <p>Tap the microphone and ask me anything</p>
                <p className="text-xs mt-2">I can help with navigation, music, and emergency features</p>
              </div>
            )}

            {transcript && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">"{transcript}"</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t dark:border-gray-700">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Type your question..."
                className="flex-1"
              />
              <Button
                type="button"
                variant={isListening ? "destructive" : "default"}
                size="icon"
                onClick={toggleListening}
                className={isListening ? "animate-pulse" : ""}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button type="submit" size="icon" disabled={!transcript.trim() || isLoading}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
