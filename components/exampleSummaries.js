import { Mail } from 'lucide-react'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'


const renderGrowth = (value, unit = '') => {
  if (!value) return null;
  const isPositive = !String(value).includes('-');
  const numericValue = String(value).replace(/[-+]/g, '').trim();
  
  return (
    <span className={`inline-flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      {isPositive ? <FaCaretUp className="mr-1" /> : <FaCaretDown className="mr-1" />}
      {numericValue}{unit}
    </span>
  );
};

const notifications = [
  {
    icon: <Mail className="text-blue-500 mr-2" />,
    company: "Apple Inc. (AAPL)",
    period: "Q3 2024",
    financials: [
    { label: "Revenue", value: "$85.8B", growth: -5.5, unit: "% QoQ" },
    { label: "EPS", value: "$1.40", growth: -8.5, unit: "% QoQ" },
    { label: "iPhone Sales", value: "$39.3B", growth: -14.5, unit: "% QoQ" }
    ],
    insights: [
    "Strong Services growth +14% YoY driven by advertising and App Store",
    "iPad segment showing robust performance with 24% YoY growth",
    "Geographic expansion despite China market challenges"
    ],
    risks: [
    "EU Digital Markets Act investigations with potential 10% revenue fines",
    "DOJ antitrust lawsuit challenging smartphone market position",
    "App Store business model changes due to regulatory pressures"
    ]
    },
    {
      icon: <Mail className="text-blue-500 mr-2" />,
      company: "Microsoft Corporation (MSFT)",
      period: "Q3 2024",
      financials: [
      { label: "Revenue", value: "$65.6B", growth: 16.0, unit: "% YoY" },
      { label: "Net Income", value: "$24.7B", growth: 10.7, unit: "% YoY" },
      { label: "Service Revenue", value: "$50.3B", growth: 22.8, unit: "% YoY" }
      ].map(item => ({
      ...item,
      displayValue: `${item.value} (${renderGrowth(item.growth, item.unit)})`
      })),
      insights: [
      "Service & cloud revenue drives growth at +22.8% YoY",
      "Continued operating margin strength at 46.6%",
      "Product revenue slightly declined by -1.7% YoY",
      "Diluted EPS grew 10.4% to $3.30"
      ],
      risks: [
      "Operating margin compression (down 1.0 percentage points)",
      "Cost of revenue growing faster than revenue",
      "Product revenue showing slight decline",
      "Rising operating expenses across R&D, sales, and admin",
      "Increased tax provision impact on net margins"
      ]
      } 
    ,
  {
    icon: <Mail className="text-blue-500 mr-2" />,
    company: "The Coca-Cola Company (KO)",
    period: "Q1 2023",
    financials: [
      { label: "Net Revenue", value: "$10.98B", growth: 5, unit: "% YoY" },
      { label: "Organic Revenue Growth", value: "12%", growth: 12, unit: "%" },
      { label: "EPS", value: "$0.64", growth: 12, unit: "% YoY" }
    ].map(item => ({
      ...item,
      displayValue: `${item.value} (${renderGrowth(item.growth, item.unit)})`
    })),
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
      { label: "Revenue", value: "$7.19B", growth: -13, unit: "% YoY" },
      { label: "EPS", value: "$0.82", growth: -20, unit: "% YoY" },
      { label: "Gross Margin", value: "64.6%", growth: -270, unit: " bps YoY" }
    ].map(item => ({
      ...item,
      displayValue: `${item.value} (${renderGrowth(item.growth, item.unit)})`
    })),
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
      { label: "Revenue", value: "$24.93B", growth: 47, unit: "% YoY" },
      { label: "EPS", value: "$0.91", growth: 20, unit: "% YoY" },
      { label: "Vehicle Deliveries", value: "466,140", growth: 83, unit: "% YoY" }
    ].map(item => ({
      ...item,
      displayValue: `${item.value} (${renderGrowth(item.growth, item.unit)})`
    })),
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
      { label: "Revenue", value: "$8.19B", growth: 2.7, unit: "% YoY" },
      { label: "EPS", value: "$3.29", growth: 3.5, unit: "% YoY" },
      { label: "Paid Memberships", value: "238.39M", growth: 8, unit: "% YoY" }
    ].map(item => ({
      ...item,
      displayValue: `${item.value} (${renderGrowth(item.growth, item.unit)})`
    })),
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
      { label: "Revenue", value: "$2.68B", growth: -25.2, unit: "% YoY" },
      { label: "Adjusted EBITDA", value: "$137M", growth: -87.3, unit: "% YoY" },
      { label: "Free Cash Flow", value: "-$56M", growth: null }
    ].map(item => ({
      ...item,
      displayValue: item.growth !== null 
        ? `${item.value} (${renderGrowth(item.growth, item.unit)})`
        : item.value
    })),
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
      { label: "Revenue", value: "$17.32B", growth: 22, unit: "% YoY" },
      { label: "Adjusted EPS", value: "$5.55", growth: 75, unit: "% YoY" },
      { label: "Operating Profit Margin", value: "21.1%", growth: 540, unit: " bps YoY" }
    ].map(item => ({
      ...item,
      displayValue: `${item.value} (${renderGrowth(item.growth, item.unit)})`
    })),
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
      { label: "Revenue", value: "$8.60B", growth: 11, unit: "% YoY" },
      { label: "Non-GAAP EPS", value: "$2.12", growth: 78, unit: "% YoY" },
      { label: "Operating Cash Flow", value: "$808M", growth: 143, unit: "% YoY" }
    ].map(item => ({
      ...item,
      displayValue: `${item.value} (${renderGrowth(item.growth, item.unit)})`
    })),
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

// Update the transactionRelatedFilings array with entries for all specified companies
const transactionRelatedFilings = [
  {
    company: "Apple Inc. (AAPL)",
    filingDate: "2024-12-15",
    eventDate: "2024-12-10",
    eventType: "Senior Executive Departure",
    summary: "Apple announced the unexpected departure of its Chief Financial Officer, citing personal reasons. The company has initiated a search for a successor and appointed an interim CFO.",
    potentialImpact: "This sudden change in senior leadership could potentially impact Apple's financial strategy and investor relations in the short term."
  },
  {
    company: "Microsoft Corporation (MSFT)",
    filingDate: "2024-11-30",
    eventDate: "2024-11-28",
    eventType: "Major Acquisition",
    summary: "Microsoft completed the acquisition of a leading AI research company for $5 billion, aiming to bolster its position in the artificial intelligence market.",
    potentialImpact: "This acquisition is expected to significantly enhance Microsoft's AI capabilities and could lead to new product innovations across its suite of services."
  },
  {
    company: "The Coca-Cola Company (KO)",
    filingDate: "2024-10-05",
    eventDate: "2024-10-01",
    eventType: "Restructuring Plan",
    summary: "Coca-Cola announced a global restructuring plan aimed at streamlining operations and reducing costs. The plan includes a workforce reduction of approximately 4,000 employees.",
    potentialImpact: "While this restructuring may lead to short-term costs, it is expected to improve operational efficiency and profitability in the long run."
  },
  {
    company: "NVIDIA Corporation (NVDA)",
    filingDate: "2024-09-20",
    eventDate: "2024-09-15",
    eventType: "New Product Launch",
    summary: "NVIDIA unveiled its next-generation GPU architecture, promising unprecedented performance for AI and gaming applications.",
    potentialImpact: "This launch could solidify NVIDIA's market leadership and drive significant revenue growth in the coming quarters."
  },
  {
    company: "Tesla, Inc. (TSLA)",
    filingDate: "2024-08-10",
    eventDate: "2024-08-05",
    eventType: "Factory Expansion",
    summary: "Tesla announced plans to build a new Gigafactory in India, aiming to tap into the growing electric vehicle market in South Asia.",
    potentialImpact: "This expansion could significantly increase Tesla's production capacity and market share in emerging markets."
  },
  {
    company: "Netflix, Inc. (NFLX)",            
    filingDate: "2024-07-25",
    eventDate: "2024-07-20",
    eventType: "Content Acquisition",
    summary: "Netflix acquired exclusive streaming rights to a popular franchise for $1 billion, securing content for the next decade.",
    potentialImpact: "This major content acquisition could attract new subscribers and improve retention rates in the highly competitive streaming market."
  },
  {
    company: "Alcoa Corporation (AA)",
    filingDate: "2024-06-15",
    eventDate: "2024-06-10",
    eventType: "Environmental Initiative",
    summary: "Alcoa committed to a $500 million investment in sustainable aluminum production technologies, aiming to reduce its carbon footprint by 30% by 2030.",
    potentialImpact: "This initiative could improve Alcoa's ESG profile and potentially lead to long-term cost savings and increased market share."
  },
  {
    company: "Caterpillar Inc. (CAT)",
    filingDate: "2024-05-05",
    eventDate: "2024-05-01",
    eventType: "Strategic Partnership",
    summary: "Caterpillar entered into a strategic partnership with a leading autonomous vehicle technology company to develop self-operating heavy machinery.",
    potentialImpact: "This partnership could give Caterpillar a competitive edge in the evolving construction and mining equipment market."
  },
  {
    company: "Salesforce, Inc. (CRM)",
    filingDate: "2024-04-20",
    eventDate: "2024-04-15",
    eventType: "Cybersecurity Incident",
    summary: "Salesforce reported a data breach affecting a small percentage of its customers. The company has taken immediate steps to address the issue and enhance its security measures.",
    potentialImpact: "While the immediate impact seems limited, this incident could potentially affect customer trust and lead to increased cybersecurity expenses."
  }
];

// Update the ownershipChanges array with entries for all specified companies
const ownershipChanges = [
  {
    company: "Apple Inc. (AAPL)",
    filingDate: "2024-12-05",
    filerName: "Berkshire Hathaway Inc.",
    changeType: "Increase",
    newStake: "6.5%",
    previousStake: "5.8%",
    summary: "Berkshire Hathaway increased its stake in Apple, reaffirming its confidence in the company's long-term prospects and strong cash flow generation."
  },
  {
    company: "Microsoft Corporation (MSFT)",
    filingDate: "2024-11-20",
    filerName: "The Vanguard Group, Inc.",
    changeType: "Increase",
    newStake: "8.4%",
    previousStake: "8.1%",
    summary: "Vanguard slightly increased its position in Microsoft, likely reflecting the company's strong performance in cloud computing and AI initiatives."
  },
  {
    company: "The Coca-Cola Company (KO)",
    filingDate: "2024-10-15",
    filerName: "BlackRock, Inc.",
    changeType: "Decrease",
    newStake: "7.2%",
    previousStake: "7.8%",
    summary: "BlackRock reduced its stake in Coca-Cola, possibly due to concerns about changing consumer preferences towards healthier beverages."
  },
  {
    company: "NVIDIA Corporation (NVDA)",
    filingDate: "2024-09-10",
    filerName: "FMR LLC",
    changeType: "Increase",
    newStake: "6.8%",
    previousStake: "5.5%",
    summary: "FMR LLC significantly increased its ownership in NVIDIA, likely betting on the company's continued dominance in the AI chip market."
  },
  {
    company: "Tesla, Inc. (TSLA)",
    filingDate: "2024-08-25",
    filerName: "Capital Research Global Investors",
    changeType: "Decrease",
    newStake: "4.5%",
    previousStake: "5.2%",
    summary: "Capital Research Global Investors reduced its position in Tesla, potentially due to increased competition in the electric vehicle market."
  },
  {
    company: "Netflix, Inc. (NFLX)",
    filingDate: "2024-07-30",
    filerName: "T. Rowe Price Associates, Inc.",
    changeType: "Increase",
    newStake: "5.8%",
    previousStake: "4.9%",
    summary: "T. Rowe Price increased its stake in Netflix, possibly due to the company's strong content pipeline and international growth prospects."
  },
  {
    company: "Alcoa Corporation (AA)",
    filingDate: "2024-06-20",
    filerName: "Dimensional Fund Advisors LP",
    changeType: "Increase",
    newStake: "6.2%",
    previousStake: "5.7%",
    summary: "Dimensional Fund Advisors increased its position in Alcoa, potentially seeing value in the company's focus on sustainable aluminum production."
  },
  {
    company: "Caterpillar Inc. (CAT)",
    filingDate: "2024-05-15",
    filerName: "State Street Corporation",
    changeType: "Decrease",
    newStake: "7.6%",
    previousStake: "8.1%",
    summary: "State Street slightly reduced its stake in Caterpillar, possibly due to concerns about global economic slowdown affecting construction and mining sectors."
  },
  {
    company: "Salesforce, Inc. (CRM)",
    filingDate: "2024-04-25",
    filerName: "Primecap Management Company",
    changeType: "Increase",
    newStake: "5.5%",
    previousStake: "4.8%",
    summary: "Primecap Management increased its ownership in Salesforce, likely due to the company's strong position in the CRM market and its successful AI integration strategies."
  }
];

  export default notifications