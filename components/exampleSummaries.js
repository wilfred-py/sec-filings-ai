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
    icon: <Mail className="text-gray-500 mr-2" />,
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
      { label: "Cloud Segment Revenue", value: "$24.09B", growth: 20.38, unit: "% YoY" }
      ],
      insights: [
      "Azure and other cloud services revenue grew 33%",
      "$75.4 billion Activision Blizzard acquisition completed October 2023, positioning Microsoft for gaming market expansion.",
      "Unprecedented datacenter expansion with '$108.7 billion' in future lease commitments, indicating massive scale of AI/cloud infrastructure buildout." 
      ],
      risks: [
      "Heavy investments in AI computing infrastructure are directly compressing gross margins in the cloud segment.",
      "Supply chain competition for AI chips and other components could increase input costs and reduce hardware margins.",
      "Company notes EU AI Act and U.S. AI Executive Order may 'increase costs or restrict opportunity' in AI development."
    ]
      } 
    ,
  {
    icon: <Mail className="text-red-500 mr-2" />,
    company: "Tesla, Inc. (TSLA)",
    period: "Q3 2024",
    financials: [
      { label: "Revenue", value: "$25.18B", growth: 8, unit: "% YoY" },
      { label: "Operating Margin", value: "$2.72B", growth: 10.8, unit: "% YoY" },
      { label: "Energy Generation and Storage Segment Revenue", value: "2.38B", growth: 52, unit: "% YoY" }
    ],
    insights: [
      "Systematic cost reductions across production and logistics could drive sustained margin expansion.",
      "Growth in regulatory credit sales provides high-margin revenue as these credits have minimal associated costs.",
      "Recognition of IRA manufacturing credits directly reduces production costs, expanding gross margins in the energy storage segment."
    ],
    risks: [
      "Continued vehicle price cuts directly compress automotive gross margins.",
      "Initial production inefficiencies for new models increase per-unit costs and reduce margins during ramp periods.",
      "Rising labor and supply chain costs could compress margins if unable to offset through pricing or efficiency gains."
    ]
  },
  {
    icon: <Mail className="text-blue-500 mr-2" />,
    company: "JPMorgan Chase & Co. (JPM)",
    period: "Q3 2024",
    financials: [
      {
      label: "Revenue", value: "$42.7 billion", growth: 7, unit: "% YoY"},
      {label: "Operating Margin", value: "53%", growth: -2, unit: "% YoY"},
      {label: "CIB Revenue", value: "$17.0 billion", growth: 8, unit: "% YoY"}
      ],
      insights: [
        "CIB Markets revenue up 8% YoY with growth in Equity Markets",
        "Credit card sales volume growth boosts payments revenue",
        "Commercial lending growth supports net interest income",
      ],
      risks: [
        "Credit losses could increase in an economic downturn",
        "Deterioration in real estate loans could increase credit costs",
        "Market volatility negatively impacts CIB's Fixed Income and Equity Markets revenues",
      ]
      },
      {
        icon: <Mail className="text-red-500 mr-2" />,
        company: "Costco Wholesale Corporation",
        period: "Q1 2025",
        financials: [
            {
                label: "Revenue", value: "$62,151M", growth: 7.5, unit: "% YoY"
            },
            {
                label: "Operating Margin", value: "$2,196M", growth: 10.7, unit: "% YoY"
            },
            {
                label: "Core Merchandise Sales", value: "$49,451M", growth: 10.0, unit: "% YoY"
            }
        ],
        insights: [
            "Membership fees grew 8% with strong Executive member conversion",
            "E-commerce sales growth outpaced overall company at 13%",
            "Core merchandise categories showed strong 10% growth"
        ],
        risks: [
            "Foreign currency translation reduced sales by $164M",
            "SG&A expenses increased as percentage of sales by 14 basis points",
            "Gasoline price volatility impacting total sales metrics"
        ]
    }

];

// Update the transactionRelatedFilings array with entries for all specified companies
const transactionRelatedFilings = [
  {
    company: "Apple Inc. (AAPL)",
    reportDate: "31 Oct 2024",
    eventType: "Quarterly Results",
    summary: "Record Q4 revenue of $94.9B amid product launches and AI features debut",
    positiveDevelopments: "6% revenue growth, Services revenue at all-time high, new product launches",
    potentialConcerns: "$10.2B one-time tax charge, slight decline in Greater China revenue",
    structuralChanges: "Introduction of Apple Intelligence AI features",
    additionalNotes: "Q4 earnings call scheduled for October 31, 2024 at 2:00 p.m. PT"
  },
  {
    company: "Microsoft Corporation (MSFT)",
    reportDate: "10 Dec 2024",
    eventType: "Annual Meeting Results & Investment Write-Down",
    summary: "Annual shareholder meeting concludes with board re-elections; $800M Cruise investment impairment announced",
    positiveDevelopments: "All directors re-elected with 90%+ approval; Deloitte & Touche appointment approved",
    potentialConcerns: "$800M impairment charge on Cruise investment; growing shareholder interest in AI governance",
    structuralChanges: "None reported",
    additionalNotes: "Multiple AI-related shareholder proposals rejected; Q2 EPS impact of $0.09 expected"
  },
  {
    company: "Tesla, Inc. (TSLA)",
    reportDate: "02 Jan 2025",
    eventType: "Quarterly Results",
    summary: "Tesla hits Q4 records: 495K vehicles delivered, 11GWh energy deployed",
    positiveDevelopments: "Record Q4 deliveries (495K), annual production (1.77M), energy storage growth (11GWh)",
    potentialConcerns: "5-6% vehicles under lease, delivery exceeds production by 36K units",
    structuralChanges: "None reported",
    additionalNotes: "Q4 earnings call scheduled Jan 29, 2025"
  },
  {
    company: "JPMorgan Chase & Co. (JPM)",
    reportDate: "12 Dec 2024",
    eventType: "Board Appointment",
    summary: "Hershey CEO Michele Buck elected to JPMorgan board, effective March 2025",
    positiveDevelopments: "Strategic addition of Fortune 500 CEO with 30+ years consumer experience",
    potentialConcerns: "None reported",
    structuralChanges: "Addition of new board member with consumer transformation expertise",
    additionalNotes: "Buck also serves on New York Life board, has extensive operational experience"
  },
  {
    company: "Costco Wholesale Corporation (COST)",
    reportDate: "12 Dec 2024",
    eventType: "Quarterly Results",
    summary: "Q1 FY25 shows 7.5% revenue growth with strong e-commerce and membership gains",
    positiveDevelopments: "Net sales up 7.5%, e-commerce sales up 13%, membership growth 7.6%",
    potentialConcerns: "Slower international growth, inventory levels up 12.5%",
    structuralChanges: "26 new warehouses planned for FY2025",
    additionalNotes: "90.4% worldwide membership renewal rate, expanding Kirkland Signature product line"
  },

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

export {notifications, transactionRelatedFilings, ownershipChanges}