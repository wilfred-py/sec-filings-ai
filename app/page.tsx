"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Sun, Moon } from 'lucide-react'
import axios from 'axios'

import notifications from '@/components/exampleSummaries'

export default function LandingPage() {
const [email, setEmail] = useState('')
const [currentNotification, setCurrentNotification] = useState(0)
const [progress, setProgress] = useState(0)
const [darkMode, setDarkMode] = useState(false)
const [submitStatus, setSubmitStatus] = useState('')

useEffect(() => {
  let animationFrame: number;
  const startTime = Date.now();
  const duration = 6000; // 6 seconds for full cycle

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const newProgress = (elapsed / duration) * 100;

    if (newProgress >= 100) {
      setProgress(0);
      setCurrentNotification(prev => (prev + 1) % notifications.length);
    } else {
      setProgress(newProgress);
      animationFrame = requestAnimationFrame(animate);
    }
  };

  animationFrame = requestAnimationFrame(animate);

  return () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  };
}, [currentNotification]); // Add currentNotification as dependency

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    setSubmitStatus('Subscription successful!')
    setEmail('')
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setSubmitStatus(error.response.data.message)
    } else {
      setSubmitStatus('An error occurred. Please try again.')
    }
  }
}

const handleDotClick = (index: number) => {
setCurrentNotification(index)
setProgress(0)
}

const toggleDarkMode = () => {
setDarkMode(!darkMode)
document.documentElement.classList.toggle('dark')
}

return (
<div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative">
    <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
    >
        <source src="/background.mp4" type="video/mp4" />
    </video>
    
    <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
    
    <div className="relative">
        <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
        <header className="flex justify-between items-center mb-12 max-w-6xl mx-auto w-full">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SEC Filings AI</h1>
            <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            aria-label="Toggle dark mode"
            >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
        </header>
        <main className="flex-grow flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto w-full">
            {/* Left Panel */}
            <div className="w-full lg:w-1/2 max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Save hours deciphering SEC filings</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
                Stay ahead with prompt SEC filing summaries tailored to your investment strategy:
            </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li className="flex">
                        <div className="min-w-[8px] mr-2">•</div>
                        <div className="flex-1"><strong>10-K & 10-Q Annual and Quarterly Reports</strong>: Deep financial insights condensed into actionable intelligence</div>
                    </li>
                    <li className="flex">
                        <div className="min-w-[8px] mr-2">•</div>
                        <div className="flex-1"><strong>8-K Event Tracking</strong>: Instant alerts on significant corporate changes that could impact your investments</div>
                    </li>
                    <li className="flex">
                        <div className="min-w-[8px] mr-2">•</div>
                        <div className="flex-1"><strong>Insider Movement Tracking: Form 4</strong> ownership changes that reveal insider confidence</div>
                    </li>
                </ul>
                <br>
                </br>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500"
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Bell className="mr-2 h-4 w-4" />
                Join the Waitlist
                </Button>
            </form>
            {submitStatus && (
                <p className={`mt-4 text-sm ${submitStatus.includes('successful') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {submitStatus}
                </p>
            )}
            </div>
            
            {/* Right Panel - Carousel */}
            <div className="w-full lg:w-1/2 max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative">
                <div className="flex items-center mb-4">
                {notifications[currentNotification].icon}
                
                <span className="font-semibold text-gray-900 dark:text-white">{notifications[currentNotification].company} {notifications[currentNotification].period} Summary</span>


                </div>
                <div className="space-y-4">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Key Financials:</h3>
                    <div className="grid grid-cols-2 gap-2">
                    {notifications[currentNotification].financials.map((item, index) => (
                        <div key={index} className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</p>
                        <p className="text-sm text-gray-900 dark:text-white">{item.value}</p>
                        </div>
                    ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Management Insights:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                    {notifications[currentNotification].insights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                    ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Risk Factors:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                    {notifications[currentNotification].risks.map((risk, index) => (
                        <li key={index}>{risk}</li>
                    ))}
                    </ul>
                </div>
                </div>
            </div>
            <div className="mt-6 flex justify-center items-center space-x-2">
                {notifications.map((_, index) => (
                <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className="relative h-3 w-3 rounded-full transition-all duration-200 overflow-hidden"
                    aria-label={`Go to summary ${index + 1}`}
                    aria-current={index === currentNotification ? 'true' : 'false'}
                >
                    <div className={`absolute inset-0 ${
                    index === currentNotification ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`} />
                    <div
                    className={`absolute inset-0 bg-blue-500 transition-all duration-100 ease-linear ${
                        index === currentNotification ? 'scale-125' : ''
                    }`}
                    style={{ 
                        width: index === currentNotification ? `${progress}%` : '0%'
                    }}
                    role={index === currentNotification ? 'progressbar' : undefined}
                    aria-valuenow={index === currentNotification ? progress : undefined}
                    aria-valuemin={index === currentNotification ? 0 : undefined}
                    aria-valuemax={index === currentNotification ? 100 : undefined}
                    />
                </button>
                ))}
            </div>
            </div>
        </main>
        </div>
    </div>
    </div>




<a 
href="https://www.freepik.com/free-video/motion-graphic-abstract-halftone-background_3294772#fromView=search&page=1&position=8&uuid=056c9e50-158d-4687-b15e-74fb24ae4241" 
target="_blank" 
rel="noopener noreferrer" 
className="absolute bottom-4 right-4 text-sm text-gray-600 dark:text-gray-300"
>
Designed by Freepik
</a>
</div>
)
}