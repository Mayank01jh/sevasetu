/**
 * SevaSetu Seed & Reference Data
 * Compliant with SevaSetu PRD v1.0
 */
window.SEVASETU_INITIAL_DATA = {
  users: [
    {
      id: "usr_admin",
      username: "admin@sevasetu.org",
      email: "admin@sevasetu.org",
      password: "Admin@SevaSetu2026",
      name: "Rajesh Kumar",
      title: "Platform Reviewer & Compliance Lead",
      role: "platform_admin",
      phone: "+91 98111 22334"
    },
    {
      id: "usr_ngo",
      username: "ngo@akshayaseva.org",
      email: "ngo@akshayaseva.org",
      password: "Ngo@Akshaya2026",
      name: "Dr. Ramesh Hegde",
      title: "Trustee, Akshaya Seva Foundation",
      role: "ngo_admin",
      ngoId: "ngo-akshaya",
      phone: "+91 80 4129 8830"
    },
    {
      id: "usr_lead",
      username: "lead@sevasetu.org",
      email: "lead@sevasetu.org",
      password: "Lead@Field2026",
      name: "Ananya Hegde",
      title: "Field Operations & Attendance Lead",
      role: "field_lead",
      phone: "+91 80 4129 8831"
    },
    {
      id: "usr_volunteer",
      username: "volunteer@sevasetu.org",
      email: "volunteer@sevasetu.org",
      password: "Volunteer@2026",
      name: "Mayank Sharma",
      title: "Registered Civic Volunteer",
      role: "volunteer",
      phone: "+91 98765 43210"
    },
    {
      id: "usr_donor",
      username: "donor@sevasetu.org",
      email: "donor@sevasetu.org",
      password: "Donor@2026",
      name: "Mayank Sharma",
      title: "Verified Donor",
      role: "donor",
      pan: "ABCDE1234F",
      phone: "+91 98765 43210"
    }
  ],
  ngos: [
    {
      id: "ngo-akshaya",
      name: "Akshaya Seva Foundation",
      tagline: "Nourishing Minds, Empowering Future Generations",
      mission: "Eliminating classroom hunger by providing certified hygienic, wholesome hot meals to government school children across Karnataka.",
      category: "Education & Nutrition",
      city: "Bengaluru, Karnataka",
      founded: 2014,
      darpanId: "KA/2018/0194821",
      pan: "AAETA1294K",
      reg12A: "AAETA1294KE20214",
      sec80G: "AAETA1294KF20218 (Valid till AY 2028-29)",
      fcraStatus: "Approved (FCRA No: 094421876)",
      verificationStatus: "VERIFIED",
      verifiedDate: "2026-01-14",
      reviewerNotes: "All statutory 12A, 80G, and Darpan documents cross-verified with Income Tax & NITI Aayog portals.",
      trustScore: 98,
      impactMetrics: {
        childrenFedDaily: "34,000+",
        schoolsSupported: 142,
        mealsDeliveredYTD: "1.25M+",
        verifiedAudits: 6
      },
      contacts: {
        email: "contact@akshayaseva.org",
        phone: "+91 80 4129 8830",
        address: "Plot 42, 3rd Block, Koramangala Industrial Area, Bengaluru, Karnataka 560034"
      },
      bankDetails: {
        accountName: "Akshaya Seva Trust",
        bankName: "State Bank of India",
        branch: "Koramangala, Bengaluru",
        ifsc: "SBIN0040182",
        accountNo: "••••••••4819"
      }
    },
    {
      id: "ngo-nanhi-jaan",
      name: "Nanhi Jaan Healthcare Society",
      tagline: "Critical Pediatric Care for Every Child",
      mission: "Procuring life-saving pediatric intensive care equipment, oncology meds, and neonatal ventilators for government district hospitals.",
      category: "Healthcare",
      city: "Chandigarh & NCR",
      founded: 2011,
      darpanId: "CH/2016/0104829",
      pan: "AABAN3841M",
      reg12A: "AABAN3841ME20202",
      sec80G: "AABAN3841MF20216 (Valid till AY 2027-28)",
      fcraStatus: "Not Applicable (Domestic Operations)",
      verificationStatus: "VERIFIED",
      verifiedDate: "2026-02-01",
      reviewerNotes: "Pediatric hospital MOUs verified; audited hospital equipment asset registers inspected.",
      trustScore: 96,
      impactMetrics: {
        infantsTreated: "12,800+",
        nicuUnitsFunded: 28,
        freeSurgeries: 410,
        verifiedAudits: 8
      },
      contacts: {
        email: "care@nanhijaan.org",
        phone: "+91 172 274 9102",
        address: "House 104, Sector 18-A, Chandigarh 160018"
      },
      bankDetails: {
        accountName: "Nanhi Jaan Healthcare Society",
        bankName: "HDFC Bank",
        branch: "Sector 17, Chandigarh",
        ifsc: "HDFC0000043",
        accountNo: "••••••••9102"
      }
    },
    {
      id: "ngo-vriksha",
      name: "Vriksha Green India Trust",
      tagline: "Restoring Native Biospheres and Groundwater Tables",
      mission: "Reviving degraded forest buffers along the Aravali range through Miyawaki afforestation, native endemic saplings, and community water check-dams.",
      category: "Environment & Climate",
      city: "Jaipur, Rajasthan & NCR",
      founded: 2017,
      darpanId: "RJ/2019/0219502",
      pan: "AACTV5510Q",
      reg12A: "AACTV5510QE20221",
      sec80G: "AACTV5510QF20225 (Valid till AY 2028-29)",
      fcraStatus: "Approved (FCRA No: 125540091)",
      verificationStatus: "VERIFIED",
      verifiedDate: "2026-03-10",
      reviewerNotes: "Forestry department permissions and GIS geo-tagged sapling survival audits confirmed.",
      trustScore: 94,
      impactMetrics: {
        treesPlanted: "280,000+",
        hectaresRevived: 185,
        saplingSurvivalRate: "89%",
        verifiedAudits: 5
      },
      contacts: {
        email: "info@vrikshagreen.org",
        phone: "+91 141 239 8812",
        address: "7-C, Green Park Colony, Tonk Road, Jaipur, Rajasthan 302015"
      },
      bankDetails: {
        accountName: "Vriksha Green India Trust",
        bankName: "ICICI Bank",
        branch: "C-Scheme, Jaipur",
        ifsc: "ICIC0000012",
        accountNo: "••••••••6634"
      }
    },
    {
      id: "ngo-shiksha-setu",
      name: "Gramin Shiksha Mission",
      tagline: "Bridging Digital and STEM Literacy in Tribal Belts",
      mission: "Building solar-powered, offline-capable digital classrooms and STEM laboratories in rural tribal residential schools across Odisha and Jharkhand.",
      category: "Education & Nutrition",
      city: "Ranchi, Jharkhand",
      founded: 2018,
      darpanId: "JH/2020/0283719",
      pan: "AAAGS9182C",
      reg12A: "AAAGS9182CE20211",
      sec80G: "AAAGS9182CF20219 (Valid till AY 2027-28)",
      fcraStatus: "Pending Renewal",
      verificationStatus: "VERIFIED",
      verifiedDate: "2026-02-18",
      reviewerNotes: "12A & 80G valid. FCRA pending renewal; domestic donation processing authorized.",
      trustScore: 91,
      impactMetrics: {
        smartLabsBuilt: 42,
        tribalStudentsTrained: "8,500+",
        solarClassrooms: 36,
        verifiedAudits: 4
      },
      contacts: {
        email: "connect@graminshiksha.org",
        phone: "+91 651 228 1190",
        address: "Plot 18, Morabadi Ground Road, Ranchi, Jharkhand 834008"
      },
      bankDetails: {
        accountName: "Gramin Shiksha Mission",
        bankName: "Axis Bank",
        branch: "Main Road, Ranchi",
        ifsc: "UTIB0000183",
        accountNo: "••••••••3918"
      }
    },
    {
      id: "ngo-sahara-relief",
      name: "Sahara Disaster Resilience Network",
      tagline: "Rapid Response and Resilient Rebuilding",
      mission: "Community-led emergency relief, flood response boat units, and water purification plants for disaster-vulnerable riverine districts in Assam and Bihar.",
      category: "Disaster Relief & Rural Welfare",
      city: "Guwahati, Assam",
      founded: 2015,
      darpanId: "AS/2018/0173921",
      pan: "AAATS7721P",
      reg12A: "AAATS7721PE20209",
      sec80G: "AAATS7721PF20213 (Valid till AY 2026-27)",
      fcraStatus: "Approved (FCRA No: 021480039)",
      verificationStatus: "UNDER_REVERIFICATION",
      verifiedDate: "2025-11-20",
      reviewerNotes: "Annual 80G renewal evidence submitted on 15-Oct-2026; under platform officer review.",
      trustScore: 89,
      impactMetrics: {
        floodKitsDistributed: "65,000+",
        purificationUnits: 18,
        villagesSheltered: 94,
        verifiedAudits: 7
      },
      contacts: {
        email: "operations@sahararelief.org",
        phone: "+91 361 245 7710",
        address: "Bora Service, G.S. Road, Guwahati, Assam 781007"
      },
      bankDetails: {
        accountName: "Sahara Disaster Resilience Network",
        bankName: "Punjab National Bank",
        branch: "Guwahati Central",
        ifsc: "PUNB0029300",
        accountNo: "••••••••1129"
      }
    }
  ],

  campaigns: [
    {
      id: "cmp-midday-meals",
      ngoId: "ngo-akshaya",
      ngoName: "Akshaya Seva Foundation",
      title: "Mid-Day Nutrition For 2,500 Rural School Children",
      shortDesc: "Wholesome, micronutrient-enriched hot lunches ensuring children stay in school and beat malnourishment across rural Bengaluru & Kolar.",
      fullDesc: "Classroom hunger is the single biggest cause of school dropout rates among rural adolescent students, especially girls. Akshaya Seva Foundation's centralized hygienic kitchens cook protein-rich lentils, seasonal vegetables, fortified rice, and millet milk. Every rupee is accounted for and audited quarterly by third-party nutritionists. This campaign covers food grains, fresh produce, LPG, cooking staff honorarium, and insulated transport vans for the entire academic session.",
      category: "Education & Nutrition",
      goalAmount: 1800000,
      raisedAmount: 1425000,
      donorCount: 486,
      daysLeft: 14,
      status: "PUBLISHED",
      is80GEligible: true,
      deductionPercent: 50,
      bannerColor: "#107361",
      fundAllocation: [
        { category: "Raw Food Procurement (Millets, Dal, Fortified Rice, Oil)", percent: 65, amount: 1170000 },
        { category: "Kitchen Operations, Fuel & Cook Honorariums", percent: 18, amount: 324000 },
        { category: "Insulated Food Van Distribution & Fuel", percent: 10, amount: 180000 },
        { category: "Third-party Food Safety & Calorie Lab Testing", percent: 7, amount: 126000 }
      ],
      milestones: [
        { id: "m1", title: "Adopt First 5 Primary Schools in Kolar", target: "800 Children fed daily", status: "COMPLETED", date: "Aug 2026" },
        { id: "m2", title: "Scale to 9 Additional Higher Primary Schools", target: "2,500 Total Children", status: "IN_PROGRESS", date: "Oct 2026" },
        { id: "m3", title: "Bi-annual Pediatric BMI & Hemoglobin Camp", target: "Zero iron-deficiency anemia", status: "PLANNED", date: "Dec 2026" }
      ],
      impactUpdates: [
        {
          id: "upd-101",
          date: "2026-10-12",
          title: "Fresh Harvest Ragi & Sprouts Integrated Into Weekly Menu",
          text: "Thanks to generous donor contributions, we introduced sprouted green gram and local ragi porridge two days a week, enhancing protein intake by 32%.",
          author: "Radhika Iyer, Chief Dietitian",
          verified: true
        },
        {
          id: "upd-102",
          date: "2026-09-28",
          title: "New Insulated Electric Delivery Van Deployed",
          text: "Vehicle KA-04-E-8821 was commissioned today. It maintains food at 65°C until lunch bells ring at 12:45 PM across Kolar district government schools.",
          author: "Venkatesh Rao, Logistics Lead",
          verified: true
        }
      ]
    },
    {
      id: "cmp-pediatric-icu",
      ngoId: "ngo-nanhi-jaan",
      ngoName: "Nanhi Jaan Healthcare Society",
      title: "Neonatal Ventilators & Oxygen Concentrators for Govt NICU",
      shortDesc: "Funding 3 specialized neonatal bubble-CPAP machines and high-flow infant oxygen systems for critically ill newborn babies in district hospitals.",
      fullDesc: "District Civil Hospitals often face severe equipment shortages in Neonatal Intensive Care Units (NICUs), forcing impoverished families to seek unaffordable private hospital admissions or risk infant mortality. Nanhi Jaan procures medical equipment directly from certified medical manufacturers and donates them unconditionally to government pediatric wards under strict MOU asset management protocols. All maintenance and consumables are sponsored.",
      category: "Healthcare",
      goalAmount: 2400000,
      raisedAmount: 1890000,
      donorCount: 620,
      daysLeft: 9,
      status: "PUBLISHED",
      is80GEligible: true,
      deductionPercent: 50,
      bannerColor: "#0284C7",
      fundAllocation: [
        { category: "Direct Procurement of 3x Bubble CPAP & Infant Warmers", percent: 74, amount: 1776000 },
        { category: "Sterile Consumables, Infant Breathing Circuits & Tubing", percent: 14, amount: 336000 },
        { category: "Hospital Biomedical Engineer Training & 3-Yr Warranty", percent: 8, amount: 192000 },
        { category: "Platform Disclosures & Compliance Audit", percent: 4, amount: 96000 }
      ],
      milestones: [
        { id: "m1", title: "Procurement PO Issued to Certified Manufacturer", target: "3 CPAP Units & 4 Warmers", status: "COMPLETED", date: "Sep 2026" },
        { id: "m2", title: "Installation & Calibration at Civil Hospital", target: "Zero-error biomedical calibration", status: "IN_PROGRESS", date: "Oct 2026" },
        { id: "m3", title: "First 100 Critical Newborn Admissions", target: "100% Free pediatric care", status: "PLANNED", date: "Nov 2026" }
      ],
      impactUpdates: [
        {
          id: "upd-201",
          date: "2026-10-05",
          title: "Factory Inspection of Neonatal CPAP Units Passed",
          text: "Biomedical engineers inspected the equipment at the ISO-13485 facility. Units are now in transit to the hospital ward.",
          author: "Dr. P. K. Sehgal, Trustee & Pediatrician",
          verified: true
        }
      ]
    },
    {
      id: "cmp-aravali-reforest",
      ngoId: "ngo-vriksha",
      ngoName: "Vriksha Green India Trust",
      title: "Aravali Native Green Shield: 25,000 Indigenous Trees",
      shortDesc: "Combating desertification and revitalizing natural groundwater recharge zones in Rajasthan by planting endemic Dhak, Khejri, and Neem trees.",
      fullDesc: "The Aravali hill range serves as the critical green barrier preventing the Thar Desert from encroaching into fertile plains of north India. Unregulated mining and degradation have led to water tables plummeting below 400 feet. Vriksha Green India partners with local village panchayats to plant 100% native, drought-resistant tree species with high-density soil mulching. Every sapling is geo-tagged and nurtured by local women self-help groups (SHGs) for 3 years.",
      category: "Environment & Climate",
      goalAmount: 1200000,
      raisedAmount: 840000,
      donorCount: 345,
      daysLeft: 22,
      status: "PUBLISHED",
      is80GEligible: true,
      deductionPercent: 50,
      bannerColor: "#059669",
      fundAllocation: [
        { category: "Native Sapling Nursery & Soil Compost Prep", percent: 50, amount: 600000 },
        { category: "Women SHG Tree Stewards & Watering Wages (18 Months)", percent: 30, amount: 360000 },
        { category: "Borewell-Free Rainwater Trenching & Mulching", percent: 12, amount: 144000 },
        { category: "Drone Mapping & Independent Survival Auditing", percent: 8, amount: 96000 }
      ],
      milestones: [
        { id: "m1", title: "Panchayat Land Demarcation & Soil Enrichment", target: "45 Hectares fenced", status: "COMPLETED", date: "Jul 2026" },
        { id: "m2", title: "Planting Phase 1: 12,500 Native Saplings", target: "Khejri, Dhak & Rohida", status: "COMPLETED", date: "Aug 2026" },
        { id: "m3", title: "Planting Phase 2 & Geo-tagging Completion", target: "25,000 Total Saplings", status: "IN_PROGRESS", date: "Nov 2026" }
      ],
      impactUpdates: [
        {
          id: "upd-301",
          date: "2026-10-01",
          title: "Quarterly Drone Audit: 91.4% Sapling Survival Rate",
          text: "Post-monsoon satellite and drone scans revealed robust root-anchoring across all 45 hectares. Rainwater retention trenches prevented any topsoil runoff.",
          author: "Anand Shekhawat, Project Director",
          verified: true
        }
      ]
    },
    {
      id: "cmp-digital-classrooms",
      ngoId: "ngo-shiksha-setu",
      ngoName: "Gramin Shiksha Mission",
      title: "Solar-Powered Digital STEM Classrooms in Tribal Schools",
      shortDesc: "Equipping 12 remote residential ashram schools with solar rooftop micro-grids, interactive offline STEM screens, and robotic kit labs.",
      fullDesc: "Thousands of brilliant students in tribal belts study by kerosene lanterns with intermittent grid power and no internet. Gramin Shiksha Mission installs durable 2kW solar rooftop packs and robust offline digital content servers loaded with multilingual NCERT STEM curriculum, animations, and coding exercises.",
      category: "Education & Nutrition",
      goalAmount: 1500000,
      raisedAmount: 975000,
      donorCount: 290,
      daysLeft: 30,
      status: "PUBLISHED",
      is80GEligible: true,
      deductionPercent: 50,
      bannerColor: "#D97706",
      fundAllocation: [
        { category: "2kW Solar Hybrid Inverter & Lithium Battery Packs", percent: 45, amount: 675000 },
        { category: "Ruggedized 65-inch Interactive Smart Displays", percent: 35, amount: 525000 },
        { category: "STEM Hands-on Experiment Kits & Teacher Training", percent: 14, amount: 210000 },
        { category: "Logistics to Remote Forest Hamlets & Maintenance", percent: 6, amount: 90000 }
      ],
      milestones: [
        { id: "m1", title: "Solar Kits Dispatched to First 6 Schools", target: "6 Remote Ashram Vidyalayas", status: "COMPLETED", date: "Sep 2026" },
        { id: "m2", title: "Teacher Training in Vernacular Digital Modules", target: "24 Rural Teachers", status: "IN_PROGRESS", date: "Oct 2026" },
        { id: "m3", title: "Inter-School STEM Olympiad for Tribal Youths", target: "800 Competitors", status: "PLANNED", date: "Jan 2027" }
      ],
      impactUpdates: [
        {
          id: "upd-401",
          date: "2026-09-22",
          title: "Lights on at Sundargarh Ashram School",
          text: "The first hybrid solar array went live in Sundargarh yesterday. Students experienced interactive science animations on the smart display for the first time.",
          author: "Sujata Mahapatra, Education Officer",
          verified: true
        }
      ]
    }
  ],

  donations: [
    {
      billId: "SS-BILL-2026-892147",
      receiptId: "SS-REC-2026-00481",
      campaignId: "cmp-midday-meals",
      campaignTitle: "Mid-Day Nutrition For 2,500 Rural School Children",
      ngoId: "ngo-akshaya",
      ngoName: "Akshaya Seva Foundation",
      ngoPan: "AAETA1294K",
      ngo80GOrder: "AAETA1294KF20218",
      donorName: "Mayank Sharma",
      donorEmail: "mayank@example.com",
      donorPhone: "+91 98765 43210",
      donorPan: "ABCDE1234F",
      donorAddress: "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
      amount: 5000,
      currency: "INR",
      paymentMethod: "UPI",
      providerRef: "UPI-ICICI-9283719401",
      idempotencyKey: "idem_892147_98412",
      status: "SUCCESS",
      timestamp: "2026-10-15T11:42:18+05:30",
      is80GEligible: true,
      taxDeductionClaimed: 2500,
      form10BdReady: true,
      qrVerificationUrl: "https://sevasetu.org/verify/receipt?id=SS-REC-2026-00481&bill=SS-BILL-2026-892147"
    },
    {
      billId: "SS-BILL-2026-841902",
      receiptId: "SS-REC-2026-00412",
      campaignId: "cmp-pediatric-icu",
      campaignTitle: "Neonatal Ventilators & Oxygen Concentrators for Govt NICU",
      ngoId: "ngo-nanhi-jaan",
      ngoName: "Nanhi Jaan Healthcare Society",
      ngoPan: "AABAN3841M",
      ngo80GOrder: "AABAN3841MF20216",
      donorName: "Pooja Verma",
      donorEmail: "pooja.v@example.com",
      donorPhone: "+91 98112 55443",
      donorPan: "BMVPV8819K",
      donorAddress: "C-12, Hauz Khas, New Delhi 110016",
      amount: 10000,
      currency: "INR",
      paymentMethod: "NETBANKING",
      providerRef: "NET-HDFC-88371920",
      idempotencyKey: "idem_841902_33102",
      status: "SUCCESS",
      timestamp: "2026-10-12T16:15:00+05:30",
      is80GEligible: true,
      taxDeductionClaimed: 5000,
      form10BdReady: true,
      qrVerificationUrl: "https://sevasetu.org/verify/receipt?id=SS-REC-2026-00412&bill=SS-BILL-2026-841902"
    },
    {
      billId: "SS-BILL-2026-774910",
      receiptId: "SS-REC-2026-00388",
      campaignId: "cmp-aravali-reforest",
      campaignTitle: "Aravali Native Green Shield: 25,000 Indigenous Trees",
      ngoId: "ngo-vriksha",
      ngoName: "Vriksha Green India Trust",
      ngoPan: "AACTV5510Q",
      ngo80GOrder: "AACTV5510QF20225",
      donorName: "Rohan Kulkarni",
      donorEmail: "rohan.k@example.com",
      donorPhone: "+91 97654 32190",
      donorPan: "AZYPK9921B",
      donorAddress: "401, Baner Road, Pune, Maharashtra 411045",
      amount: 2500,
      currency: "INR",
      paymentMethod: "CARD",
      providerRef: "CARD-VISA-tok_991823",
      idempotencyKey: "idem_774910_88192",
      status: "SUCCESS",
      timestamp: "2026-10-09T09:30:22+05:30",
      is80GEligible: true,
      taxDeductionClaimed: 1250,
      form10BdReady: true,
      qrVerificationUrl: "https://sevasetu.org/verify/receipt?id=SS-REC-2026-00388&bill=SS-BILL-2026-774910"
    }
  ],

  volunteerOpportunities: [
    {
      id: "vol-kolar-kitchen",
      ngoId: "ngo-akshaya",
      ngoName: "Akshaya Seva Foundation",
      title: "Weekend Meal Packaging & Hygiene Quality Inspection",
      category: "Field Nutrition",
      location: "Central Kitchen, Indiranagar Hub, Bengaluru",
      dateStr: "Upcoming Saturday, 8:00 AM - 12:00 PM",
      hoursReward: 4,
      spotsTotal: 15,
      spotsFilled: 11,
      skillsRequired: "Physical stamina, adherence to hygiene hairnet/gloves protocol",
      leadName: "Ananya Hegde (Field Operations Coordinator)",
      leadContact: "+91 80 4129 8831",
      activeSession: {
        sessionId: "SESS-BLR-01",
        sessionToken: "SETU-7492",
        generatedAt: Date.now() - 120000,
        expiresInSeconds: 480,
        isActive: true,
        sessionName: "Batch A - Morning Packaging & Thermal Dispatch"
      },
      requirements: [
        "Age 18+ or accompanied by guardian",
        "Wear clean closed-toe shoes and comfortable cotton clothing",
        "Mandatory hygiene check at entry: sanitization and hairnet provided",
        "Certificate issued post field coordinator checkout confirmation"
      ]
    },
    {
      id: "vol-aravali-saplings",
      ngoId: "ngo-vriksha",
      ngoName: "Vriksha Green India Trust",
      title: "Aravali Native Plantation & Geo-Tagging Drive",
      category: "Environmental Stewardship",
      location: "Aravali Hills Buffer Zone, Tonk Road, Jaipur",
      dateStr: "Upcoming Sunday, 7:00 AM - 11:30 AM",
      hoursReward: 4.5,
      spotsTotal: 30,
      spotsFilled: 22,
      skillsRequired: "Outdoor readiness, smartphone for geo-tagging QR scanning",
      leadName: "Vikram Rathore (Environmental Forester)",
      leadContact: "+91 141 239 8813",
      activeSession: {
        sessionId: "SESS-JPR-03",
        sessionToken: "ARAV-3814",
        generatedAt: Date.now() - 300000,
        expiresInSeconds: 300,
        isActive: true,
        sessionName: "Sector 4 Mulching & Trench Irrigation Drive"
      },
      requirements: [
        "Carry reusable water bottle and sun hat",
        "Gloves and gardening tools provided on site",
        "Volunteers will plant 5 native saplings each and map coordinates"
      ]
    },
    {
      id: "vol-stem-mentorship",
      ngoId: "ngo-shiksha-setu",
      ngoName: "Gramin Shiksha Mission",
      title: "Digital STEM Mentor: Virtual Saturday Coding & Science Club",
      category: "Digital Mentorship",
      location: "Remote / Online Video Hub",
      dateStr: "Every Saturday, 2:00 PM - 4:00 PM",
      hoursReward: 2,
      spotsTotal: 10,
      spotsFilled: 6,
      skillsRequired: "Basic Python / Scratch or School Science, Hindi / Odia familiarity",
      leadName: "Debashish Patnaik (Curriculum Lead)",
      leadContact: "+91 651 228 1192",
      activeSession: null,
      requirements: [
        "Stable laptop with webcam and broadband connection",
        "Conduct 45-minute interactive science experiment session with school batch"
      ]
    }
  ],

  volunteerRecords: [
    {
      recordId: "VOL-REC-2026-9041",
      volunteerName: "Mayank Sharma",
      volunteerEmail: "mayank@example.com",
      opportunityId: "vol-kolar-kitchen",
      opportunityTitle: "Weekend Meal Packaging & Hygiene Quality Inspection",
      ngoName: "Akshaya Seva Foundation",
      sessionDate: "2026-10-11",
      checkInTime: "08:02 AM",
      checkOutTime: "12:05 PM",
      hoursLogged: 4,
      status: "APPROVED",
      approvedBy: "Ananya Hegde (Field Lead)",
      approvalNotes: "Arrived promptly, supervised meal packaging line 2 with zero defects.",
      certificateId: "SEVA-CERT-2026-11082",
      qrVerificationUrl: "https://sevasetu.org/verify/cert?id=SEVA-CERT-2026-11082"
    },
    {
      recordId: "VOL-REC-2026-8812",
      volunteerName: "Mayank Sharma",
      volunteerEmail: "mayank@example.com",
      opportunityId: "vol-aravali-saplings",
      opportunityTitle: "Aravali Native Plantation & Geo-Tagging Drive",
      ngoName: "Vriksha Green India Trust",
      sessionDate: "2026-09-27",
      checkInTime: "07:15 AM",
      checkOutTime: "11:45 AM",
      hoursLogged: 4.5,
      status: "APPROVED",
      approvedBy: "Vikram Rathore (Lead)",
      approvalNotes: "Successfully planted and geo-tagged 8 Dhak saplings.",
      certificateId: "SEVA-CERT-2026-10491",
      qrVerificationUrl: "https://sevasetu.org/verify/cert?id=SEVA-CERT-2026-10491"
    }
  ],

  auditLogs: [
    {
      id: "LOG-10928",
      timestamp: "2026-10-15T11:42:20+05:30",
      actor: "SYSTEM",
      role: "Payment Webhook Gateway",
      action: "DONATION_COMPLETED",
      details: "Bill ID SS-BILL-2026-892147 created. 80G receipt SS-REC-2026-00481 issued with signed QR token.",
      ip: "10.0.4.12"
    },
    {
      id: "LOG-10927",
      timestamp: "2026-10-15T10:15:00+05:30",
      actor: "ComplianceOfficer_Rajesh",
      role: "Platform Admin / Reviewer",
      action: "NGO_VERIFICATION_RENEWED",
      details: "Renewed 80G validation for Akshaya Seva Foundation through AY 2028-29.",
      ip: "192.168.1.104"
    },
    {
      id: "LOG-10926",
      timestamp: "2026-10-14T17:30:11+05:30",
      actor: "Ananya Hegde",
      role: "Field Lead",
      action: "VOLUNTEER_HOURS_APPROVED",
      details: "Approved 4.0 hours for Mayank Sharma (Record VOL-REC-2026-9041). Issued Certificate SEVA-CERT-2026-11082.",
      ip: "49.37.112.98"
    },
    {
      id: "LOG-10925",
      timestamp: "2026-10-14T08:00:00+05:30",
      actor: "Ananya Hegde",
      role: "Field Lead",
      action: "ATTENDANCE_SESSION_CREATED",
      details: "Session SESS-BLR-01 opened with temporary token SETU-7492 (10 min expiry).",
      ip: "49.37.112.98"
    },
    {
      id: "LOG-10924",
      timestamp: "2026-10-13T14:22:08+05:30",
      actor: "Dr. P. K. Sehgal",
      role: "NGO Admin",
      action: "CAMPAIGN_UPDATE_PUBLISHED",
      details: "Published update 'Factory Inspection Passed' for Campaign cmp-pediatric-icu with verified media rights.",
      ip: "117.218.44.12"
    }
  ]
};
