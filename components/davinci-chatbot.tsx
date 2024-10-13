'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import ConnectButton from './connectButton'
import { useAppKitAccount } from "@reown/appkit/react"


export function DavinciChatbot() {
  const { address, isConnected } = useAppKitAccount()
  const [messages, setMessages] = useState([
    { type: 'ai', content: "Hello, I am Leonardo da Vinci's AI twin. How may I assist you today?" }
  ])
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || !isConnected) return

    // Add user message to state
    setMessages(prev => [...prev, { type: 'human', content: input }])
    setInput('')

    try {
      const response = await fetch('/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address, prompt: input }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      
      // Add AI response to state
      setMessages(prev => [...prev, { type: 'ai', content: data.response }])

      // If there's generated art, you might want to display it
      if (data.artUrl) {
        // You can add this to the messages state or handle it separately
        setMessages(prev => [...prev, { type: 'ai', content: `Generated art: ${data.artUrl}` }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { type: 'ai', content: 'Sorry, I encountered an error. Please try again.' }])
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-mono">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Leonardo AI</div>
        <ConnectButton />
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Leonardo da Vinci Image Half */}
        <div className="w-1/2 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/vinci.jpeg')",
              filter: "grayscale(50%) sepia(20%)"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl font-bold mb-2">Leonardo da Vinci</h1>
            <p className="text-xl">AI Digital Twin</p>
          </div>
        </div>

        {/* Chatbot Interface Half */}
        <div className="w-1/2 flex flex-col p-8">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`${msg.type === 'ai' ? 'bg-gray-800 ml-auto' : 'bg-gray-700'} p-4 rounded-lg shadow-md max-w-xs`}>
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && isConnected && handleSendMessage()}
              placeholder={isConnected ? "Type your message..." : "Connect wallet to chat"}
              className="flex-1 bg-transparent outline-none"
              disabled={!isConnected}
            />
            <button 
              onClick={handleSendMessage}
              className={`ml-2 ${isConnected ? 'text-blue-400 hover:text-blue-300' : 'text-gray-500 cursor-not-allowed'} transition-colors`}
              disabled={!isConnected}
            >
              <Send size={20} />
            </button>
            {!isConnected && (
              <div className="absolute -top-10 left-0 bg-gray-700 text-white p-2 rounded shadow-lg">
                Please connect your wallet to chat
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
