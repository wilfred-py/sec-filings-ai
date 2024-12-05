"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Mail, Sun, Moon } from 'lucide-react'
import axios from 'axios'

const notifications = [
  {
    icon: <Mail className="text-blue-500 mr-2" />,
    company: "Apple Inc. (AAPL)",
    period: "Q2 2023",
    financials: [
      { label: "Revenue", value: "$94.8B (↑ 2% YoY)" },
      { label: "EPS", value: "$1.52 (↑ 5% YoY)" },
      { label: "iPhone Sales", value: "$51.3B (↑ 1.5% YoY)" }
    ],
    insights: [
      "Focus on AI and machine learning integration across products",
      "Expansion in emerging markets, particularly India",
      "Continued investment in services ecosystem"
    ],
    risks: [
      "Global economic uncertainties affecting consumer spending",
      "Supply chain disruptions and component shortages",
      "Increasing regulatory scrutiny in key markets"
    ]
  },
  {
    icon: <Mail className="text-blue-500 mr-2" />,
    company: "Microsoft Corporation (MSFT)",
    period: "Q3 2023",
    financials: [
      { label: "Revenue", value: "$52.9B (↑ 7% YoY)" },
      { label: "Net Income", value: "$18.3B (↑ 9% YoY)" },
      { label: "Cloud Revenue", value: "$28.5B (↑ 22% YoY)" }
    ],
    insights: [
      "Accelerated AI integration across product lines",
      "Strong growth in Azure and cloud services",
      "Continued focus on productivity and business process solutions"
    ],
    risks: [
      "Expansion of AI and machine learning capabilities",
      "Potential slowdown in cloud spending due to economic factors",
      "Intensifying competition in cloud and AI markets"
    ]
  },
  {
    icon: <Mail className="text-blue-500 mr-2" />,
    company: "The Coca-Cola Company (KO)",
    period: "Q1 2023",
    financials: [
      { label: "Net Revenue", value: "$10.98B (↑ 5% YoY)" },
      { label: "Organic Revenue Growth", value: "12%" },
      { label: "EPS", value: "$0.64 (↑ 12% YoY)" }
    ],
    insights: [
      "Strong growth in developing and emerging markets",
      "Successful pricing strategies offsetting inflationary pressures",
      "Continued focus on innovation in zero-sugar and ready-to-drink products"
    ],
    risks: [
      "Ongoing global economic uncertainties and inflationary pressures",
      "Changing consumer preferences and health concerns",
      "Increased competition in the non-alcoholic beverage market"
    ]
  },
  {
    icon: <Mail className="text-green-500 mr-2" />,
    company: "NVIDIA Corporation (NVDA)",
    period: "Q1 2023",
    financials: [
      { label: "Revenue", value: "$7.19B (↓ 13% YoY)" },
      { label: "EPS", value: "$0.82 (↓ 20% YoY)" },
      { label: "Gross Margin", value: "64.6% (↓ 270 bps YoY)" }
    ],
    insights: [
      "Strong demand in Data Center and Automotive segments",
      "Continued leadership in AI and accelerated computing",
      "Expansion of software and services offerings"
    ],
    risks: [
      "Volatility in cryptocurrency mining demand",
      "Intense competition in the GPU market",
      "Geopolitical tensions affecting global supply chains"
    ]
  },
  {
    icon: <Mail className="text-red-500 mr-2" />,
    company: "Tesla, Inc. (TSLA)",
    period: "Q2 2023",
    financials: [
      { label: "Revenue", value: "$24.93B (↑ 47% YoY)" },
      { label: "EPS", value: "$0.91 (↑ 20% YoY)" },
      { label: "Vehicle Deliveries", value: "466,140 (↑ 83% YoY)" }
    ],
    insights: [
      "Continued expansion of production capacity globally",
      "Advancements in autonomous driving technology",
      "Growth in energy generation and storage business"
    ],
    risks: [
      "Increasing competition in the electric vehicle market",
      "Regulatory challenges in various markets",
      "Supply chain constraints for critical components"
    ]
  },
  {
    icon: <Mail className="text-blue-500 mr-2" />,
    company: "Netflix, Inc. (NFLX)",
    period: "Q2 2023",
    financials: [
      { label: "Revenue", value: "$8.19B (↑ 2.7% YoY)" },
      { label: "EPS", value: "$3.29 (↑ 3.5% YoY)" },
      { label: "Paid Memberships", value: "238.39M (↑ 8% YoY)" }
    ],
    insights: [
      "Successful implementation of paid sharing",
      "Strong growth in ad-supported tier",
      "Continued investment in original content production"
    ],
    risks: [
      "Intense competition in the streaming industry",
      "Content cost inflation and production delays",
      "Potential market saturation in key regions"
    ]
  },
  {
    icon: <Mail className="text-gray-500 mr-2" />,
    company: "Alcoa Corporation (AA)",
    period: "Q2 2023",
    financials: [
      { label: "Revenue", value: "$2.68B (↓ 25.2% YoY)" },
      { label: "Adjusted EBITDA", value: "$137M (↓ 87.3% YoY)" },
      { label: "Free Cash Flow", value: "-$56M" }
    ],
    insights: [
      "Focus on operational efficiency and cost reduction",
      "Progress on sustainability initiatives",
      "Strategic review of global production assets"
    ],
    risks: [
      "Volatility in aluminum and alumina prices",
      "Global economic uncertainties affecting demand",
      "Increasing energy costs impacting production"
    ]
  },
  {
    icon: <Mail className="text-yellow-500 mr-2" />,
    company: "Caterpillar Inc. (CAT)",
    period: "Q2 2023",
    financials: [
      { label: "Revenue", value: "$17.32B (↑ 22% YoY)" },
      { label: "Adjusted EPS", value: "$5.55 (↑ 75% YoY)" },
      { label: "Operating Profit Margin", value: "21.1% (↑ 540 bps YoY)" }
    ],
    insights: [
      "Strong demand across all segments and regions",
      "Continued investment in services and digital capabilities",
      "Focus on operational excellence and cost management"
    ],
    risks: [
      "Supply chain challenges and material cost inflation",
      "Potential economic slowdown affecting construction and mining sectors",
      "Geopolitical tensions impacting global operations"
    ]
  },
  {
    icon: <Mail className="text-blue-500 mr-2" />,
    company: "Salesforce, Inc. (CRM)",
    period: "Q2 FY2024",
    financials: [
      { label: "Revenue", value: "$8.60B (↑ 11% YoY)" },
      { label: "Non-GAAP EPS", value: "$2.12 (↑ 78% YoY)" },
      { label: "Operating Cash Flow", value: "$808M (↑ 143% YoY)" }
    ],
    insights: [
      "Strong adoption of AI-powered CRM solutions",
      "Expansion of industry-specific cloud offerings",
      "Focus on profitability and operational efficiency"
    ],
    risks: [
      "Intense competition in the CRM and cloud markets",
      "Integration challenges from recent acquisitions",
      "Potential impact of economic uncertainties on enterprise IT spending"
    ]
  }
]

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [currentNotification, setCurrentNotification] = useState(0)
  const [progress, setProgress] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setCurrentNotification((prev) => (prev + 1) % notifications.length)
          return 0
        }
        return prevProgress + (100 / 60) // 100% over 6 seconds (60 steps of 100ms each)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3001/api/subscribe', { email })
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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Comprehensive AI-Powered SEC Filing Summaries</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Get concise, AI-generated summaries of SEC filings for US equities, including key financials, management insights, and risk factors, delivered straight to your inbox.
                </p>
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
                  <button
                    onClick={() => handleDotClick(0)}
                    className={`h-3 w-3 rounded-full transition-all duration-200 ${
                      0 === currentNotification ? 'bg-blue-500 scale-125' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    aria-label="Go to summary 1"
                    aria-current={0 === currentNotification ? 'true' : 'false'}
                  />
                  <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                  <button
                    onClick={() => handleDotClick(2)}
                    className={`h-3 w-3 rounded-full transition-all duration-200 ${
                      2 === currentNotification ? 'bg-blue-500 scale-125' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    aria-label="Go to summary 3"
                    aria-current={2 === currentNotification ? 'true' : 'false'}
                  />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}