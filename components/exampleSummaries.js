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
    filingDate: "18 Dec 2024",
    filerName: "Jeffrey E. Williams",
    relationship: "Officer - COO",
    ownershipType: "Direct (through living trust)", 
    totalValue: "$24,997,418.27",
    percentageChange: "-20.41%",
    previousStake: "489,944 shares",
    newStake: "389,944 shares",
    summary: "Apple Inc. COO Jeffrey Williams sold 100,000 shares of Common Stock through four transactions on Dec 16, 2024, with prices ranging from $248.61 to $251.10 per share, totaling $24,997,418.27. The sales were executed under a Rule 10b5-1 trading plan, with shares held through his living trust. This reduced his holdings by 20.41% from 489,944 to 389,944 shares."
  },
  {
    company: "Microsoft Corp (MSFT)",
    filingDate: "16 Dec 2024",
    filerName: "Alice L. Jolla",
    relationship: "Chief Accounting Officer",
    ownershipType: "Direct",
    totalValue: "$276,147.87",
    percentageChange: "-0.87%",
    previousStake: "71,210.4106 shares",
    newStake: "70,593.0086 shares",
    summary: "Disposition of 617.402 shares of Common Stock at $447.27 per share through tax withholding (Transaction Code F)."
    },
    {
      company: "Tesla, Inc. (TSLA)",
      filingDate: "31 Dec 2024",
      filerName: "Elon Musk",
      relationship: "CEO, Director, 10% Owner",
      ownershipType: "Indirect (Through Elon Musk Revocable Trust)",
      totalValue: "$0",
      percentageChange: "-0.065%",
      previousStake: "411,062,076",
      newStake: "410,794,076",
      summary: "Gifted 268,000 shares of Common Stock to charitable organizations as part of year-end tax planning."
      },
      {
        company: "JPMorgan Chase & Co (JPM)",
        filingDate: "02 Jan 2025",
        filerName: "Stephen B. Burke",
        relationship: "Director",
        ownershipType: "Direct and Indirect (GRAT and Trust)",
        totalValue: "$56,250.48",
        percentageChange: "0.13%",
        previousStake: "255,543.0525",
        newStake: "255,777.711",
        summary: "Acquisition of 234.6585 shares of Common Stock as part of quarterly director retainer deferral program at $239.71 per share."
        },
      {
        company: "Costco Wholesale Corp",
        filingDate: "23 Dec 2024",
        filerName: "W Craig Jelinek",
        relationship: "Director",
        ownershipType: "Direct and Indirect (Multiple GRATs)",
        totalValue: "$0 (Gift Transaction)",
        percentageChange: "-0.98%",
        previousStake: "206,382.061 shares (Direct), 150,027 shares (Indirect)",
        newStake: "204,365.061 shares (Direct), 150,027 shares (Indirect)",
        summary: "Gift disposition of 2,017 shares of Common Stock, comprising 17 shares to a charitable non-profit organization and 2,000 shares to a donor advised fund."
        },

];

export {notifications, transactionRelatedFilings, ownershipChanges}