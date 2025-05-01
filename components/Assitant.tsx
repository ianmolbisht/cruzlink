"use client";

import { useEffect, useState } from "react";
import { usePorcupine } from "@picovoice/porcupine-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { getGeminiResponse } from "@/utils/gemini";
import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/mobile-layout";
import { ThemeToggle } from "@/components/theme-toggle";
import { Mic, Heart, User, Battery } from "lucide-react";

export default function VoiceAssistant() {
  const {
    keywordDetection,
    isLoaded,
    isListening: isWakewordListening,
    init,
    start: startWakeword,
    stop: stopWakeword,
  } = usePorcupine();

  const {
    transcript,
    listening: isRecording,
    resetTranscript,
  } = useSpeechRecognition();

  const [aiResponse, setAiResponse] = useState("");
  const [finalText, setFinalText] = useState("");
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);

  const ACCESS_KEY = "19o4VjDANhTicZmwkEZaouAEpxfO4x5njWS5AamiV9W76LbLOl0zOw=="; // 🔑 Replace with your Picovoice access key
  const keywordPath = "/Hey-Cruz_en_wasm_v3_0_0.ppn";
  const modelPath = "/porcupine_params.pv";

  // 🛠️ Setup Wakeword and Start Listening Immediately
  useEffect(() => {
    const porcupineKeyword = {
      publicPath: keywordPath,
      label: "Hey Cruz",
    };
    const porcupineModel = { publicPath: modelPath };

    const setupWakeword = async () => {
      await init(ACCESS_KEY, porcupineKeyword, porcupineModel);
      await startWakeword();
      console.log("🔊 Wakeword listening started automatically!");
    };

    setupWakeword();
  }, []);

  // 🎯 When Wakeword is detected
  useEffect(() => {
    if (keywordDetection) {
      console.log("🟢 Wake word detected:", keywordDetection.label);
      stopWakeword();
      startRecording();
    }
  }, [keywordDetection]);

  // 🎯 While Recording: Restart Silence Timer on every transcript update
  useEffect(() => {
    if (isRecording) {
      if (silenceTimer) clearTimeout(silenceTimer);

      const timer = setTimeout(() => {
        console.log("⏹️ Silence detected. Stopping recording.");
        stopRecording();
      }, 5000); // 5 seconds of no speech = stop recording

      setSilenceTimer(timer);
    }
  }, [transcript]);

  // 🎤 Start Recording user input
  const startRecording = () => {
    setAiResponse("")
    
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
    console.log("🎤 Started recording user query...");
  };

  // 🛑 Stop Recording and save final transcript
  const stopRecording = async () => {
    SpeechRecognition.stopListening();

    console.log("⏹️ Stopping recording... Waiting for final transcript...");

    await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms

    setFinalText(transcript);
    console.log("✅ Final captured text:", transcript);

    if (transcript.trim()) {
      const aiReply = await getGeminiResponse(transcript);
      setAiResponse(aiReply);
      console.log("🤖 Gemini says:", aiReply);

      speak(aiReply); // 🎤 Speak out loud the response!
    } else {
      console.log("⚠️ No valid input captured.");
    }

    startWakeword(); // Restart wakeword
  };

  // 📢 Text-to-Speech Function
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN"; // You can change to 'en-IN', 'en-UK', etc.
      utterance.rate = 1; // speed (0.5 slower, 1 normal, 1.5 faster)
      utterance.pitch = 1; // voice pitch
      utterance.volume = 1; // volume from 0 to 1
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported in this browser.");
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-between h-full">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              <h1 className="text-xl font-bold">CruzLink AI Assistant</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Mic className={`h-6 w-6 ${isWakewordListening ? "animate-spin" : ""}`} />
                <span className="sr-only">Voice Assistant</span>
              </Button>
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-center items-center">
              {isWakewordListening && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Listening for wakeword...</span>
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-4 border-gray-500"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="w-full max-w-3xl">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <h2 className="text-lg font-semibold">Live Transcript</h2>
                <div className="p-2 border rounded text-black bg-gray-100">{transcript}</div>
              </div>
            </div>
          </div>


          {aiResponse && (
            <div className="w-full max-w-3xl mt-6">
              <div className="bg-green-100 text-black p-4 rounded-md">
                <h3 className="text-lg font-semibold">🤖 Cruz says:</h3>
                <p>{aiResponse}</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full p-4">
          <div className="flex justify-between items-center mb-3">
            <Battery  />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
