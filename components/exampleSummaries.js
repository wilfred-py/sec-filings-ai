import { Mail } from 'lucide-react'
import { ReactNode } from 'react';


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
];

export default notifications; 