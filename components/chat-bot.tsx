"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, Minimize2, Bot, User } from "lucide-react"

export function ChatBot() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <Card className="w-96 h-96 bg-black/20 backdrop-blur-md border-purple-500/30 text-white flex flex-col shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          DeepSeek Weather Assistant
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="text-white hover:bg-white/10">
          <Minimize2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.length === 0 && (
            <div className="text-sm text-gray-400 bg-gray-800/50 p-3 rounded-lg">
              🌤️ Hello! I'm your AI weather assistant powered by DeepSeek. Ask me about:
              <ul className="mt-2 text-xs space-y-1">
                <li>• Weather conditions in Nigeria</li>
                <li>• Climate patterns and forecasts</li>
                <li>• Agricultural weather impacts</li>
                <li>• Weather safety tips</li>
              </ul>
            </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-700/80 text-gray-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-purple-400" />}
                  <span className="text-xs font-medium">{message.role === "user" ? "You" : "DeepSeek"}</span>
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700/80 p-3 rounded-lg text-sm max-w-[80%]">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-3 h-3 text-purple-400" />
                  <span className="text-xs font-medium">DeepSeek</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="animate-pulse">Thinking</div>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about weather..."
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            disabled={isLoading}
          />
          <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
