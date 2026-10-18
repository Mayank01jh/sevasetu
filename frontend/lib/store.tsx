"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "Platform Admin" | "NGO Admin" | "Field Lead" | "Volunteer" | "Donor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  org?: string;
  avatar?: string;
}

export interface Campaign {
  id: string;
  title: string;
  ngo_id: string;
  ngo_name: string;
  category: string;
  description: string;
  target_amount: number;
  raised_amount: number;
  donor_count: number;
  status: string;
  tax_exemption_80g: boolean;
  milestones: Array<{
    title: string;
    target: number;
    completed: boolean;
  }>;
}

export interface Donation {
  id: string;
  bill_id: string;
  campaign_id: string;
  campaign_title: string;
  donor_name: string;
  donor_pan: string;
  amount: number;
  timestamp: string;
  tax_exemption_80g: boolean;
  status: string;
}

export interface VolunteerSession {
  id: string;
  campaign_id: string;
  title: string;
  field_lead: string;
  session_code: string;
  expires_at: string;
  volunteers_checked_in: Array<{
    name: string;
    checked_in_at: string;
    hours: number;
    status: string;
  }>;
}

interface AppContextType {
  currentUser: User | null;
  login: (role: UserRole, email?: string, name?: string) => void;
  logout: () => void;
  campaigns: Campaign[];
  donations: Donation[];
  volunteerSessions: VolunteerSession[];
  activeDonationCampaign: Campaign | null;
  setActiveDonationCampaign: (campaign: Campaign | null) => void;
  activeReceipt: Donation | null;
  setActiveReceipt: (receipt: Donation | null) => void;
  activeCertificate: any | null;
  setActiveCertificate: (cert: any | null) => void;
  addDonation: (data: { campaignId: string; amount: number; donorName: string; donorPan: string }) => Donation;
  generateSessionCode: (campaignId: string, title: string) => VolunteerSession;
  checkInVolunteer: (code: string, volunteerName: string) => boolean;
  approveVolunteerHours: (sessionId: string, volunteerName: string, hours: number) => any;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const DEMO_USERS: Record<UserRole, User> = {
  "Platform Admin": { id: "u-admin", name: "Priya Sharma (Platform Admin)", email: "admin@sevasetu.org", role: "Platform Admin", org: "SevaSetu Headquarters" },
  "NGO Admin": { id: "u-ngo", name: "Rajesh Kumar (NGO Director)", email: "ngo@akshayaseva.org", role: "NGO Admin", org: "Akshaya Seva Trust" },
  "Field Lead": { id: "u-lead", name: "Ananya Deshmukh (Field Lead)", email: "lead@sevasetu.org", role: "Field Lead", org: "SevaSetu Relief Force" },
  "Volunteer": { id: "u-vol", name: "Arjun Verma (Volunteer)", email: "volunteer@sevasetu.org", role: "Volunteer" },
  "Donor": { id: "u-donor", name: "Sunita Patel (Philanthropist)", email: "donor@sevasetu.org", role: "Donor" },
};

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-001",
    title: "Project Poshan: Midday Nutrition Kits for 1,200 Rural Students",
    ngo_id: "ngo-101",
    ngo_name: "Akshaya Seva Trust",
    category: "Nutrition & Education",
    description: "Delivering fortified grain rations, pulses, and micronutrient packs to underprivileged school children in drought-affected districts of Maharashtra.",
    target_amount: 500000,
    raised_amount: 385000,
    donor_count: 142,
    status: "Active",
    tax_exemption_80g: true,
    milestones: [
      { title: "Procure Grains & Pulses", target: 200000, completed: true },
      { title: "Packaging & Quality Inspection", target: 350000, completed: true },
      { title: "Last-mile School Delivery", target: 500000, completed: false }
    ]
  },
  {
    id: "camp-002",
    title: "Mobile Medical Vans for High-Altitude Himalayan Villages",
    ngo_id: "ngo-102",
    ngo_name: "Arogya Seva Foundation",
    category: "Healthcare",
    description: "Equipping two off-road utility vans with diagnostic kits, telehealth connectivity, and essential drugs for 24 remote Himalayan settlements.",
    target_amount: 850000,
    raised_amount: 620000,
    donor_count: 210,
    status: "Active",
    tax_exemption_80g: true,
    milestones: [
      { title: "Vehicle Chassis Modification", target: 400000, completed: true },
      { title: "Diagnostic Equipment Fitting", target: 650000, completed: false },
      { title: "Paramedic Deployment", target: 850000, completed: false }
    ]
  },
  {
    id: "camp-003",
    title: "Clean Water Arsenic Filtration Units for 5 Coastal Schools",
    ngo_id: "ngo-103",
    ngo_name: "Jal Jeevan Sahayog",
    category: "Clean Water",
    description: "Installing automated 1,000 LPH reverse-osmosis filtration units in flood-prone coastal regions prone to groundwater salinity and heavy metals.",
    target_amount: 320000,
    raised_amount: 295000,
    donor_count: 88,
    status: "Active",
    tax_exemption_80g: true,
    milestones: [
      { title: "Site Hydrogeology Survey", target: 50000, completed: true },
      { title: "Filter Procurement & Assembly", target: 200000, completed: true },
      { title: "Civil Works & Inauguration", target: 320000, completed: false }
    ]
  }
];

