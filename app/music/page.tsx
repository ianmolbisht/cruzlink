"use client"

import { useState } from "react"
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, Repeat, VolumeX, Music } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileLayout } from "@/components/mobile-layout"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MusicPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [currentTime, setCurrentTime] = useState(65) // seconds
  const [duration, setDuration] = useState(214) // seconds
  const [isMuted, setIsMuted] = useState(false)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center p-4 border-b">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Music & Audio</h1>
        </div>

        <Tabs defaultValue="now-playing" className="flex-1">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="now-playing" className="flex-1">
                Now Playing
              </TabsTrigger>
              <TabsTrigger value="playlists" className="flex-1">
                Playlists
              </TabsTrigger>
              <TabsTrigger value="podcasts" className="flex-1">
                Podcasts
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="now-playing" className="p-4 flex-1 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-48 h-48 bg-gray-200 rounded-lg mb-6 overflow-hidden flex items-center justify-center">
                <Music className="h-24 w-24 text-gray-400" />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-xl font-bold">Safety First</h2>
                <p className="text-gray-500">Riding Podcast • Episode 42</p>
              </div>

              <div className="w-full mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Slider value={[currentTime]} max={duration} step={1} className="w-full" />
              </div>

              <div className="flex items-center justify-center gap-4 mb-8">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  onClick={togglePlay}
                  size="icon"
                  className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              <div className="w-full flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolume(value[0])}
                  className="flex-1"
                  disabled={isMuted}
                />
                <Button variant="ghost" size="icon">
                  <Repeat className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="playlists" className="p-4">
            <div className="space-y-3">
              <Card className="hover:bg-gray-50 cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded mr-3 overflow-hidden flex items-center justify-center">
                      <Music className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">Riding Playlist</h3>
                      <p className="text-xs text-gray-500">15 songs • 58 min</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:bg-gray-50 cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded mr-3 overflow-hidden flex items-center justify-center">
                      <Music className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">Workout Mix</h3>
                      <p className="text-xs text-gray-500">22 songs • 1h 15min</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:bg-gray-50 cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded mr-3 overflow-hidden flex items-center justify-center">
                      <Music className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">Chill Vibes</h3>
                      <p className="text-xs text-gray-500">18 songs • 1h 5min</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full mt-2" variant="outline">
                Create New Playlist
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="podcasts" className="p-4">
            <div className="space-y-3">
              <Card className="hover:bg-gray-50 cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded mr-3 overflow-hidden flex items-center justify-center">
                      <Music className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">Safety First</h3>
                      <p className="text-xs text-gray-500">Episode 42 • 45 min</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:bg-gray-50 cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded mr-3 overflow-hidden flex items-center justify-center">
                      <Music className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">Tech Talk</h3>
                      <p className="text-xs text-gray-500">Episode 127 • 55 min</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:bg-gray-50 cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded mr-3 overflow-hidden flex items-center justify-center">
                      <Music className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">Helmet Innovation</h3>
                      <p className="text-xs text-gray-500">Episode 15 • 32 min</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full mt-2" variant="outline">
                Browse More Podcasts
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