const INITIAL_DONATIONS: Donation[] = [
  {
    id: "don-001",
    bill_id: "SS-2026-8942",
    campaign_id: "camp-001",
    campaign_title: "Project Poshan: Midday Nutrition Kits",
    donor_name: "Sunita Patel",
    donor_pan: "ABCDE1234F",
    amount: 25000,
    timestamp: "2026-10-17 14:32:10 IST",
    tax_exemption_80g: true,
    status: "Verified & Form 10BD Queued"
  },
  {
    id: "don-002",
    bill_id: "SS-2026-7731",
    campaign_id: "camp-002",
    campaign_title: "Mobile Medical Vans",
    donor_name: "Vikram Singhania",
    donor_pan: "XYZPA9988K",
    amount: 50000,
    timestamp: "2026-10-16 11:20:05 IST",
    tax_exemption_80g: true,
    status: "Verified & Form 10BD Queued"
  }
];

const INITIAL_SESSIONS: VolunteerSession[] = [
  {
    id: "sess-01",
    campaign_id: "camp-001",
    title: "Ration Pack Sorting & Quality Tally (Warehouse B)",
    field_lead: "Ananya Deshmukh",
    session_code: "SEVA-9842",
    expires_at: "In 10 Minutes (Live)",
    volunteers_checked_in: [
      { name: "Arjun Verma", checked_in_at: "09:15 AM", hours: 4.5, status: "Signed Off" },
      { name: "Kavita Rao", checked_in_at: "09:20 AM", hours: 4.5, status: "Signed Off" },
      { name: "Suresh Menon", checked_in_at: "10:00 AM", hours: 3.5, status: "Pending Lead Sign-off" }
    ]
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [donations, setDonations] = useState<Donation[]>(INITIAL_DONATIONS);
  const [volunteerSessions, setVolunteerSessions] = useState<VolunteerSession[]>(INITIAL_SESSIONS);
  const [activeDonationCampaign, setActiveDonationCampaign] = useState<Campaign | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<Donation | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<any | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Restore stored session
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("sevasetu_user");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const login = (role: UserRole, email?: string, name?: string) => {
    const user: User = DEMO_USERS[role] ? { ...DEMO_USERS[role] } : {
      id: "u-" + Date.now(),
      name: name || `${role} User`,
      email: email || `${role.toLowerCase().replace(" ", "")}@sevasetu.org`,
      role: role
    };
    setCurrentUser(user);
    try {
      localStorage.setItem("sevasetu_user", JSON.stringify(user));
    } catch (e) {}
    setShowAuthModal(false);
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("sevasetu_user");
    } catch (e) {}
  };

  const addDonation = ({ campaignId, amount, donorName, donorPan }: { campaignId: string; amount: number; donorName: string; donorPan: string }) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    const billId = `SS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation: Donation = {
      id: "don-" + Date.now(),
      bill_id: billId,
      campaign_id: campaignId,
      campaign_title: campaign?.title || "SevaSetu General Relief Fund",
      donor_name: donorName,
      donor_pan: donorPan.toUpperCase(),
      amount: Number(amount),
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST",
      tax_exemption_80g: true,
      status: "Verified & Form 10BD Queued"
    };

    setDonations(prev => [newDonation, ...prev]);
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          raised_amount: c.raised_amount + Number(amount),
          donor_count: c.donor_count + 1
        };
      }
      return c;
    }));

    setActiveReceipt(newDonation);
    return newDonation;
  };

  const generateSessionCode = (campaignId: string, title: string) => {
    const code = "SEVA-" + Math.floor(1000 + Math.random() * 9000);
    const newSession: VolunteerSession = {
      id: "sess-" + Date.now(),
      campaign_id: campaignId,
      title: title,
      field_lead: currentUser?.name || "Field Lead",
      session_code: code,
      expires_at: "Valid for 10 minutes",
      volunteers_checked_in: []
    };
    setVolunteerSessions(prev => [newSession, ...prev]);
    return newSession;
  };

  const checkInVolunteer = (code: string, volunteerName: string) => {
    const session = volunteerSessions.find(s => s.session_code === code.trim().toUpperCase());
    if (!session) return false;

    setVolunteerSessions(prev => prev.map(s => {
      if (s.id === session.id) {
        const alreadyIn = s.volunteers_checked_in.some(v => v.name.toLowerCase() === volunteerName.toLowerCase());
        if (!alreadyIn) {
          return {
            ...s,
            volunteers_checked_in: [
              ...s.volunteers_checked_in,
              {
                name: volunteerName,
                checked_in_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                hours: 4.0,
                status: "Pending Lead Sign-off"
              }
            ]
          };
        }
      }
      return s;
    }));
    return true;
  };

  const approveVolunteerHours = (sessionId: string, volunteerName: string, hours: number) => {
    setVolunteerSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          volunteers_checked_in: s.volunteers_checked_in.map(v => {
            if (v.name === volunteerName) {
              return { ...v, status: "Signed Off", hours };
            }
            return v;
          })
        };
      }
      return s;
    }));

    const cert = {
      certificate_id: "SS-CERT-2026-" + Math.floor(1000 + Math.random() * 9000),
      volunteer_name: volunteerName,
      hours: hours,
      event: volunteerSessions.find(s => s.id === sessionId)?.title || "Community Outreach",
      issued_by: currentUser?.name || "Field Operations Director",
      date: new Date().toLocaleDateString("en-IN")
    };
    setActiveCertificate(cert);
    return cert;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        campaigns,
        donations,
        volunteerSessions,
        activeDonationCampaign,
        setActiveDonationCampaign,
        activeReceipt,
        setActiveReceipt,
        activeCertificate,
        setActiveCertificate,
        addDonation,
        generateSessionCode,
        checkInVolunteer,
        approveVolunteerHours,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
