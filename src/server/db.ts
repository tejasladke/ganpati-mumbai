import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Challenge, Favorite, Pandal, PlannerItem, Submission, User, VisitPlan, Connection, ChatConversation, ChatMessage, CommunityNotification, SharedVisitPlan, UserReport } from '../types.js';

// Pre-hashed password for the built-in admin account
const DEFAULT_ADMIN_PASS_HASH = bcrypt.hashSync('tejas@ladke', 10);

// Only default admin user retained; dummy users deleted as requested. Active users are added upon registration/login.
const initialUsers: User[] = [
  {
    id: 'user-admin-1',
    name: 'Ganesh Festival Admin',
    email: 'admin@mumbai.org',
    role: 'admin',
    points: 1000,
    completedChallenges: 5,
    badges: ['Festival Admin', 'Bappa Devotee', 'Mumbai Raja Master'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    createdAt: new Date().toISOString(),
  },
];

const passwordsMap: Record<string, string> = {
  'admin@mumbai.org': DEFAULT_ADMIN_PASS_HASH,
};

// Expanded directory: source-backed records plus clearly-labelled community discovery entries.

const expandedDirectoryPandals: Pandal[] = [
  {
    id: 'directory-1000', name: "Fort Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Opp. CST Station, Fort, Mumbai 400001", area: "Fort",
    latitude: 18.9322, longitude: 72.8358, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1001', name: "Grant Road Cha Siddhidata",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Grant Road, Mumbai 400007", area: "Grant Road",
    latitude: 18.9601, longitude: 72.8186, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1002', name: "Khetwadi Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Khetwadi, Grant Road, Mumbai 400004", area: "Grant Road",
    latitude: 18.9601, longitude: 72.8186, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1003', name: "Sarvjanik Utsav Mandal Vakri Adda",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Vakri Adda, Byculla, Mumbai", area: "Byculla",
    latitude: 18.9766, longitude: 72.832, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1004', name: "Dakshin Mumbai Cha Mahaganpati",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Charni Road, Mumbai 400004", area: "Charni Road",
    latitude: 18.9519, longitude: 72.819, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1005', name: "Lohar Chawl Ganpati",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Lohar Chawl, Charni Road, Mumbai 400004", area: "Charni Road",
    latitude: 18.9519, longitude: 72.819, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1006', name: "Lower Parel Station Ganpati",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Lower Parel Station area, Mumbai 400013", area: "Lower Parel",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1007', name: "Chinchpokli Cha Raja - Chintamani",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Chinchpokli, Mumbai 400012", area: "Chinchpokli",
    latitude: 18.9856, longitude: 72.834, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1008', name: "Girangaoncha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Chinchpokli, Mumbai 400012", area: "Chinchpokli",
    latitude: 18.9856, longitude: 72.834, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1009', name: "Rajaram Wadi Sarwajanik Ganesh Utsav",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Dadar East, Mumbai 400014", area: "Dadar East",
    latitude: 19.0178, longitude: 72.8478, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1010', name: "Parel Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Nare Park, Parel, Mumbai 400012", area: "Parel",
    latitude: 18.9986, longitude: 72.8376, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1011', name: "Lal Maidan Sarvajanik Ganeshotsav Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Lal Maidan, Parel, Mumbai 400012", area: "Parel",
    latitude: 18.9986, longitude: 72.8376, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1012', name: "Arunodhay Mitra Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Parel, Mumbai 400012", area: "Parel",
    latitude: 18.9986, longitude: 72.8376, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1013', name: "Safalya Sarvajanik Ganeshotsav Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Parel, Mumbai 400012", area: "Parel",
    latitude: 18.9986, longitude: 72.8376, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1014', name: "Taruna Mitra Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Parel, Mumbai 400012", area: "Parel",
    latitude: 18.9986, longitude: 72.8376, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1015', name: "Vakola Ganpati Pandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Vakola, Santacruz East, Mumbai 400055", area: "Santacruz East",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1016', name: "Swapnakshya Mitra Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Andheri West, Mumbai 400053", area: "Andheri West",
    latitude: 19.1197, longitude: 72.8468, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1017', name: "Andheri Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Ganesh Maidan, Azad Nagar II, Veera Desai Road, Andheri West, Mumbai 400053", area: "Andheri West",
    latitude: 19.1197, longitude: 72.8468, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1018', name: "Saiwadi Teligali Ganesh Utsav",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Saiwadi/Teligali, Andheri East, Mumbai 400069", area: "Andheri East",
    latitude: 19.1136, longitude: 72.8697, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1019', name: "Akhil Mahakali Ganesh Utsav",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Mahakali, Andheri East, Mumbai 400093", area: "Andheri East",
    latitude: 19.1136, longitude: 72.8697, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1020', name: "Andheri MIDC Ganpati",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "MIDC, Andheri East, Mumbai 400093", area: "Andheri MIDC",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1021', name: "Sai Ganesh Welfare Association",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Borivali West, Mumbai 400092", area: "Borivali West",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1022', name: "Shiv Mitra Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Borivali East, Mumbai 400066", area: "Borivali East",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1023', name: "Ekta Sarvajanik Ganesh Utsav Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Borivali East, Mumbai 400066", area: "Borivali East",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1024', name: "Kandivali East Station Ganpati",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Kandivali East Station area, Mumbai 400101", area: "Kandivali East",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1025', name: "Ganesh Sai Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Kandivali West, Mumbai 400067", area: "Kandivali West",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1026', name: "Malad Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad East, Mumbai 400097", area: "Malad East",
    latitude: 19.186, longitude: 72.856, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1027', name: "Vikhroli Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Vikhroli, Mumbai 400083", area: "Vikhroli",
    latitude: 19.111, longitude: 72.927, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1028', name: "S.T. Depot Ganpati",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Kurla, Mumbai 400070", area: "Kurla",
    latitude: 19.0726, longitude: 72.8795, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1029', name: "Mankhurd Ganpati",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Mankhurd, Mumbai 400088", area: "Mankhurd",
    latitude: 19.0487, longitude: 72.9315, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1030', name: "Sanpada Pandal Sector 08",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Sector 8, Sanpada, Navi Mumbai 400705", area: "Sanpada",
    latitude: 19.0612, longitude: 73.0094, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1031', name: "Shivchaya Mitra Mandal Sarvajanik Ganeshotsav",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Navi Mumbai", area: "Navi Mumbai",
    latitude: 19.033, longitude: 73.0297, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1032', name: "Mulund Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Mulund, Mumbai 400080", area: "Mulund",
    latitude: 19.172, longitude: 72.956, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1033', name: "Mira Road Cha Morya",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Shanti Nagar, Mira Road", area: "Mira Road",
    latitude: 19.2952, longitude: 72.8544, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1034', name: "Mira Road Cha Ganadhish",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Shanti Nagar, Mira Road", area: "Mira Road",
    latitude: 19.2952, longitude: 72.8544, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1035', name: "Om Mitra Mandal Mira Road",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Shanti Nagar, Mira Road", area: "Mira Road",
    latitude: 19.2952, longitude: 72.8544, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1036', name: "Mira Road Cha Maharaja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Shanti Nagar, Mira Road", area: "Mira Road",
    latitude: 19.2952, longitude: 72.8544, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1037', name: "Yuva Mitra Mandal Mira Road",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Shanti Nagar, Mira Road", area: "Mira Road",
    latitude: 19.2952, longitude: 72.8544, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1038', name: "Shanti Vihar Cha Samraat",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Shanti Vihar, Mira Road", area: "Mira Road",
    latitude: 19.2952, longitude: 72.8544, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1039', name: "Mira Road Cha Rajadhiraj",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Sheetal Nagar, Mira Road", area: "Mira Road",
    latitude: 19.2952, longitude: 72.8544, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1040', name: "Arambh Yuva Samajik Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Shanti Garden, Mira Road", area: "Mira Road",
    latitude: 19.2952, longitude: 72.8544, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1041', name: "Jai Bajrang Bal Mitra Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Kisan Nagar, Wagle Estate, Thane", area: "Thane",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1042', name: "Thane Ka Maharaja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Kisan Nagar, Thane", area: "Thane",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1043', name: "Shri Nagar Bal Mitra Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Shri Nagar, Thane", area: "Thane",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1044', name: "Ganesh Mitra Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Dombivli, Thane", area: "Dombivli",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1045', name: "Dombivli Cha Maharaja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Dombivli, Thane", area: "Dombivli",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1046', name: "Jadhwadicha Maharaja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Dombivli, Thane", area: "Dombivli",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1047', name: "Sarvajanik Ganeshotsav Subhedar Wada",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Bazarpeth, Kalyan West", area: "Kalyan West",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1048', name: "Akhil Bhat Wadi Sarvajanik Ganesh Utsav",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Ghatkopar, Mumbai 400077", area: "Ghatkopar",
    latitude: 19.086, longitude: 72.9081, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1049', name: "Malwanicha Maharaja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1050', name: "Malvani Mhada Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1051', name: "Malwanicha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1052', name: "Rathodicha Maheshwara",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1053', name: "Mumbaicha Shree",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1054', name: "Malwanicha Ganraya",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1055', name: "Natraj Market Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1056', name: "Malwani Tamil King",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1057', name: "Shamnirmal Cha Shreemant",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1058', name: "Orlem Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1059', name: "Malwani Cha Morya",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1060', name: "Malwani Cha Laadka",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1061', name: "Rathodi Cha Raja Official",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1062', name: "Malwani Cha Shreemant",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1063', name: "The King of SV Road",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1064', name: "Maladcha Vighnaharta",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1065', name: "Malwani Cha Ekdant",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1066', name: "Malad Cha Vigneshwar",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1067', name: "Malwanicha Anand",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1068', name: "Morya Malwani Cha",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1069', name: "Bhaktan Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1070', name: "MHADA Cha Moreshwar",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1071', name: "Prerna Malad",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1072', name: "Juliuswadi Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1073', name: "Bhadranagar Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1074', name: "Orlemeshwar",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1075', name: "Upnagar Cha Vighnaharta",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad East, Mumbai, Maharashtra", area: "Malad East",
    latitude: 19.186, longitude: 72.856, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1076', name: "Malad Cha Maharaja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1077', name: "Kharodi Cha Shreeganraj",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1078', name: "Malwani Cha Ekta Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1079', name: "Rathodi Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1080', name: "Ambojwadi Cha Shree",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1081', name: "Kharodi Cha Chintamani",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1082', name: "Malwanicha Samrat",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1083', name: "Malad Cha Baadshah",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1084', name: "Kharodi Cha Vighnaharta",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1085', name: "Kachpada Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1086', name: "Kharodi Cha Ganraj",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1087', name: "Rathodi Cha Vighnaharta",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1088', name: "New Horizon Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1089', name: "Malad Cha Chhatrapathi",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1090', name: "Malad Cha Ganraj",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1091', name: "Malwanicha Ujwal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1092', name: "Rajanpadyacha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1093', name: "Malwani Cha Adhipati",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1094', name: "Kharodi Cha Peshwa",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1095', name: "Malad Cha Veer Vinayak",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1096', name: "Malwanicha Shiromani",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1097', name: "Malwani Cha Swami",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1098', name: "Shanti Prayas Mitra Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1099', name: "Malad Cha Chakravarthi",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1100', name: "Mithila Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1101', name: "Pragati Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1102', name: "Malwanicha Sangharsh",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1103', name: "Malwanicha Ichhapurti",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1104', name: "Rathodi Cha Maharaja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1105', name: "Rathodi Cha Sukhkarta",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1106', name: "6 No Market Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1107', name: "Kharodi Cha Yuvraj",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1108', name: "Malwani Cha Chintamani",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1109', name: "Maladcha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1110', name: "Malad Cha Balganesh",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1111', name: "Malwanicha Om Shree",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1112', name: "Malwani Jangal Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1113', name: "Om Mitra Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1114', name: "Youth Mitra Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1115', name: "Malwani Cha Peshwa",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1116', name: "Bhaktancha Raja Ekta Mitra Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1117', name: "Shree Sai Darshan Mitra Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad West, Mumbai, Maharashtra", area: "Malad West",
    latitude: 19.186, longitude: 72.848, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1118', name: "Collector Compound Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad East, Mumbai, Maharashtra", area: "Malad East",
    latitude: 19.186, longitude: 72.856, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1119', name: "Sapurpada Cha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad East, Mumbai, Maharashtra", area: "Malad East",
    latitude: 19.186, longitude: 72.856, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1120', name: "Modern Cha Moreshwar",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad East, Mumbai, Maharashtra", area: "Malad East",
    latitude: 19.186, longitude: 72.856, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1121', name: "Malvani Mhada Cha Raja East",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad East, Mumbai, Maharashtra", area: "Malad East",
    latitude: 19.186, longitude: 72.856, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1122', name: "Mhada Cha Vighnaharta",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Malad East, Mumbai, Maharashtra", area: "Malad East",
    latitude: 19.186, longitude: 72.856, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1123', name: "Lalbaugcha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Dr B A Road, Lalbaug, Parel, Mumbai 400012", area: "Lalbaug",
    latitude: 18.9912, longitude: 72.8385, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1124', name: "Chinchpoklicha Chintamani",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Dattaram Lad Marg, Chinchpokli, Mumbai 400012", area: "Chinchpokli",
    latitude: 18.9856, longitude: 72.834, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1125', name: "Tejukayacha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Tejukaya Building, Dr Babasaheb Ambedkar Road, Ganesh Gully, Mumbai 400012", area: "Lalbaug",
    latitude: 18.9912, longitude: 72.8385, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1126', name: "GSB Seva Mandal",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Rafi Ahmed Kidwai Road, Matunga East, Mumbai 400019", area: "Matunga East",
    latitude: 19.0258, longitude: 72.8553, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1127', name: "Mumbaicha Raja (Ganesh Galli)",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Ganesh Nagar Lane, Lalbaug, Mumbai 400012", area: "Lalbaug",
    latitude: 18.9912, longitude: 72.8385, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1128', name: "Fortcha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Dwarkadas Lane, Ballard Estate, Fort, Mumbai 400001", area: "Fort",
    latitude: 18.9322, longitude: 72.8358, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1129', name: "Girgaoncha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Nikadwari Lane, Girgaon, Mumbai 400004", area: "Girgaon",
    latitude: 18.955, longitude: 72.8175, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1130', name: "Parelcha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Nare Park, Parel, Mumbai 400012", area: "Parel",
    latitude: 18.9986, longitude: 72.8376, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1131', name: "Andhericha Raja",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Azad Nagar II, Veera Desai Road, Mumbai 400053", area: "Andheri West",
    latitude: 19.1197, longitude: 72.8468, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1132', name: "Kalachowkicha Mahaganpati",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Dattaram Lad Marg, Kalachowki, Mumbai 400033", area: "Kalachowki",
    latitude: 19.076, longitude: 72.8777, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1133', name: "Khetwadicha Vighnaharta",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Khetwadi 3rd Lane, Mumbai 400004", area: "Girgaon",
    latitude: 18.955, longitude: 72.8175, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1134', name: "Khetwadicha Lambodara",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Khetwadi 4th Lane, Mumbai 400004", area: "Girgaon",
    latitude: 18.955, longitude: 72.8175, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1135', name: "Mumbaicha Ganpati",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Khetwadi 5th Lane, Mumbai 400004", area: "Girgaon",
    latitude: 18.955, longitude: 72.8175, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1136', name: "Mumbaicha Samrat",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Khetwadi 6th Lane, Mumbai 400004", area: "Girgaon",
    latitude: 18.955, longitude: 72.8175, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1137', name: "Khetwadicha Morya",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Khetwadi 7th Lane, Mumbai 400004", area: "Girgaon",
    latitude: 18.955, longitude: 72.8175, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1138', name: "Khetwadicha Mahaganpati",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Khetwadi 8th Lane, Mumbai 400004", area: "Girgaon",
    latitude: 18.955, longitude: 72.8175, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1139', name: "Khetwadicha Chintamani",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Khetwadi 9th Lane, Mumbai 400004", area: "Girgaon",
    latitude: 18.955, longitude: 72.8175, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1140', name: "Khetwadicha Yuvraj",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Khetwadi 10th Lane, Mumbai 400004", area: "Girgaon",
    latitude: 18.955, longitude: 72.8175, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'directory-1141', name: "Mumbaicha Maharaja / Anant",
    description: 'Source-listed Mumbai Ganpati mandal. Address taken from a public directory/source; verify festival-year details before visiting.',
    history: 'Publicly listed Ganpati mandal in Mumbai.', images: [], address: "Khetwadi 11th\u201313th Lanes, Mumbai 400004", area: "Girgaon",
    latitude: 18.955, longitude: 72.8175, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 65, famousFeatures: ['Mumbai Ganeshotsav'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-1', name: 'Community Ganpati Mandal 1 - Lalbaug',
    description: 'Community directory entry for Lalbaug. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Lalbaug, Mumbai, Maharashtra', area: "Lalbaug",
    latitude: 18.992700, longitude: 72.838500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-2', name: 'Community Ganpati Mandal 2 - Parel',
    description: 'Community directory entry for Parel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Parel, Mumbai, Maharashtra', area: "Parel",
    latitude: 18.999899, longitude: 72.838350, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-3', name: 'Community Ganpati Mandal 3 - Chinchpokli',
    description: 'Community directory entry for Chinchpokli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chinchpokli, Mumbai, Maharashtra', area: "Chinchpokli",
    latitude: 18.986350, longitude: 72.835299, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-4', name: 'Community Ganpati Mandal 4 - Byculla',
    description: 'Community directory entry for Byculla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Byculla, Mumbai, Maharashtra', area: "Byculla",
    latitude: 18.976600, longitude: 72.833500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-5', name: 'Community Ganpati Mandal 5 - Fort',
    description: 'Community directory entry for Fort. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Fort, Mumbai, Maharashtra', area: "Fort",
    latitude: 18.931450, longitude: 72.837099, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-6', name: 'Community Ganpati Mandal 6 - Girgaon',
    description: 'Community directory entry for Girgaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Girgaon, Mumbai, Maharashtra', area: "Girgaon",
    latitude: 18.953701, longitude: 72.818250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-7', name: 'Community Ganpati Mandal 7 - Grant Road',
    description: 'Community directory entry for Grant Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Grant Road, Mumbai, Maharashtra', area: "Grant Road",
    latitude: 18.958600, longitude: 72.818600, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-8', name: 'Community Ganpati Mandal 8 - Charni Road',
    description: 'Community directory entry for Charni Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Charni Road, Mumbai, Maharashtra', area: "Charni Road",
    latitude: 18.950601, longitude: 72.818250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-9', name: 'Community Ganpati Mandal 9 - Dadar East',
    description: 'Community directory entry for Dadar East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar East, Mumbai, Maharashtra', area: "Dadar East",
    latitude: 19.017050, longitude: 72.846501, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-10', name: 'Community Ganpati Mandal 10 - Dadar West',
    description: 'Community directory entry for Dadar West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar West, Mumbai, Maharashtra', area: "Dadar West",
    latitude: 19.020000, longitude: 72.833500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-11', name: 'Community Ganpati Mandal 11 - Matunga East',
    description: 'Community directory entry for Matunga East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga East, Mumbai, Maharashtra', area: "Matunga East",
    latitude: 19.026550, longitude: 72.854001, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-12', name: 'Community Ganpati Mandal 12 - Matunga West',
    description: 'Community directory entry for Matunga West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga West, Mumbai, Maharashtra', area: "Matunga West",
    latitude: 19.029299, longitude: 72.843250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-13', name: 'Community Ganpati Mandal 13 - Mahim',
    description: 'Community directory entry for Mahim. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mahim, Mumbai, Maharashtra', area: "Mahim",
    latitude: 19.044500, longitude: 72.840000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-14', name: 'Community Ganpati Mandal 14 - Wadala',
    description: 'Community directory entry for Wadala. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Wadala, Mumbai, Maharashtra', area: "Wadala",
    latitude: 19.016699, longitude: 72.870450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-15', name: 'Community Ganpati Mandal 15 - Sion',
    description: 'Community directory entry for Sion. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sion, Mumbai, Maharashtra', area: "Sion",
    latitude: 19.046750, longitude: 72.862299, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-16', name: 'Community Ganpati Mandal 16 - Kurla',
    description: 'Community directory entry for Kurla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kurla, Mumbai, Maharashtra', area: "Kurla",
    latitude: 19.072600, longitude: 72.881000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-17', name: 'Community Ganpati Mandal 17 - Chembur',
    description: 'Community directory entry for Chembur. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chembur, Mumbai, Maharashtra', area: "Chembur",
    latitude: 19.061250, longitude: 72.898299, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-18', name: 'Community Ganpati Mandal 18 - Ghatkopar',
    description: 'Community directory entry for Ghatkopar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Ghatkopar, Mumbai, Maharashtra', area: "Ghatkopar",
    latitude: 19.084701, longitude: 72.908850, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-19', name: 'Community Ganpati Mandal 19 - Vikhroli',
    description: 'Community directory entry for Vikhroli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vikhroli, Mumbai, Maharashtra', area: "Vikhroli",
    latitude: 19.109500, longitude: 72.927000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-20', name: 'Community Ganpati Mandal 20 - Bhandup',
    description: 'Community directory entry for Bhandup. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bhandup, Mumbai, Maharashtra', area: "Bhandup",
    latitude: 19.143701, longitude: 72.937250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-21', name: 'Community Ganpati Mandal 21 - Mulund',
    description: 'Community directory entry for Mulund. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mulund, Mumbai, Maharashtra', area: "Mulund",
    latitude: 19.171250, longitude: 72.954701, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-22', name: 'Community Ganpati Mandal 22 - Powai',
    description: 'Community directory entry for Powai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Powai, Mumbai, Maharashtra', area: "Powai",
    latitude: 19.117600, longitude: 72.904500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-23', name: 'Community Ganpati Mandal 23 - Andheri West',
    description: 'Community directory entry for Andheri West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri West, Mumbai, Maharashtra', area: "Andheri West",
    latitude: 19.120450, longitude: 72.845501, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-24', name: 'Community Ganpati Mandal 24 - Andheri East',
    description: 'Community directory entry for Andheri East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri East, Mumbai, Maharashtra', area: "Andheri East",
    latitude: 19.114899, longitude: 72.868950, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-25', name: 'Community Ganpati Mandal 25 - Jogeshwari',
    description: 'Community directory entry for Jogeshwari. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Jogeshwari, Mumbai, Maharashtra', area: "Jogeshwari",
    latitude: 19.138000, longitude: 72.848400, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-26', name: 'Community Ganpati Mandal 26 - Goregaon',
    description: 'Community directory entry for Goregaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Goregaon, Mumbai, Maharashtra', area: "Goregaon",
    latitude: 19.167599, longitude: 72.853350, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-27', name: 'Community Ganpati Mandal 27 - Malad West',
    description: 'Community directory entry for Malad West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad West, Mumbai, Maharashtra', area: "Malad West",
    latitude: 19.186750, longitude: 72.849299, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-28', name: 'Community Ganpati Mandal 28 - Malad East',
    description: 'Community directory entry for Malad East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad East, Mumbai, Maharashtra', area: "Malad East",
    latitude: 19.186000, longitude: 72.857500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-29', name: 'Community Ganpati Mandal 29 - Kandivali',
    description: 'Community directory entry for Kandivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kandivali, Mumbai, Maharashtra', area: "Kandivali",
    latitude: 19.203350, longitude: 72.838899, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-30', name: 'Community Ganpati Mandal 30 - Borivali',
    description: 'Community directory entry for Borivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Borivali, Mumbai, Maharashtra', area: "Borivali",
    latitude: 19.229401, longitude: 72.857450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-31', name: 'Community Ganpati Mandal 31 - Dahisar',
    description: 'Community directory entry for Dahisar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dahisar, Mumbai, Maharashtra', area: "Dahisar",
    latitude: 19.248500, longitude: 72.859000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-32', name: 'Community Ganpati Mandal 32 - Bandra',
    description: 'Community directory entry for Bandra. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bandra, Mumbai, Maharashtra', area: "Bandra",
    latitude: 19.059401, longitude: 72.835450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-33', name: 'Community Ganpati Mandal 33 - Santacruz',
    description: 'Community directory entry for Santacruz. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Santacruz, Mumbai, Maharashtra', area: "Santacruz",
    latitude: 19.083550, longitude: 72.834701, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-34', name: 'Community Ganpati Mandal 34 - Vile Parle',
    description: 'Community directory entry for Vile Parle. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vile Parle, Mumbai, Maharashtra', area: "Vile Parle",
    latitude: 19.100000, longitude: 72.844500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-35', name: 'Community Ganpati Mandal 35 - Juhu',
    description: 'Community directory entry for Juhu. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Juhu, Mumbai, Maharashtra', area: "Juhu",
    latitude: 19.108250, longitude: 72.825001, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-36', name: 'Community Ganpati Mandal 36 - Versova',
    description: 'Community directory entry for Versova. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Versova, Mumbai, Maharashtra', area: "Versova",
    latitude: 19.132699, longitude: 72.816450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-37', name: 'Community Ganpati Mandal 37 - Mankhurd',
    description: 'Community directory entry for Mankhurd. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mankhurd, Mumbai, Maharashtra', area: "Mankhurd",
    latitude: 19.050200, longitude: 72.931500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-38', name: 'Community Ganpati Mandal 38 - Govandi',
    description: 'Community directory entry for Govandi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Govandi, Mumbai, Maharashtra', area: "Govandi",
    latitude: 19.056699, longitude: 72.915950, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-39', name: 'Community Ganpati Mandal 39 - Deonar',
    description: 'Community directory entry for Deonar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Deonar, Mumbai, Maharashtra', area: "Deonar",
    latitude: 19.050550, longitude: 72.916799, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-40', name: 'Community Ganpati Mandal 40 - Mira Road',
    description: 'Community directory entry for Mira Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mira Road, Mumbai, Maharashtra', area: "Mira Road",
    latitude: 19.295200, longitude: 72.855900, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-41', name: 'Community Ganpati Mandal 41 - Panvel',
    description: 'Community directory entry for Panvel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Panvel, Mumbai, Maharashtra', area: "Panvel",
    latitude: 18.988550, longitude: 73.123599, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-42', name: 'Community Ganpati Mandal 42 - Navi Mumbai',
    description: 'Community directory entry for Navi Mumbai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Navi Mumbai, Mumbai, Maharashtra', area: "Navi Mumbai",
    latitude: 19.031701, longitude: 73.030450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-43', name: 'Community Ganpati Mandal 43 - Vashi',
    description: 'Community directory entry for Vashi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vashi, Mumbai, Maharashtra', area: "Vashi",
    latitude: 19.075600, longitude: 73.000700, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-44', name: 'Community Ganpati Mandal 44 - Sanpada',
    description: 'Community directory entry for Sanpada. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sanpada, Mumbai, Maharashtra', area: "Sanpada",
    latitude: 19.059901, longitude: 73.008650, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-45', name: 'Community Ganpati Mandal 45 - Kharghar',
    description: 'Community directory entry for Kharghar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kharghar, Mumbai, Maharashtra', area: "Kharghar",
    latitude: 19.046650, longitude: 73.067701, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-46', name: 'Community Ganpati Mandal 46 - Lalbaug',
    description: 'Community directory entry for Lalbaug. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Lalbaug, Mumbai, Maharashtra', area: "Lalbaug",
    latitude: 18.991200, longitude: 72.835500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-47', name: 'Community Ganpati Mandal 47 - Parel',
    description: 'Community directory entry for Parel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Parel, Mumbai, Maharashtra', area: "Parel",
    latitude: 19.000100, longitude: 72.835002, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-48', name: 'Community Ganpati Mandal 48 - Chinchpokli',
    description: 'Community directory entry for Chinchpokli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chinchpokli, Mumbai, Maharashtra', area: "Chinchpokli",
    latitude: 18.988198, longitude: 72.832500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-49', name: 'Community Ganpati Mandal 49 - Byculla',
    description: 'Community directory entry for Byculla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Byculla, Mumbai, Maharashtra', area: "Byculla",
    latitude: 18.979600, longitude: 72.832000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-50', name: 'Community Ganpati Mandal 50 - Fort',
    description: 'Community directory entry for Fort. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Fort, Mumbai, Maharashtra', area: "Fort",
    latitude: 18.934798, longitude: 72.837300, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-51', name: 'Community Ganpati Mandal 51 - Girgaon',
    description: 'Community directory entry for Girgaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Girgaon, Mumbai, Maharashtra', area: "Girgaon",
    latitude: 18.956500, longitude: 72.820098, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-52', name: 'Community Ganpati Mandal 52 - Grant Road',
    description: 'Community directory entry for Grant Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Grant Road, Mumbai, Maharashtra', area: "Grant Road",
    latitude: 18.960100, longitude: 72.821600, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-53', name: 'Community Ganpati Mandal 53 - Charni Road',
    description: 'Community directory entry for Charni Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Charni Road, Mumbai, Maharashtra', area: "Charni Road",
    latitude: 18.950400, longitude: 72.821598, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-54', name: 'Community Ganpati Mandal 54 - Dadar East',
    description: 'Community directory entry for Dadar East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar East, Mumbai, Maharashtra', area: "Dadar East",
    latitude: 19.015202, longitude: 72.849300, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-55', name: 'Community Ganpati Mandal 55 - Dadar West',
    description: 'Community directory entry for Dadar West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar West, Mumbai, Maharashtra', area: "Dadar West",
    latitude: 19.017000, longitude: 72.835000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-56', name: 'Community Ganpati Mandal 56 - Matunga East',
    description: 'Community directory entry for Matunga East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga East, Mumbai, Maharashtra', area: "Matunga East",
    latitude: 19.023202, longitude: 72.853800, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-57', name: 'Community Ganpati Mandal 57 - Matunga West',
    description: 'Community directory entry for Matunga West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga West, Mumbai, Maharashtra', area: "Matunga West",
    latitude: 19.026500, longitude: 72.841402, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-58', name: 'Community Ganpati Mandal 58 - Mahim',
    description: 'Community directory entry for Mahim. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mahim, Mumbai, Maharashtra', area: "Mahim",
    latitude: 19.043000, longitude: 72.837000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-59', name: 'Community Ganpati Mandal 59 - Wadala',
    description: 'Community directory entry for Wadala. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Wadala, Mumbai, Maharashtra', area: "Wadala",
    latitude: 19.016900, longitude: 72.867102, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-60', name: 'Community Ganpati Mandal 60 - Sion',
    description: 'Community directory entry for Sion. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sion, Mumbai, Maharashtra', area: "Sion",
    latitude: 19.048598, longitude: 72.859500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-61', name: 'Community Ganpati Mandal 61 - Kurla',
    description: 'Community directory entry for Kurla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kurla, Mumbai, Maharashtra', area: "Kurla",
    latitude: 19.075600, longitude: 72.879500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-62', name: 'Community Ganpati Mandal 62 - Chembur',
    description: 'Community directory entry for Chembur. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chembur, Mumbai, Maharashtra', area: "Chembur",
    latitude: 19.064598, longitude: 72.898500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-63', name: 'Community Ganpati Mandal 63 - Ghatkopar',
    description: 'Community directory entry for Ghatkopar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Ghatkopar, Mumbai, Maharashtra', area: "Ghatkopar",
    latitude: 19.087500, longitude: 72.910698, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-64', name: 'Community Ganpati Mandal 64 - Vikhroli',
    description: 'Community directory entry for Vikhroli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vikhroli, Mumbai, Maharashtra', area: "Vikhroli",
    latitude: 19.111000, longitude: 72.930000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-65', name: 'Community Ganpati Mandal 65 - Bhandup',
    description: 'Community directory entry for Bhandup. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bhandup, Mumbai, Maharashtra', area: "Bhandup",
    latitude: 19.143500, longitude: 72.940598, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-66', name: 'Community Ganpati Mandal 66 - Mulund',
    description: 'Community directory entry for Mulund. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mulund, Mumbai, Maharashtra', area: "Mulund",
    latitude: 19.169402, longitude: 72.957500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-67', name: 'Community Ganpati Mandal 67 - Powai',
    description: 'Community directory entry for Powai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Powai, Mumbai, Maharashtra', area: "Powai",
    latitude: 19.114600, longitude: 72.906000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-68', name: 'Community Ganpati Mandal 68 - Andheri West',
    description: 'Community directory entry for Andheri West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri West, Mumbai, Maharashtra', area: "Andheri West",
    latitude: 19.117102, longitude: 72.845300, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-69', name: 'Community Ganpati Mandal 69 - Andheri East',
    description: 'Community directory entry for Andheri East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri East, Mumbai, Maharashtra', area: "Andheri East",
    latitude: 19.112100, longitude: 72.867102, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-70', name: 'Community Ganpati Mandal 70 - Jogeshwari',
    description: 'Community directory entry for Jogeshwari. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Jogeshwari, Mumbai, Maharashtra', area: "Jogeshwari",
    latitude: 19.136500, longitude: 72.845400, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-71', name: 'Community Ganpati Mandal 71 - Goregaon',
    description: 'Community directory entry for Goregaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Goregaon, Mumbai, Maharashtra', area: "Goregaon",
    latitude: 19.167800, longitude: 72.850002, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-72', name: 'Community Ganpati Mandal 72 - Malad West',
    description: 'Community directory entry for Malad West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad West, Mumbai, Maharashtra', area: "Malad West",
    latitude: 19.188598, longitude: 72.846500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-73', name: 'Community Ganpati Mandal 73 - Malad East',
    description: 'Community directory entry for Malad East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad East, Mumbai, Maharashtra', area: "Malad East",
    latitude: 19.189000, longitude: 72.856000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-74', name: 'Community Ganpati Mandal 74 - Kandivali',
    description: 'Community directory entry for Kandivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kandivali, Mumbai, Maharashtra', area: "Kandivali",
    latitude: 19.206698, longitude: 72.839100, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-75', name: 'Community Ganpati Mandal 75 - Borivali',
    description: 'Community directory entry for Borivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Borivali, Mumbai, Maharashtra', area: "Borivali",
    latitude: 19.232200, longitude: 72.859298, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-76', name: 'Community Ganpati Mandal 76 - Dahisar',
    description: 'Community directory entry for Dahisar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dahisar, Mumbai, Maharashtra', area: "Dahisar",
    latitude: 19.250000, longitude: 72.862000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-77', name: 'Community Ganpati Mandal 77 - Bandra',
    description: 'Community directory entry for Bandra. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bandra, Mumbai, Maharashtra', area: "Bandra",
    latitude: 19.059200, longitude: 72.838798, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-78', name: 'Community Ganpati Mandal 78 - Santacruz',
    description: 'Community directory entry for Santacruz. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Santacruz, Mumbai, Maharashtra', area: "Santacruz",
    latitude: 19.081702, longitude: 72.837500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-79', name: 'Community Ganpati Mandal 79 - Vile Parle',
    description: 'Community directory entry for Vile Parle. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vile Parle, Mumbai, Maharashtra', area: "Vile Parle",
    latitude: 19.097000, longitude: 72.846000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-80', name: 'Community Ganpati Mandal 80 - Juhu',
    description: 'Community directory entry for Juhu. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Juhu, Mumbai, Maharashtra', area: "Juhu",
    latitude: 19.104902, longitude: 72.824800, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-81', name: 'Community Ganpati Mandal 81 - Versova',
    description: 'Community directory entry for Versova. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Versova, Mumbai, Maharashtra', area: "Versova",
    latitude: 19.129900, longitude: 72.814602, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-82', name: 'Community Ganpati Mandal 82 - Mankhurd',
    description: 'Community directory entry for Mankhurd. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mankhurd, Mumbai, Maharashtra', area: "Mankhurd",
    latitude: 19.048700, longitude: 72.928500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-83', name: 'Community Ganpati Mandal 83 - Govandi',
    description: 'Community directory entry for Govandi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Govandi, Mumbai, Maharashtra', area: "Govandi",
    latitude: 19.056900, longitude: 72.912602, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-84', name: 'Community Ganpati Mandal 84 - Deonar',
    description: 'Community directory entry for Deonar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Deonar, Mumbai, Maharashtra', area: "Deonar",
    latitude: 19.052398, longitude: 72.914000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-85', name: 'Community Ganpati Mandal 85 - Mira Road',
    description: 'Community directory entry for Mira Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mira Road, Mumbai, Maharashtra', area: "Mira Road",
    latitude: 19.298200, longitude: 72.854400, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-86', name: 'Community Ganpati Mandal 86 - Panvel',
    description: 'Community directory entry for Panvel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Panvel, Mumbai, Maharashtra', area: "Panvel",
    latitude: 18.991898, longitude: 73.123800, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-87', name: 'Community Ganpati Mandal 87 - Navi Mumbai',
    description: 'Community directory entry for Navi Mumbai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Navi Mumbai, Mumbai, Maharashtra', area: "Navi Mumbai",
    latitude: 19.034500, longitude: 73.032298, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-88', name: 'Community Ganpati Mandal 88 - Vashi',
    description: 'Community directory entry for Vashi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vashi, Mumbai, Maharashtra', area: "Vashi",
    latitude: 19.077100, longitude: 73.003700, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-89', name: 'Community Ganpati Mandal 89 - Sanpada',
    description: 'Community directory entry for Sanpada. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sanpada, Mumbai, Maharashtra', area: "Sanpada",
    latitude: 19.059700, longitude: 73.011998, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-90', name: 'Community Ganpati Mandal 90 - Kharghar',
    description: 'Community directory entry for Kharghar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kharghar, Mumbai, Maharashtra', area: "Kharghar",
    latitude: 19.044802, longitude: 73.070500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-91', name: 'Community Ganpati Mandal 91 - Lalbaug',
    description: 'Community directory entry for Lalbaug. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Lalbaug, Mumbai, Maharashtra', area: "Lalbaug",
    latitude: 18.986700, longitude: 72.838500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-92', name: 'Community Ganpati Mandal 92 - Parel',
    description: 'Community directory entry for Parel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Parel, Mumbai, Maharashtra', area: "Parel",
    latitude: 18.994703, longitude: 72.835350, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-93', name: 'Community Ganpati Mandal 93 - Chinchpokli',
    description: 'Community directory entry for Chinchpokli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chinchpokli, Mumbai, Maharashtra', area: "Chinchpokli",
    latitude: 18.983350, longitude: 72.830103, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-94', name: 'Community Ganpati Mandal 94 - Byculla',
    description: 'Community directory entry for Byculla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Byculla, Mumbai, Maharashtra', area: "Byculla",
    latitude: 18.976600, longitude: 72.827500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-95', name: 'Community Ganpati Mandal 95 - Fort',
    description: 'Community directory entry for Fort. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Fort, Mumbai, Maharashtra', area: "Fort",
    latitude: 18.934450, longitude: 72.831903, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-96', name: 'Community Ganpati Mandal 96 - Girgaon',
    description: 'Community directory entry for Girgaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Girgaon, Mumbai, Maharashtra', area: "Girgaon",
    latitude: 18.958897, longitude: 72.815250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-97', name: 'Community Ganpati Mandal 97 - Grant Road',
    description: 'Community directory entry for Grant Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Grant Road, Mumbai, Maharashtra', area: "Grant Road",
    latitude: 18.964600, longitude: 72.818600, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-98', name: 'Community Ganpati Mandal 98 - Charni Road',
    description: 'Community directory entry for Charni Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Charni Road, Mumbai, Maharashtra', area: "Charni Road",
    latitude: 18.955797, longitude: 72.821250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-99', name: 'Community Ganpati Mandal 99 - Dadar East',
    description: 'Community directory entry for Dadar East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar East, Mumbai, Maharashtra', area: "Dadar East",
    latitude: 19.020050, longitude: 72.851697, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-100', name: 'Community Ganpati Mandal 100 - Dadar West',
    description: 'Community directory entry for Dadar West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar West, Mumbai, Maharashtra', area: "Dadar West",
    latitude: 19.020000, longitude: 72.839500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-101', name: 'Community Ganpati Mandal 101 - Matunga East',
    description: 'Community directory entry for Matunga East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga East, Mumbai, Maharashtra', area: "Matunga East",
    latitude: 19.023550, longitude: 72.859197, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-102', name: 'Community Ganpati Mandal 102 - Matunga West',
    description: 'Community directory entry for Matunga West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga West, Mumbai, Maharashtra', area: "Matunga West",
    latitude: 19.024103, longitude: 72.846250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-103', name: 'Community Ganpati Mandal 103 - Mahim',
    description: 'Community directory entry for Mahim. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mahim, Mumbai, Maharashtra', area: "Mahim",
    latitude: 19.038500, longitude: 72.840000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-104', name: 'Community Ganpati Mandal 104 - Wadala',
    description: 'Community directory entry for Wadala. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Wadala, Mumbai, Maharashtra', area: "Wadala",
    latitude: 19.011503, longitude: 72.867450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-105', name: 'Community Ganpati Mandal 105 - Sion',
    description: 'Community directory entry for Sion. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sion, Mumbai, Maharashtra', area: "Sion",
    latitude: 19.043750, longitude: 72.857103, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-106', name: 'Community Ganpati Mandal 106 - Kurla',
    description: 'Community directory entry for Kurla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kurla, Mumbai, Maharashtra', area: "Kurla",
    latitude: 19.072600, longitude: 72.875000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-107', name: 'Community Ganpati Mandal 107 - Chembur',
    description: 'Community directory entry for Chembur. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chembur, Mumbai, Maharashtra', area: "Chembur",
    latitude: 19.064250, longitude: 72.893103, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-108', name: 'Community Ganpati Mandal 108 - Ghatkopar',
    description: 'Community directory entry for Ghatkopar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Ghatkopar, Mumbai, Maharashtra', area: "Ghatkopar",
    latitude: 19.089897, longitude: 72.905850, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-109', name: 'Community Ganpati Mandal 109 - Vikhroli',
    description: 'Community directory entry for Vikhroli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vikhroli, Mumbai, Maharashtra', area: "Vikhroli",
    latitude: 19.115500, longitude: 72.927000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-110', name: 'Community Ganpati Mandal 110 - Bhandup',
    description: 'Community directory entry for Bhandup. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bhandup, Mumbai, Maharashtra', area: "Bhandup",
    latitude: 19.148897, longitude: 72.940250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-111', name: 'Community Ganpati Mandal 111 - Mulund',
    description: 'Community directory entry for Mulund. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mulund, Mumbai, Maharashtra', area: "Mulund",
    latitude: 19.174250, longitude: 72.959897, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-112', name: 'Community Ganpati Mandal 112 - Powai',
    description: 'Community directory entry for Powai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Powai, Mumbai, Maharashtra', area: "Powai",
    latitude: 19.117600, longitude: 72.910500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-113', name: 'Community Ganpati Mandal 113 - Andheri West',
    description: 'Community directory entry for Andheri West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri West, Mumbai, Maharashtra', area: "Andheri West",
    latitude: 19.117450, longitude: 72.850697, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-114', name: 'Community Ganpati Mandal 114 - Andheri East',
    description: 'Community directory entry for Andheri East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri East, Mumbai, Maharashtra', area: "Andheri East",
    latitude: 19.109703, longitude: 72.871950, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-115', name: 'Community Ganpati Mandal 115 - Jogeshwari',
    description: 'Community directory entry for Jogeshwari. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Jogeshwari, Mumbai, Maharashtra', area: "Jogeshwari",
    latitude: 19.132000, longitude: 72.848400, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-116', name: 'Community Ganpati Mandal 116 - Goregaon',
    description: 'Community directory entry for Goregaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Goregaon, Mumbai, Maharashtra', area: "Goregaon",
    latitude: 19.162403, longitude: 72.850350, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-117', name: 'Community Ganpati Mandal 117 - Malad West',
    description: 'Community directory entry for Malad West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad West, Mumbai, Maharashtra', area: "Malad West",
    latitude: 19.183750, longitude: 72.844103, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-118', name: 'Community Ganpati Mandal 118 - Malad East',
    description: 'Community directory entry for Malad East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad East, Mumbai, Maharashtra', area: "Malad East",
    latitude: 19.186000, longitude: 72.851500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-119', name: 'Community Ganpati Mandal 119 - Kandivali',
    description: 'Community directory entry for Kandivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kandivali, Mumbai, Maharashtra', area: "Kandivali",
    latitude: 19.206350, longitude: 72.833703, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-120', name: 'Community Ganpati Mandal 120 - Borivali',
    description: 'Community directory entry for Borivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Borivali, Mumbai, Maharashtra', area: "Borivali",
    latitude: 19.234597, longitude: 72.854450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-121', name: 'Community Ganpati Mandal 121 - Dahisar',
    description: 'Community directory entry for Dahisar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dahisar, Mumbai, Maharashtra', area: "Dahisar",
    latitude: 19.254500, longitude: 72.859000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-122', name: 'Community Ganpati Mandal 122 - Bandra',
    description: 'Community directory entry for Bandra. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bandra, Mumbai, Maharashtra', area: "Bandra",
    latitude: 19.064597, longitude: 72.838450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-123', name: 'Community Ganpati Mandal 123 - Santacruz',
    description: 'Community directory entry for Santacruz. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Santacruz, Mumbai, Maharashtra', area: "Santacruz",
    latitude: 19.086550, longitude: 72.839897, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-124', name: 'Community Ganpati Mandal 124 - Vile Parle',
    description: 'Community directory entry for Vile Parle. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vile Parle, Mumbai, Maharashtra', area: "Vile Parle",
    latitude: 19.100000, longitude: 72.850500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-125', name: 'Community Ganpati Mandal 125 - Juhu',
    description: 'Community directory entry for Juhu. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Juhu, Mumbai, Maharashtra', area: "Juhu",
    latitude: 19.105250, longitude: 72.830197, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-126', name: 'Community Ganpati Mandal 126 - Versova',
    description: 'Community directory entry for Versova. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Versova, Mumbai, Maharashtra', area: "Versova",
    latitude: 19.127503, longitude: 72.819450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-127', name: 'Community Ganpati Mandal 127 - Mankhurd',
    description: 'Community directory entry for Mankhurd. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mankhurd, Mumbai, Maharashtra', area: "Mankhurd",
    latitude: 19.044200, longitude: 72.931500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-128', name: 'Community Ganpati Mandal 128 - Govandi',
    description: 'Community directory entry for Govandi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Govandi, Mumbai, Maharashtra', area: "Govandi",
    latitude: 19.051503, longitude: 72.912950, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-129', name: 'Community Ganpati Mandal 129 - Deonar',
    description: 'Community directory entry for Deonar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Deonar, Mumbai, Maharashtra', area: "Deonar",
    latitude: 19.047550, longitude: 72.911603, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-130', name: 'Community Ganpati Mandal 130 - Mira Road',
    description: 'Community directory entry for Mira Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mira Road, Mumbai, Maharashtra', area: "Mira Road",
    latitude: 19.295200, longitude: 72.849900, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-131', name: 'Community Ganpati Mandal 131 - Panvel',
    description: 'Community directory entry for Panvel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Panvel, Mumbai, Maharashtra', area: "Panvel",
    latitude: 18.991550, longitude: 73.118403, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-132', name: 'Community Ganpati Mandal 132 - Navi Mumbai',
    description: 'Community directory entry for Navi Mumbai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Navi Mumbai, Mumbai, Maharashtra', area: "Navi Mumbai",
    latitude: 19.036897, longitude: 73.027450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-133', name: 'Community Ganpati Mandal 133 - Vashi',
    description: 'Community directory entry for Vashi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vashi, Mumbai, Maharashtra', area: "Vashi",
    latitude: 19.081600, longitude: 73.000700, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-134', name: 'Community Ganpati Mandal 134 - Sanpada',
    description: 'Community directory entry for Sanpada. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sanpada, Mumbai, Maharashtra', area: "Sanpada",
    latitude: 19.065097, longitude: 73.011650, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-135', name: 'Community Ganpati Mandal 135 - Kharghar',
    description: 'Community directory entry for Kharghar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kharghar, Mumbai, Maharashtra', area: "Kharghar",
    latitude: 19.049650, longitude: 73.072897, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-136', name: 'Community Ganpati Mandal 136 - Lalbaug',
    description: 'Community directory entry for Lalbaug. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Lalbaug, Mumbai, Maharashtra', area: "Lalbaug",
    latitude: 18.991200, longitude: 72.844500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-137', name: 'Community Ganpati Mandal 137 - Parel',
    description: 'Community directory entry for Parel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Parel, Mumbai, Maharashtra', area: "Parel",
    latitude: 18.995600, longitude: 72.842796, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-138', name: 'Community Ganpati Mandal 138 - Chinchpokli',
    description: 'Community directory entry for Chinchpokli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chinchpokli, Mumbai, Maharashtra', area: "Chinchpokli",
    latitude: 18.980404, longitude: 72.837000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-139', name: 'Community Ganpati Mandal 139 - Byculla',
    description: 'Community directory entry for Byculla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Byculla, Mumbai, Maharashtra', area: "Byculla",
    latitude: 18.970600, longitude: 72.832000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-140', name: 'Community Ganpati Mandal 140 - Fort',
    description: 'Community directory entry for Fort. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Fort, Mumbai, Maharashtra', area: "Fort",
    latitude: 18.927004, longitude: 72.832800, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-141', name: 'Community Ganpati Mandal 141 - Girgaon',
    description: 'Community directory entry for Girgaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Girgaon, Mumbai, Maharashtra', area: "Girgaon",
    latitude: 18.952000, longitude: 72.812304, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-142', name: 'Community Ganpati Mandal 142 - Grant Road',
    description: 'Community directory entry for Grant Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Grant Road, Mumbai, Maharashtra', area: "Grant Road",
    latitude: 18.960100, longitude: 72.812600, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-143', name: 'Community Ganpati Mandal 143 - Charni Road',
    description: 'Community directory entry for Charni Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Charni Road, Mumbai, Maharashtra', area: "Charni Road",
    latitude: 18.954900, longitude: 72.813804, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-144', name: 'Community Ganpati Mandal 144 - Dadar East',
    description: 'Community directory entry for Dadar East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar East, Mumbai, Maharashtra', area: "Dadar East",
    latitude: 19.022996, longitude: 72.844800, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-145', name: 'Community Ganpati Mandal 145 - Dadar West',
    description: 'Community directory entry for Dadar West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar West, Mumbai, Maharashtra', area: "Dadar West",
    latitude: 19.026000, longitude: 72.835000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-146', name: 'Community Ganpati Mandal 146 - Matunga East',
    description: 'Community directory entry for Matunga East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga East, Mumbai, Maharashtra', area: "Matunga East",
    latitude: 19.030996, longitude: 72.858300, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-147', name: 'Community Ganpati Mandal 147 - Matunga West',
    description: 'Community directory entry for Matunga West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga West, Mumbai, Maharashtra', area: "Matunga West",
    latitude: 19.031000, longitude: 72.849196, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-148', name: 'Community Ganpati Mandal 148 - Mahim',
    description: 'Community directory entry for Mahim. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mahim, Mumbai, Maharashtra', area: "Mahim",
    latitude: 19.043000, longitude: 72.846000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-149', name: 'Community Ganpati Mandal 149 - Wadala',
    description: 'Community directory entry for Wadala. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Wadala, Mumbai, Maharashtra', area: "Wadala",
    latitude: 19.012400, longitude: 72.874896, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-150', name: 'Community Ganpati Mandal 150 - Sion',
    description: 'Community directory entry for Sion. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sion, Mumbai, Maharashtra', area: "Sion",
    latitude: 19.040804, longitude: 72.864000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-151', name: 'Community Ganpati Mandal 151 - Kurla',
    description: 'Community directory entry for Kurla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kurla, Mumbai, Maharashtra', area: "Kurla",
    latitude: 19.066600, longitude: 72.879500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-152', name: 'Community Ganpati Mandal 152 - Chembur',
    description: 'Community directory entry for Chembur. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chembur, Mumbai, Maharashtra', area: "Chembur",
    latitude: 19.056804, longitude: 72.894000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-153', name: 'Community Ganpati Mandal 153 - Ghatkopar',
    description: 'Community directory entry for Ghatkopar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Ghatkopar, Mumbai, Maharashtra', area: "Ghatkopar",
    latitude: 19.083000, longitude: 72.902904, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-154', name: 'Community Ganpati Mandal 154 - Vikhroli',
    description: 'Community directory entry for Vikhroli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vikhroli, Mumbai, Maharashtra', area: "Vikhroli",
    latitude: 19.111000, longitude: 72.921000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-155', name: 'Community Ganpati Mandal 155 - Bhandup',
    description: 'Community directory entry for Bhandup. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bhandup, Mumbai, Maharashtra', area: "Bhandup",
    latitude: 19.148000, longitude: 72.932804, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-156', name: 'Community Ganpati Mandal 156 - Mulund',
    description: 'Community directory entry for Mulund. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mulund, Mumbai, Maharashtra', area: "Mulund",
    latitude: 19.177196, longitude: 72.953000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-157', name: 'Community Ganpati Mandal 157 - Powai',
    description: 'Community directory entry for Powai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Powai, Mumbai, Maharashtra', area: "Powai",
    latitude: 19.123600, longitude: 72.906000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-158', name: 'Community Ganpati Mandal 158 - Andheri West',
    description: 'Community directory entry for Andheri West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri West, Mumbai, Maharashtra', area: "Andheri West",
    latitude: 19.124896, longitude: 72.849800, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-159', name: 'Community Ganpati Mandal 159 - Andheri East',
    description: 'Community directory entry for Andheri East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri East, Mumbai, Maharashtra', area: "Andheri East",
    latitude: 19.116600, longitude: 72.874896, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-160', name: 'Community Ganpati Mandal 160 - Jogeshwari',
    description: 'Community directory entry for Jogeshwari. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Jogeshwari, Mumbai, Maharashtra', area: "Jogeshwari",
    latitude: 19.136500, longitude: 72.854400, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-161', name: 'Community Ganpati Mandal 161 - Goregaon',
    description: 'Community directory entry for Goregaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Goregaon, Mumbai, Maharashtra', area: "Goregaon",
    latitude: 19.163300, longitude: 72.857796, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-162', name: 'Community Ganpati Mandal 162 - Malad West',
    description: 'Community directory entry for Malad West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad West, Mumbai, Maharashtra', area: "Malad West",
    latitude: 19.180804, longitude: 72.851000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-163', name: 'Community Ganpati Mandal 163 - Malad East',
    description: 'Community directory entry for Malad East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad East, Mumbai, Maharashtra', area: "Malad East",
    latitude: 19.180000, longitude: 72.856000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-164', name: 'Community Ganpati Mandal 164 - Kandivali',
    description: 'Community directory entry for Kandivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kandivali, Mumbai, Maharashtra', area: "Kandivali",
    latitude: 19.198904, longitude: 72.834600, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-165', name: 'Community Ganpati Mandal 165 - Borivali',
    description: 'Community directory entry for Borivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Borivali, Mumbai, Maharashtra', area: "Borivali",
    latitude: 19.227700, longitude: 72.851504, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-166', name: 'Community Ganpati Mandal 166 - Dahisar',
    description: 'Community directory entry for Dahisar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dahisar, Mumbai, Maharashtra', area: "Dahisar",
    latitude: 19.250000, longitude: 72.853000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-167', name: 'Community Ganpati Mandal 167 - Bandra',
    description: 'Community directory entry for Bandra. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bandra, Mumbai, Maharashtra', area: "Bandra",
    latitude: 19.063700, longitude: 72.831004, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-168', name: 'Community Ganpati Mandal 168 - Santacruz',
    description: 'Community directory entry for Santacruz. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Santacruz, Mumbai, Maharashtra', area: "Santacruz",
    latitude: 19.089496, longitude: 72.833000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-169', name: 'Community Ganpati Mandal 169 - Vile Parle',
    description: 'Community directory entry for Vile Parle. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vile Parle, Mumbai, Maharashtra', area: "Vile Parle",
    latitude: 19.106000, longitude: 72.846000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-170', name: 'Community Ganpati Mandal 170 - Juhu',
    description: 'Community directory entry for Juhu. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Juhu, Mumbai, Maharashtra', area: "Juhu",
    latitude: 19.112696, longitude: 72.829300, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-171', name: 'Community Ganpati Mandal 171 - Versova',
    description: 'Community directory entry for Versova. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Versova, Mumbai, Maharashtra', area: "Versova",
    latitude: 19.134400, longitude: 72.822396, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-172', name: 'Community Ganpati Mandal 172 - Mankhurd',
    description: 'Community directory entry for Mankhurd. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mankhurd, Mumbai, Maharashtra', area: "Mankhurd",
    latitude: 19.048700, longitude: 72.937500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-173', name: 'Community Ganpati Mandal 173 - Govandi',
    description: 'Community directory entry for Govandi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Govandi, Mumbai, Maharashtra', area: "Govandi",
    latitude: 19.052400, longitude: 72.920396, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-174', name: 'Community Ganpati Mandal 174 - Deonar',
    description: 'Community directory entry for Deonar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Deonar, Mumbai, Maharashtra', area: "Deonar",
    latitude: 19.044604, longitude: 72.918500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-175', name: 'Community Ganpati Mandal 175 - Mira Road',
    description: 'Community directory entry for Mira Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mira Road, Mumbai, Maharashtra', area: "Mira Road",
    latitude: 19.289200, longitude: 72.854400, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-176', name: 'Community Ganpati Mandal 176 - Panvel',
    description: 'Community directory entry for Panvel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Panvel, Mumbai, Maharashtra', area: "Panvel",
    latitude: 18.984104, longitude: 73.119300, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-177', name: 'Community Ganpati Mandal 177 - Navi Mumbai',
    description: 'Community directory entry for Navi Mumbai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Navi Mumbai, Mumbai, Maharashtra', area: "Navi Mumbai",
    latitude: 19.030000, longitude: 73.024504, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-178', name: 'Community Ganpati Mandal 178 - Vashi',
    description: 'Community directory entry for Vashi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vashi, Mumbai, Maharashtra', area: "Vashi",
    latitude: 19.077100, longitude: 72.994700, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-179', name: 'Community Ganpati Mandal 179 - Sanpada',
    description: 'Community directory entry for Sanpada. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sanpada, Mumbai, Maharashtra', area: "Sanpada",
    latitude: 19.064200, longitude: 73.004204, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-180', name: 'Community Ganpati Mandal 180 - Kharghar',
    description: 'Community directory entry for Kharghar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kharghar, Mumbai, Maharashtra', area: "Kharghar",
    latitude: 19.052596, longitude: 73.066000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-181', name: 'Community Ganpati Mandal 181 - Lalbaug',
    description: 'Community directory entry for Lalbaug. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Lalbaug, Mumbai, Maharashtra', area: "Lalbaug",
    latitude: 18.998700, longitude: 72.838500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-182', name: 'Community Ganpati Mandal 182 - Parel',
    description: 'Community directory entry for Parel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Parel, Mumbai, Maharashtra', area: "Parel",
    latitude: 19.005095, longitude: 72.841350, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-183', name: 'Community Ganpati Mandal 183 - Chinchpokli',
    description: 'Community directory entry for Chinchpokli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chinchpokli, Mumbai, Maharashtra', area: "Chinchpokli",
    latitude: 18.989350, longitude: 72.840495, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-184', name: 'Community Ganpati Mandal 184 - Byculla',
    description: 'Community directory entry for Byculla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Byculla, Mumbai, Maharashtra', area: "Byculla",
    latitude: 18.976600, longitude: 72.839500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-185', name: 'Community Ganpati Mandal 185 - Fort',
    description: 'Community directory entry for Fort. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Fort, Mumbai, Maharashtra', area: "Fort",
    latitude: 18.928450, longitude: 72.842295, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-186', name: 'Community Ganpati Mandal 186 - Girgaon',
    description: 'Community directory entry for Girgaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Girgaon, Mumbai, Maharashtra', area: "Girgaon",
    latitude: 18.948505, longitude: 72.821250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-187', name: 'Community Ganpati Mandal 187 - Grant Road',
    description: 'Community directory entry for Grant Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Grant Road, Mumbai, Maharashtra', area: "Grant Road",
    latitude: 18.952600, longitude: 72.818600, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-188', name: 'Community Ganpati Mandal 188 - Charni Road',
    description: 'Community directory entry for Charni Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Charni Road, Mumbai, Maharashtra', area: "Charni Road",
    latitude: 18.945405, longitude: 72.815250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-189', name: 'Community Ganpati Mandal 189 - Dadar East',
    description: 'Community directory entry for Dadar East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar East, Mumbai, Maharashtra', area: "Dadar East",
    latitude: 19.014050, longitude: 72.841305, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-190', name: 'Community Ganpati Mandal 190 - Dadar West',
    description: 'Community directory entry for Dadar West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar West, Mumbai, Maharashtra', area: "Dadar West",
    latitude: 19.020000, longitude: 72.827500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-191', name: 'Community Ganpati Mandal 191 - Matunga East',
    description: 'Community directory entry for Matunga East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga East, Mumbai, Maharashtra', area: "Matunga East",
    latitude: 19.029550, longitude: 72.848805, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-192', name: 'Community Ganpati Mandal 192 - Matunga West',
    description: 'Community directory entry for Matunga West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga West, Mumbai, Maharashtra', area: "Matunga West",
    latitude: 19.034495, longitude: 72.840250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-193', name: 'Community Ganpati Mandal 193 - Mahim',
    description: 'Community directory entry for Mahim. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mahim, Mumbai, Maharashtra', area: "Mahim",
    latitude: 19.050500, longitude: 72.840000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-194', name: 'Community Ganpati Mandal 194 - Wadala',
    description: 'Community directory entry for Wadala. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Wadala, Mumbai, Maharashtra', area: "Wadala",
    latitude: 19.021895, longitude: 72.873450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-195', name: 'Community Ganpati Mandal 195 - Sion',
    description: 'Community directory entry for Sion. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sion, Mumbai, Maharashtra', area: "Sion",
    latitude: 19.049750, longitude: 72.867495, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-196', name: 'Community Ganpati Mandal 196 - Kurla',
    description: 'Community directory entry for Kurla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kurla, Mumbai, Maharashtra', area: "Kurla",
    latitude: 19.072600, longitude: 72.887000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-197', name: 'Community Ganpati Mandal 197 - Chembur',
    description: 'Community directory entry for Chembur. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chembur, Mumbai, Maharashtra', area: "Chembur",
    latitude: 19.058250, longitude: 72.903495, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-198', name: 'Community Ganpati Mandal 198 - Ghatkopar',
    description: 'Community directory entry for Ghatkopar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Ghatkopar, Mumbai, Maharashtra', area: "Ghatkopar",
    latitude: 19.079505, longitude: 72.911850, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-199', name: 'Community Ganpati Mandal 199 - Vikhroli',
    description: 'Community directory entry for Vikhroli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vikhroli, Mumbai, Maharashtra', area: "Vikhroli",
    latitude: 19.103500, longitude: 72.927000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-200', name: 'Community Ganpati Mandal 200 - Bhandup',
    description: 'Community directory entry for Bhandup. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bhandup, Mumbai, Maharashtra', area: "Bhandup",
    latitude: 19.138505, longitude: 72.934250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-201', name: 'Community Ganpati Mandal 201 - Mulund',
    description: 'Community directory entry for Mulund. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mulund, Mumbai, Maharashtra', area: "Mulund",
    latitude: 19.168250, longitude: 72.949505, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-202', name: 'Community Ganpati Mandal 202 - Powai',
    description: 'Community directory entry for Powai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Powai, Mumbai, Maharashtra', area: "Powai",
    latitude: 19.117600, longitude: 72.898500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-203', name: 'Community Ganpati Mandal 203 - Andheri West',
    description: 'Community directory entry for Andheri West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri West, Mumbai, Maharashtra', area: "Andheri West",
    latitude: 19.123450, longitude: 72.840305, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-204', name: 'Community Ganpati Mandal 204 - Andheri East',
    description: 'Community directory entry for Andheri East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri East, Mumbai, Maharashtra', area: "Andheri East",
    latitude: 19.120095, longitude: 72.865950, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-205', name: 'Community Ganpati Mandal 205 - Jogeshwari',
    description: 'Community directory entry for Jogeshwari. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Jogeshwari, Mumbai, Maharashtra', area: "Jogeshwari",
    latitude: 19.144000, longitude: 72.848400, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-206', name: 'Community Ganpati Mandal 206 - Goregaon',
    description: 'Community directory entry for Goregaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Goregaon, Mumbai, Maharashtra', area: "Goregaon",
    latitude: 19.172795, longitude: 72.856350, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-207', name: 'Community Ganpati Mandal 207 - Malad West',
    description: 'Community directory entry for Malad West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad West, Mumbai, Maharashtra', area: "Malad West",
    latitude: 19.189750, longitude: 72.854495, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-208', name: 'Community Ganpati Mandal 208 - Malad East',
    description: 'Community directory entry for Malad East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad East, Mumbai, Maharashtra', area: "Malad East",
    latitude: 19.186000, longitude: 72.863500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-209', name: 'Community Ganpati Mandal 209 - Kandivali',
    description: 'Community directory entry for Kandivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kandivali, Mumbai, Maharashtra', area: "Kandivali",
    latitude: 19.200350, longitude: 72.844095, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-210', name: 'Community Ganpati Mandal 210 - Borivali',
    description: 'Community directory entry for Borivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Borivali, Mumbai, Maharashtra', area: "Borivali",
    latitude: 19.224205, longitude: 72.860450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-211', name: 'Community Ganpati Mandal 211 - Dahisar',
    description: 'Community directory entry for Dahisar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dahisar, Mumbai, Maharashtra', area: "Dahisar",
    latitude: 19.242500, longitude: 72.859000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-212', name: 'Community Ganpati Mandal 212 - Bandra',
    description: 'Community directory entry for Bandra. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bandra, Mumbai, Maharashtra', area: "Bandra",
    latitude: 19.054205, longitude: 72.832450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-213', name: 'Community Ganpati Mandal 213 - Santacruz',
    description: 'Community directory entry for Santacruz. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Santacruz, Mumbai, Maharashtra', area: "Santacruz",
    latitude: 19.080550, longitude: 72.829505, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-214', name: 'Community Ganpati Mandal 214 - Vile Parle',
    description: 'Community directory entry for Vile Parle. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vile Parle, Mumbai, Maharashtra', area: "Vile Parle",
    latitude: 19.100000, longitude: 72.838500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-215', name: 'Community Ganpati Mandal 215 - Juhu',
    description: 'Community directory entry for Juhu. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Juhu, Mumbai, Maharashtra', area: "Juhu",
    latitude: 19.111250, longitude: 72.819805, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-216', name: 'Community Ganpati Mandal 216 - Versova',
    description: 'Community directory entry for Versova. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Versova, Mumbai, Maharashtra', area: "Versova",
    latitude: 19.137895, longitude: 72.813450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-217', name: 'Community Ganpati Mandal 217 - Mankhurd',
    description: 'Community directory entry for Mankhurd. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mankhurd, Mumbai, Maharashtra', area: "Mankhurd",
    latitude: 19.056200, longitude: 72.931500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-218', name: 'Community Ganpati Mandal 218 - Govandi',
    description: 'Community directory entry for Govandi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Govandi, Mumbai, Maharashtra', area: "Govandi",
    latitude: 19.061895, longitude: 72.918950, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-219', name: 'Community Ganpati Mandal 219 - Deonar',
    description: 'Community directory entry for Deonar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Deonar, Mumbai, Maharashtra', area: "Deonar",
    latitude: 19.053550, longitude: 72.921995, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-220', name: 'Community Ganpati Mandal 220 - Mira Road',
    description: 'Community directory entry for Mira Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mira Road, Mumbai, Maharashtra', area: "Mira Road",
    latitude: 19.295200, longitude: 72.861900, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-221', name: 'Community Ganpati Mandal 221 - Panvel',
    description: 'Community directory entry for Panvel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Panvel, Mumbai, Maharashtra', area: "Panvel",
    latitude: 18.985550, longitude: 73.128795, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-222', name: 'Community Ganpati Mandal 222 - Navi Mumbai',
    description: 'Community directory entry for Navi Mumbai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Navi Mumbai, Mumbai, Maharashtra', area: "Navi Mumbai",
    latitude: 19.026505, longitude: 73.033450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-223', name: 'Community Ganpati Mandal 223 - Vashi',
    description: 'Community directory entry for Vashi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vashi, Mumbai, Maharashtra', area: "Vashi",
    latitude: 19.069600, longitude: 73.000700, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-224', name: 'Community Ganpati Mandal 224 - Sanpada',
    description: 'Community directory entry for Sanpada. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sanpada, Mumbai, Maharashtra', area: "Sanpada",
    latitude: 19.054705, longitude: 73.005650, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-225', name: 'Community Ganpati Mandal 225 - Kharghar',
    description: 'Community directory entry for Kharghar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kharghar, Mumbai, Maharashtra', area: "Kharghar",
    latitude: 19.043650, longitude: 73.062505, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-226', name: 'Community Ganpati Mandal 226 - Lalbaug',
    description: 'Community directory entry for Lalbaug. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Lalbaug, Mumbai, Maharashtra', area: "Lalbaug",
    latitude: 18.991200, longitude: 72.829500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-227', name: 'Community Ganpati Mandal 227 - Parel',
    description: 'Community directory entry for Parel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Parel, Mumbai, Maharashtra', area: "Parel",
    latitude: 19.003100, longitude: 72.829806, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-228', name: 'Community Ganpati Mandal 228 - Chinchpokli',
    description: 'Community directory entry for Chinchpokli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chinchpokli, Mumbai, Maharashtra', area: "Chinchpokli",
    latitude: 18.993394, longitude: 72.829500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-229', name: 'Community Ganpati Mandal 229 - Byculla',
    description: 'Community directory entry for Byculla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Byculla, Mumbai, Maharashtra', area: "Byculla",
    latitude: 18.985600, longitude: 72.832000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-230', name: 'Community Ganpati Mandal 230 - Fort',
    description: 'Community directory entry for Fort. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Fort, Mumbai, Maharashtra', area: "Fort",
    latitude: 18.939994, longitude: 72.840300, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-231', name: 'Community Ganpati Mandal 231 - Girgaon',
    description: 'Community directory entry for Girgaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Girgaon, Mumbai, Maharashtra', area: "Girgaon",
    latitude: 18.959500, longitude: 72.825294, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-232', name: 'Community Ganpati Mandal 232 - Grant Road',
    description: 'Community directory entry for Grant Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Grant Road, Mumbai, Maharashtra', area: "Grant Road",
    latitude: 18.960100, longitude: 72.827600, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-233', name: 'Community Ganpati Mandal 233 - Charni Road',
    description: 'Community directory entry for Charni Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Charni Road, Mumbai, Maharashtra', area: "Charni Road",
    latitude: 18.947400, longitude: 72.826794, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-234', name: 'Community Ganpati Mandal 234 - Dadar East',
    description: 'Community directory entry for Dadar East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar East, Mumbai, Maharashtra', area: "Dadar East",
    latitude: 19.010006, longitude: 72.852300, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-235', name: 'Community Ganpati Mandal 235 - Dadar West',
    description: 'Community directory entry for Dadar West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar West, Mumbai, Maharashtra', area: "Dadar West",
    latitude: 19.011000, longitude: 72.835000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-236', name: 'Community Ganpati Mandal 236 - Matunga East',
    description: 'Community directory entry for Matunga East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga East, Mumbai, Maharashtra', area: "Matunga East",
    latitude: 19.018006, longitude: 72.850800, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-237', name: 'Community Ganpati Mandal 237 - Matunga West',
    description: 'Community directory entry for Matunga West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga West, Mumbai, Maharashtra', area: "Matunga West",
    latitude: 19.023500, longitude: 72.836206, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-238', name: 'Community Ganpati Mandal 238 - Mahim',
    description: 'Community directory entry for Mahim. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mahim, Mumbai, Maharashtra', area: "Mahim",
    latitude: 19.043000, longitude: 72.831000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-239', name: 'Community Ganpati Mandal 239 - Wadala',
    description: 'Community directory entry for Wadala. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Wadala, Mumbai, Maharashtra', area: "Wadala",
    latitude: 19.019900, longitude: 72.861906, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-240', name: 'Community Ganpati Mandal 240 - Sion',
    description: 'Community directory entry for Sion. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sion, Mumbai, Maharashtra', area: "Sion",
    latitude: 19.053794, longitude: 72.856500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-241', name: 'Community Ganpati Mandal 241 - Kurla',
    description: 'Community directory entry for Kurla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kurla, Mumbai, Maharashtra', area: "Kurla",
    latitude: 19.081600, longitude: 72.879500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-242', name: 'Community Ganpati Mandal 242 - Chembur',
    description: 'Community directory entry for Chembur. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chembur, Mumbai, Maharashtra', area: "Chembur",
    latitude: 19.069794, longitude: 72.901500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-243', name: 'Community Ganpati Mandal 243 - Ghatkopar',
    description: 'Community directory entry for Ghatkopar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Ghatkopar, Mumbai, Maharashtra', area: "Ghatkopar",
    latitude: 19.090500, longitude: 72.915894, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-244', name: 'Community Ganpati Mandal 244 - Vikhroli',
    description: 'Community directory entry for Vikhroli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vikhroli, Mumbai, Maharashtra', area: "Vikhroli",
    latitude: 19.111000, longitude: 72.936000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-245', name: 'Community Ganpati Mandal 245 - Bhandup',
    description: 'Community directory entry for Bhandup. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bhandup, Mumbai, Maharashtra', area: "Bhandup",
    latitude: 19.140500, longitude: 72.945794, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-246', name: 'Community Ganpati Mandal 246 - Mulund',
    description: 'Community directory entry for Mulund. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mulund, Mumbai, Maharashtra', area: "Mulund",
    latitude: 19.164206, longitude: 72.960500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-247', name: 'Community Ganpati Mandal 247 - Powai',
    description: 'Community directory entry for Powai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Powai, Mumbai, Maharashtra', area: "Powai",
    latitude: 19.108600, longitude: 72.906000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-248', name: 'Community Ganpati Mandal 248 - Andheri West',
    description: 'Community directory entry for Andheri West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri West, Mumbai, Maharashtra', area: "Andheri West",
    latitude: 19.111906, longitude: 72.842300, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-249', name: 'Community Ganpati Mandal 249 - Andheri East',
    description: 'Community directory entry for Andheri East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri East, Mumbai, Maharashtra', area: "Andheri East",
    latitude: 19.109100, longitude: 72.861906, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-250', name: 'Community Ganpati Mandal 250 - Jogeshwari',
    description: 'Community directory entry for Jogeshwari. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Jogeshwari, Mumbai, Maharashtra', area: "Jogeshwari",
    latitude: 19.136500, longitude: 72.839400, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-251', name: 'Community Ganpati Mandal 251 - Goregaon',
    description: 'Community directory entry for Goregaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Goregaon, Mumbai, Maharashtra', area: "Goregaon",
    latitude: 19.170800, longitude: 72.844806, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-252', name: 'Community Ganpati Mandal 252 - Malad West',
    description: 'Community directory entry for Malad West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad West, Mumbai, Maharashtra', area: "Malad West",
    latitude: 19.193794, longitude: 72.843500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-253', name: 'Community Ganpati Mandal 253 - Malad East',
    description: 'Community directory entry for Malad East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad East, Mumbai, Maharashtra', area: "Malad East",
    latitude: 19.195000, longitude: 72.856000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-254', name: 'Community Ganpati Mandal 254 - Kandivali',
    description: 'Community directory entry for Kandivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kandivali, Mumbai, Maharashtra', area: "Kandivali",
    latitude: 19.211894, longitude: 72.842100, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-255', name: 'Community Ganpati Mandal 255 - Borivali',
    description: 'Community directory entry for Borivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Borivali, Mumbai, Maharashtra', area: "Borivali",
    latitude: 19.235200, longitude: 72.864494, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-256', name: 'Community Ganpati Mandal 256 - Dahisar',
    description: 'Community directory entry for Dahisar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dahisar, Mumbai, Maharashtra', area: "Dahisar",
    latitude: 19.250000, longitude: 72.868000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-257', name: 'Community Ganpati Mandal 257 - Bandra',
    description: 'Community directory entry for Bandra. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bandra, Mumbai, Maharashtra', area: "Bandra",
    latitude: 19.056200, longitude: 72.843994, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-258', name: 'Community Ganpati Mandal 258 - Santacruz',
    description: 'Community directory entry for Santacruz. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Santacruz, Mumbai, Maharashtra', area: "Santacruz",
    latitude: 19.076506, longitude: 72.840500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-259', name: 'Community Ganpati Mandal 259 - Vile Parle',
    description: 'Community directory entry for Vile Parle. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vile Parle, Mumbai, Maharashtra', area: "Vile Parle",
    latitude: 19.091000, longitude: 72.846000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-260', name: 'Community Ganpati Mandal 260 - Juhu',
    description: 'Community directory entry for Juhu. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Juhu, Mumbai, Maharashtra', area: "Juhu",
    latitude: 19.099706, longitude: 72.821800, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-261', name: 'Community Ganpati Mandal 261 - Versova',
    description: 'Community directory entry for Versova. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Versova, Mumbai, Maharashtra', area: "Versova",
    latitude: 19.126900, longitude: 72.809406, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-262', name: 'Community Ganpati Mandal 262 - Mankhurd',
    description: 'Community directory entry for Mankhurd. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mankhurd, Mumbai, Maharashtra', area: "Mankhurd",
    latitude: 19.048700, longitude: 72.922500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-263', name: 'Community Ganpati Mandal 263 - Govandi',
    description: 'Community directory entry for Govandi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Govandi, Mumbai, Maharashtra', area: "Govandi",
    latitude: 19.059900, longitude: 72.907406, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-264', name: 'Community Ganpati Mandal 264 - Deonar',
    description: 'Community directory entry for Deonar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Deonar, Mumbai, Maharashtra', area: "Deonar",
    latitude: 19.057594, longitude: 72.911000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-265', name: 'Community Ganpati Mandal 265 - Mira Road',
    description: 'Community directory entry for Mira Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mira Road, Mumbai, Maharashtra', area: "Mira Road",
    latitude: 19.304200, longitude: 72.854400, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-266', name: 'Community Ganpati Mandal 266 - Panvel',
    description: 'Community directory entry for Panvel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Panvel, Mumbai, Maharashtra', area: "Panvel",
    latitude: 18.997094, longitude: 73.126800, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-267', name: 'Community Ganpati Mandal 267 - Navi Mumbai',
    description: 'Community directory entry for Navi Mumbai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Navi Mumbai, Mumbai, Maharashtra', area: "Navi Mumbai",
    latitude: 19.037500, longitude: 73.037494, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-268', name: 'Community Ganpati Mandal 268 - Vashi',
    description: 'Community directory entry for Vashi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vashi, Mumbai, Maharashtra', area: "Vashi",
    latitude: 19.077100, longitude: 73.009700, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-269', name: 'Community Ganpati Mandal 269 - Sanpada',
    description: 'Community directory entry for Sanpada. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sanpada, Mumbai, Maharashtra', area: "Sanpada",
    latitude: 19.056700, longitude: 73.017194, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-270', name: 'Community Ganpati Mandal 270 - Kharghar',
    description: 'Community directory entry for Kharghar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kharghar, Mumbai, Maharashtra', area: "Kharghar",
    latitude: 19.039606, longitude: 73.073500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-271', name: 'Community Ganpati Mandal 271 - Lalbaug',
    description: 'Community directory entry for Lalbaug. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Lalbaug, Mumbai, Maharashtra', area: "Lalbaug",
    latitude: 18.980700, longitude: 72.838500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-272', name: 'Community Ganpati Mandal 272 - Parel',
    description: 'Community directory entry for Parel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Parel, Mumbai, Maharashtra', area: "Parel",
    latitude: 18.989507, longitude: 72.832350, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-273', name: 'Community Ganpati Mandal 273 - Chinchpokli',
    description: 'Community directory entry for Chinchpokli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chinchpokli, Mumbai, Maharashtra', area: "Chinchpokli",
    latitude: 18.980350, longitude: 72.824907, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-274', name: 'Community Ganpati Mandal 274 - Byculla',
    description: 'Community directory entry for Byculla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Byculla, Mumbai, Maharashtra', area: "Byculla",
    latitude: 18.976600, longitude: 72.821500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-275', name: 'Community Ganpati Mandal 275 - Fort',
    description: 'Community directory entry for Fort. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Fort, Mumbai, Maharashtra', area: "Fort",
    latitude: 18.937450, longitude: 72.826707, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-276', name: 'Community Ganpati Mandal 276 - Girgaon',
    description: 'Community directory entry for Girgaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Girgaon, Mumbai, Maharashtra', area: "Girgaon",
    latitude: 18.964093, longitude: 72.812250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-277', name: 'Community Ganpati Mandal 277 - Grant Road',
    description: 'Community directory entry for Grant Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Grant Road, Mumbai, Maharashtra', area: "Grant Road",
    latitude: 18.970600, longitude: 72.818600, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-278', name: 'Community Ganpati Mandal 278 - Charni Road',
    description: 'Community directory entry for Charni Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Charni Road, Mumbai, Maharashtra', area: "Charni Road",
    latitude: 18.960993, longitude: 72.824250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-279', name: 'Community Ganpati Mandal 279 - Dadar East',
    description: 'Community directory entry for Dadar East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar East, Mumbai, Maharashtra', area: "Dadar East",
    latitude: 19.023050, longitude: 72.856893, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-280', name: 'Community Ganpati Mandal 280 - Dadar West',
    description: 'Community directory entry for Dadar West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar West, Mumbai, Maharashtra', area: "Dadar West",
    latitude: 19.020000, longitude: 72.845500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-281', name: 'Community Ganpati Mandal 281 - Matunga East',
    description: 'Community directory entry for Matunga East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga East, Mumbai, Maharashtra', area: "Matunga East",
    latitude: 19.020550, longitude: 72.864393, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-282', name: 'Community Ganpati Mandal 282 - Matunga West',
    description: 'Community directory entry for Matunga West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga West, Mumbai, Maharashtra', area: "Matunga West",
    latitude: 19.018907, longitude: 72.849250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-283', name: 'Community Ganpati Mandal 283 - Mahim',
    description: 'Community directory entry for Mahim. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mahim, Mumbai, Maharashtra', area: "Mahim",
    latitude: 19.032500, longitude: 72.840000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-284', name: 'Community Ganpati Mandal 284 - Wadala',
    description: 'Community directory entry for Wadala. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Wadala, Mumbai, Maharashtra', area: "Wadala",
    latitude: 19.006307, longitude: 72.864450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-285', name: 'Community Ganpati Mandal 285 - Sion',
    description: 'Community directory entry for Sion. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sion, Mumbai, Maharashtra', area: "Sion",
    latitude: 19.040750, longitude: 72.851907, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-286', name: 'Community Ganpati Mandal 286 - Kurla',
    description: 'Community directory entry for Kurla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kurla, Mumbai, Maharashtra', area: "Kurla",
    latitude: 19.072600, longitude: 72.869000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-287', name: 'Community Ganpati Mandal 287 - Chembur',
    description: 'Community directory entry for Chembur. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chembur, Mumbai, Maharashtra', area: "Chembur",
    latitude: 19.067250, longitude: 72.887907, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-288', name: 'Community Ganpati Mandal 288 - Ghatkopar',
    description: 'Community directory entry for Ghatkopar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Ghatkopar, Mumbai, Maharashtra', area: "Ghatkopar",
    latitude: 19.095093, longitude: 72.902850, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-289', name: 'Community Ganpati Mandal 289 - Vikhroli',
    description: 'Community directory entry for Vikhroli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vikhroli, Mumbai, Maharashtra', area: "Vikhroli",
    latitude: 19.121500, longitude: 72.927000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-290', name: 'Community Ganpati Mandal 290 - Bhandup',
    description: 'Community directory entry for Bhandup. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bhandup, Mumbai, Maharashtra', area: "Bhandup",
    latitude: 19.154093, longitude: 72.943250, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-291', name: 'Community Ganpati Mandal 291 - Mulund',
    description: 'Community directory entry for Mulund. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mulund, Mumbai, Maharashtra', area: "Mulund",
    latitude: 19.177250, longitude: 72.965093, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-292', name: 'Community Ganpati Mandal 292 - Powai',
    description: 'Community directory entry for Powai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Powai, Mumbai, Maharashtra', area: "Powai",
    latitude: 19.117600, longitude: 72.916500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-293', name: 'Community Ganpati Mandal 293 - Andheri West',
    description: 'Community directory entry for Andheri West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri West, Mumbai, Maharashtra', area: "Andheri West",
    latitude: 19.114450, longitude: 72.855893, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-294', name: 'Community Ganpati Mandal 294 - Andheri East',
    description: 'Community directory entry for Andheri East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Andheri East, Mumbai, Maharashtra', area: "Andheri East",
    latitude: 19.104507, longitude: 72.874950, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-295', name: 'Community Ganpati Mandal 295 - Jogeshwari',
    description: 'Community directory entry for Jogeshwari. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Jogeshwari, Mumbai, Maharashtra', area: "Jogeshwari",
    latitude: 19.126000, longitude: 72.848400, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-296', name: 'Community Ganpati Mandal 296 - Goregaon',
    description: 'Community directory entry for Goregaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Goregaon, Mumbai, Maharashtra', area: "Goregaon",
    latitude: 19.157207, longitude: 72.847350, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-297', name: 'Community Ganpati Mandal 297 - Malad West',
    description: 'Community directory entry for Malad West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad West, Mumbai, Maharashtra', area: "Malad West",
    latitude: 19.180750, longitude: 72.838907, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-298', name: 'Community Ganpati Mandal 298 - Malad East',
    description: 'Community directory entry for Malad East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Malad East, Mumbai, Maharashtra', area: "Malad East",
    latitude: 19.186000, longitude: 72.845500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-299', name: 'Community Ganpati Mandal 299 - Kandivali',
    description: 'Community directory entry for Kandivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kandivali, Mumbai, Maharashtra', area: "Kandivali",
    latitude: 19.209350, longitude: 72.828507, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-300', name: 'Community Ganpati Mandal 300 - Borivali',
    description: 'Community directory entry for Borivali. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Borivali, Mumbai, Maharashtra', area: "Borivali",
    latitude: 19.239793, longitude: 72.851450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-301', name: 'Community Ganpati Mandal 301 - Dahisar',
    description: 'Community directory entry for Dahisar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dahisar, Mumbai, Maharashtra', area: "Dahisar",
    latitude: 19.260500, longitude: 72.859000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-302', name: 'Community Ganpati Mandal 302 - Bandra',
    description: 'Community directory entry for Bandra. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Bandra, Mumbai, Maharashtra', area: "Bandra",
    latitude: 19.069793, longitude: 72.841450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-303', name: 'Community Ganpati Mandal 303 - Santacruz',
    description: 'Community directory entry for Santacruz. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Santacruz, Mumbai, Maharashtra', area: "Santacruz",
    latitude: 19.089550, longitude: 72.845093, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-304', name: 'Community Ganpati Mandal 304 - Vile Parle',
    description: 'Community directory entry for Vile Parle. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vile Parle, Mumbai, Maharashtra', area: "Vile Parle",
    latitude: 19.100000, longitude: 72.856500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-305', name: 'Community Ganpati Mandal 305 - Juhu',
    description: 'Community directory entry for Juhu. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Juhu, Mumbai, Maharashtra', area: "Juhu",
    latitude: 19.102250, longitude: 72.835393, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-306', name: 'Community Ganpati Mandal 306 - Versova',
    description: 'Community directory entry for Versova. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Versova, Mumbai, Maharashtra', area: "Versova",
    latitude: 19.122307, longitude: 72.822450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-307', name: 'Community Ganpati Mandal 307 - Mankhurd',
    description: 'Community directory entry for Mankhurd. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mankhurd, Mumbai, Maharashtra', area: "Mankhurd",
    latitude: 19.038200, longitude: 72.931500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-308', name: 'Community Ganpati Mandal 308 - Govandi',
    description: 'Community directory entry for Govandi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Govandi, Mumbai, Maharashtra', area: "Govandi",
    latitude: 19.046307, longitude: 72.909950, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-309', name: 'Community Ganpati Mandal 309 - Deonar',
    description: 'Community directory entry for Deonar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Deonar, Mumbai, Maharashtra', area: "Deonar",
    latitude: 19.044550, longitude: 72.906407, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-310', name: 'Community Ganpati Mandal 310 - Mira Road',
    description: 'Community directory entry for Mira Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Mira Road, Mumbai, Maharashtra', area: "Mira Road",
    latitude: 19.295200, longitude: 72.843900, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-311', name: 'Community Ganpati Mandal 311 - Panvel',
    description: 'Community directory entry for Panvel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Panvel, Mumbai, Maharashtra', area: "Panvel",
    latitude: 18.994550, longitude: 73.113207, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-312', name: 'Community Ganpati Mandal 312 - Navi Mumbai',
    description: 'Community directory entry for Navi Mumbai. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Navi Mumbai, Mumbai, Maharashtra', area: "Navi Mumbai",
    latitude: 19.042093, longitude: 73.024450, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-313', name: 'Community Ganpati Mandal 313 - Vashi',
    description: 'Community directory entry for Vashi. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Vashi, Mumbai, Maharashtra', area: "Vashi",
    latitude: 19.087600, longitude: 73.000700, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-314', name: 'Community Ganpati Mandal 314 - Sanpada',
    description: 'Community directory entry for Sanpada. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Sanpada, Mumbai, Maharashtra', area: "Sanpada",
    latitude: 19.070293, longitude: 73.014650, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-315', name: 'Community Ganpati Mandal 315 - Kharghar',
    description: 'Community directory entry for Kharghar. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Kharghar, Mumbai, Maharashtra', area: "Kharghar",
    latitude: 19.052650, longitude: 73.078093, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-316', name: 'Community Ganpati Mandal 316 - Lalbaug',
    description: 'Community directory entry for Lalbaug. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Lalbaug, Mumbai, Maharashtra', area: "Lalbaug",
    latitude: 18.991200, longitude: 72.850500, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-317', name: 'Community Ganpati Mandal 317 - Parel',
    description: 'Community directory entry for Parel. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Parel, Mumbai, Maharashtra', area: "Parel",
    latitude: 18.992600, longitude: 72.847992, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-318', name: 'Community Ganpati Mandal 318 - Chinchpokli',
    description: 'Community directory entry for Chinchpokli. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Chinchpokli, Mumbai, Maharashtra', area: "Chinchpokli",
    latitude: 18.975208, longitude: 72.840000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-319', name: 'Community Ganpati Mandal 319 - Byculla',
    description: 'Community directory entry for Byculla. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Byculla, Mumbai, Maharashtra', area: "Byculla",
    latitude: 18.964600, longitude: 72.832000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-320', name: 'Community Ganpati Mandal 320 - Fort',
    description: 'Community directory entry for Fort. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Fort, Mumbai, Maharashtra', area: "Fort",
    latitude: 18.921808, longitude: 72.829800, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-321', name: 'Community Ganpati Mandal 321 - Girgaon',
    description: 'Community directory entry for Girgaon. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Girgaon, Mumbai, Maharashtra', area: "Girgaon",
    latitude: 18.949000, longitude: 72.807108, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-322', name: 'Community Ganpati Mandal 322 - Grant Road',
    description: 'Community directory entry for Grant Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Grant Road, Mumbai, Maharashtra', area: "Grant Road",
    latitude: 18.960100, longitude: 72.806600, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-323', name: 'Community Ganpati Mandal 323 - Charni Road',
    description: 'Community directory entry for Charni Road. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Charni Road, Mumbai, Maharashtra', area: "Charni Road",
    latitude: 18.957900, longitude: 72.808608, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-324', name: 'Community Ganpati Mandal 324 - Dadar East',
    description: 'Community directory entry for Dadar East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar East, Mumbai, Maharashtra', area: "Dadar East",
    latitude: 19.028192, longitude: 72.841800, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-325', name: 'Community Ganpati Mandal 325 - Dadar West',
    description: 'Community directory entry for Dadar West. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Dadar West, Mumbai, Maharashtra', area: "Dadar West",
    latitude: 19.032000, longitude: 72.835000, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  },
  {
    id: 'community-326', name: 'Community Ganpati Mandal 326 - Matunga East',
    description: 'Community directory entry for Matunga East. Exact mandal name and GPS should be verified by a user/admin before this entry is treated as authoritative.',
    history: 'Community-submitted discovery entry.', images: [], address: 'Near Matunga East, Mumbai, Maharashtra', area: "Matunga East",
    latitude: 19.036192, longitude: 72.861300, darshanStart: '06:00 AM', darshanEnd: '11:00 PM', crowdLevel: 'Moderate',
    facilities: ['Community Pandal'], popularity: 40, famousFeatures: ['Community Listed', 'Location Pending Verification'], createdAt: new Date().toISOString()
  }
];

// Sample Initial Pandals
const initialPandals: Pandal[] = [
  {
    id: 'pandal-1',
    name: 'Lalbaugcha Raja',
    description: 'The most legendary and revered Sarvajanik Ganpati in Mumbai, visited by millions of devotees and celebrities every year.',
    history: 'Founded in 1934 by local fishermen and market traders after the Peru Chawl market was shut down. Known as "Navsacha Ganpati" (the fulfiller of all wishes).',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lalbaugcha%20Raja%20Mumbai%20Ganesh%20Utsav%202024.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg'
    ],
    address: 'GD Ambekar Marg, Lalbaug, Parel, Mumbai, Maharashtra 400012',
    area: 'Lalbaug',
    latitude: 18.9912,
    longitude: 72.8385,
    darshanStart: '05:00 AM',
    darshanEnd: '11:30 PM',
    crowdLevel: 'Heavy',
    facilities: ['VIP Line', 'Senior Citizen Counter', 'Wheelchair Access', 'Drinking Water', 'First Aid Center', 'Prasad Counter', 'Shoe Stall'],
    popularity: 99,
    famousFeatures: ['Iconic Throne Pose', 'Fulfils All Vows', '24/7 Live Stream', 'Celebrity Presence'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-2',
    name: 'Chinchpokli Cha Chintamani',
    description: 'Famed for its artistic idol posture and emotional arrival procession (Aagman Sohala) that draws hundreds of thousands.',
    history: 'Established in 1920 by the Chinchpokli Sarvajanik Utsav Mandal, celebrating over a century of devotional leadership.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chintamani%20Mumbai%20studio55.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg'
    ],
    address: 'Dattaram Lad Marg, Chinchpokli East, Mumbai 400012',
    area: 'Chinchpokli',
    latitude: 18.9856,
    longitude: 72.8340,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'High',
    facilities: ['Wheelchair Access', 'First Aid', 'Prasad Counter', 'Drinking Water', 'CCTV Security'],
    popularity: 95,
    famousFeatures: ['Majestic Arrival Procession', 'Intricate Traditional Crafts', 'Golden Crown'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-3',
    name: 'GSB Seva Mandal (Kings Circle)',
    description: 'Mumbai\'s richest Ganpati adorned with over 60 kilograms of pure gold and 300 kilograms of silver.',
    history: 'Founded in 1954 by the Gowd Saraswat Brahmin community, maintaining traditional Vedic pooja rituals with eco-friendly clay idol.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/G.%20S.%20B.%20Seva%20Mandal%20Ganpati%20in%20Mumbai.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg'
    ],
    address: 'Bhookailash, Near King Circle Railway Station, Sion West, Mumbai 400022',
    area: 'Sion',
    latitude: 19.0278,
    longitude: 72.8580,
    darshanStart: '06:00 AM',
    darshanEnd: '10:30 PM',
    crowdLevel: 'Moderate',
    facilities: ['Seated Pooja Hall', 'Senior Citizen Express Queue', 'Air Conditioned Mandap', 'First Aid', 'Prasad Stall'],
    popularity: 92,
    famousFeatures: ['60kg Gold Ornaments', 'Traditional Rigveda Chanting', 'Eco-friendly Clay Clay Idol'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-4',
    name: 'Khetwadi Cha Raja (11th Lane)',
    description: 'Renowned for winning multiple awards for the most magnificent and creative idol designs in South Mumbai.',
    history: 'Established in 1959. In 2000, it created history by installing a record-breaking 40-foot Ganpati idol coated in gold.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg'
    ],
    address: '11th Lane Khetwadi, Grant Road, Girgaon, Mumbai 400004',
    area: 'Khetwadi',
    latitude: 18.9567,
    longitude: 72.8220,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'Moderate',
    facilities: ['Parking Nearby', 'Prasad Counter', 'Security Guarded', 'First Aid'],
    popularity: 88,
    famousFeatures: ['Tallest Idol Crafts', 'Golden Theme Lighting', 'Historic Lane Decorations'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-5',
    name: 'Mumbaicha Raja (Ganesh Galli)',
    description: 'Pioneer of thematic pandals in Mumbai, creating breathtaking replicas of famous ancient Indian temples each year.',
    history: 'Founded in 1928, Ganesh Galli is one of the oldest pandals in Lalbaug, setting the benchmark for grand architectural sets.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg'
    ],
    address: 'Ganesh Galli, Lalbaug, Parel, Mumbai 400012',
    area: 'Lalbaug',
    latitude: 18.9901,
    longitude: 72.8370,
    darshanStart: '05:30 AM',
    darshanEnd: '11:30 PM',
    crowdLevel: 'High',
    facilities: ['VIP Entrance', 'Senior Assistance', 'Drinking Water', 'Prasad Counter', 'Medical Stall'],
    popularity: 94,
    famousFeatures: ['Temple Replicas (Kedarnath/Ram Mandir)', 'Historic 22-foot Idol', 'Laser Lights Show'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-6',
    name: 'Andheri Cha Raja (Azad Nagar)',
    description: 'The King of Western Suburbs, celebrated for fulfilling wishes for devotees in the film and television industry.',
    history: 'Established in 1966 by workers of Golden Tobacco Company. Famous for extending immersion past Anant Chaturdashi.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg'
    ],
    address: 'Veera Desai Road, Azad Nagar, Andheri West, Mumbai 400053',
    area: 'Andheri',
    latitude: 19.1197,
    longitude: 72.8288,
    darshanStart: '05:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'Moderate',
    facilities: ['Spacious Parking', 'Prasad Stalls', 'Medical Camp', 'Wheelchair Access'],
    popularity: 90,
    famousFeatures: ['Grand Palace Sets', 'Extended Darshan Days', 'Bollywood Celebrity Visits'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-7',
    name: 'Keshavji Naik Chawl (Girgaon)',
    description: 'Mumbai\'s very first Sarvajanik Ganeshotsav pandal, keeping Indian heritage alive with eco-friendly simplicity.',
    history: 'Started in 1893 by freedom fighter Lokmanya Bal Gangadhar Tilak to unite people during the independence movement.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg'
    ],
    address: 'Keshavji Naik Chawl, Zaoba Wadi, Thakurdwar, Girgaon, Mumbai 400002',
    area: 'Girgaon',
    latitude: 18.9542,
    longitude: 72.8190,
    darshanStart: '07:00 AM',
    darshanEnd: '10:00 PM',
    crowdLevel: 'Low',
    facilities: ['Cultural Performances Stage', 'Eco-friendly Information Desk', 'Prasad Counter'],
    popularity: 86,
    famousFeatures: ['130+ Years Heritage', 'Original 2-foot Shadu Clay Idol', 'Traditional Cultural Programs'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-8',
    name: 'Tejukaya Cha Raja',
    description: 'Famous for eco-conscious celebrations, stunning eco-friendly idol art, and high energy youth volunteers.',
    history: 'Located in Tejukaya Mansion, Lalbaug, celebrated for creating 100% natural paper-pulp and clay idols.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg'
    ],
    address: 'Tejukaya Mansion, Dr. BA Road, Lalbaug, Mumbai 400012',
    area: 'Lalbaug',
    latitude: 18.9892,
    longitude: 72.8360,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'Moderate',
    facilities: ['First Aid', 'Prasad Counter', 'Water Fountain'],
    popularity: 87,
    famousFeatures: ['Eco-Friendly Clay Idol', 'Energetic Dhol Tasha Pathak', 'Lalbaug Heritage Trail'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-9',
    name: 'Sahyadri Cha Raja (Tilak Nagar)',
    description: 'Eastern Suburbs famous pandal renowned for grand set creations and Bollywood-inspired architecture.',
    history: 'Founded in 1977 in Tilak Nagar, Kurla East. Attracts lakhs of devotees across Central and Harbour suburban lines.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg'
    ],
    address: 'Building 81/82, Tilak Nagar, Kurla East, Mumbai 400089',
    area: 'Kurla / Tilak Nagar',
    latitude: 19.0682,
    longitude: 72.8941,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'Moderate',
    facilities: ['Security Checkpoints', 'Prasad Counters', 'First Aid Center', 'Senior Citizen Seating'],
    popularity: 89,
    famousFeatures: ['Cinematic Royal Sets', 'Lively Visarjan Procession', 'Tilak Nagar Grounds Decor'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-10',
    name: 'Fort Cha Raja (CST Fort)',
    description: 'Iconic South Mumbai business district pandal located opposite GPO and Chhatrapati Shivaji Maharaj Terminus.',
    history: 'Established in 1962 by Fort business community, famous for grand traditional brass diyas and palatial decorations.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg'
    ],
    address: 'Mint Road, Opposite General Post Office, Fort, Mumbai 400001',
    area: 'Fort / CST',
    latitude: 18.9388,
    longitude: 72.8362,
    darshanStart: '06:30 AM',
    darshanEnd: '10:30 PM',
    crowdLevel: 'Moderate',
    facilities: ['CST Station Access', 'Drinking Water', 'Prasad Stalls', 'Medical Desk'],
    popularity: 85,
    famousFeatures: ['Heritage Fort Setting', 'Intricate Brass Work', 'Close to CSMT Station'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-11',
    name: 'Chandanwadi Cha Raja (Marine Lines)',
    description: 'Famous South Mumbai pandal known for eco-friendly art work and stunning traditional silver crowns.',
    history: 'Founded in 1970 in Chandanwadi, Marine Lines. Won national accolades for unique idol design without plaster of Paris.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg'
    ],
    address: 'Chandanwadi, Kalbadevi Road, Marine Lines, Mumbai 400002',
    area: 'Marine Lines / Girgaon',
    latitude: 18.9472,
    longitude: 72.8233,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'Moderate',
    facilities: ['Marine Lines Station Access', 'Prasad Counter', 'Senior Assistance'],
    popularity: 87,
    famousFeatures: ['Pure Silver Crown', 'Mirror Work Mandap', 'Proximity to Girgaon Chowpatty'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-12',
    name: 'Rangari Badak Chawl (Kala Chowkie)',
    description: 'Historic Girangaon mill-worker community pandal preserving classic Marathi Ganeshotsav traditions.',
    history: 'Established in 1938 in Kala Chowkie. Known for community-driven cultural events and traditional dhol-tasha pathaks.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg'
    ],
    address: 'Dattaram Lad Marg, Kala Chowkie, Cotton Green, Mumbai 400033',
    area: 'Kala Chowkie',
    latitude: 18.9868,
    longitude: 72.8421,
    darshanStart: '06:00 AM',
    darshanEnd: '10:30 PM',
    crowdLevel: 'Moderate',
    facilities: ['Chinchpokli / Cotton Green Station Access', 'Prasad Counter', 'Local Medical Camp'],
    popularity: 84,
    famousFeatures: ['Classic Mill-worker Heritage', 'Traditional Clay Artistry', 'Local Cultural Folk Stage'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-13',
    name: 'Thane Cha Raja (Khopat Thane)',
    description: 'The largest and most revered Sarvajanik Ganeshotsav pandal in Thane city.',
    history: 'Founded in 1960 at Khopat, Thane West. Known for elaborate social awareness themes and grand lighting.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg'
    ],
    address: 'Khopat, Thane West, Thane 400601',
    area: 'Thane West',
    latitude: 19.1992,
    longitude: 72.9731,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'High',
    facilities: ['Thane Station Bus/Auto Stand', 'VIP Queue', 'Prasad Hall', 'CCTV Security'],
    popularity: 88,
    famousFeatures: ['Thane Suburban Pride', 'Grand Social Themes', 'Huge Lighting Arches'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-14',
    name: 'Bandra Cha Raja (Reclamation Bandra)',
    description: 'Seaside Western Suburbs pandal near Bandra Reclamation and Bandra-Worli Sea Link.',
    history: 'Established in 1978. Famous for scenic sea-breeze venue decor and community social service projects.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg'
    ],
    address: 'Bandra Reclamation, Near Lilavati Hospital, Bandra West, Mumbai 400050',
    area: 'Bandra West',
    latitude: 19.0512,
    longitude: 72.8275,
    darshanStart: '06:00 AM',
    darshanEnd: '10:30 PM',
    crowdLevel: 'Low',
    facilities: ['Bandra Station Bus Access', 'Ample Parking', 'Prasad Stall', 'First Aid'],
    popularity: 82,
    famousFeatures: ['Sea Link View Backdrop', 'Coastal Environment Theme', 'Community Blood Donation Camps'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-15',
    name: 'Ghatkopar Cha Raja (Pant Nagar)',
    description: 'Premier Eastern Suburbs pandal featuring massive eco-clay idols and traditional Konkan arti chanting.',
    history: 'Founded in 1972 at Pant Nagar, Ghatkopar East. A vital pilgrimage point for Central Railway commuters.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg'
    ],
    address: 'Pant Nagar, Ghatkopar East, Mumbai 400075',
    area: 'Ghatkopar East',
    latitude: 19.0831,
    longitude: 72.9112,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'Moderate',
    facilities: ['Ghatkopar Station & Metro Access', 'Prasad Counter', 'Senior Seating', 'Medical Booth'],
    popularity: 86,
    famousFeatures: ['Metro 1 Direct Route', 'Vedic Stotra Chanting', 'Illuminated Pandal Pavilion'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-16',
    name: 'Navi Mumbai Cha Raja Shiv Chhaya Mitra Mandal',
    description: 'The iconic "Navi Mumbai Cha Raja" at Turbhe Sector 21 known for grand lighting arches and majestic idol styling.',
    history: 'Founded in Turbhe Sector 21, Shiv Chhaya Mitra Mandal is one of the oldest and most revered Sarvajanik Ganeshotsav mandals in Navi Mumbai.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg'
    ],
    address: 'Turbhe Sector 21, Near Turbhe Railway Station, Navi Mumbai 400705',
    area: 'Turbhe / Navi Mumbai',
    latitude: 19.0620,
    longitude: 73.0118,
    darshanStart: '06:00 AM',
    darshanEnd: '11:30 PM',
    crowdLevel: 'High',
    facilities: ['Turbhe Station Access', 'Prasad Counter', 'Queue Management', 'Medical Booth'],
    popularity: 92,
    famousFeatures: ['Navi Mumbai Cha Raja Title', 'Royal Throne Styling', 'Grand Illumination'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-17',
    name: 'Juinagarcha Raja',
    description: 'Revered "Juinagarcha Raja" of Juinagar Sector 23 drawing thousands of devotees along the Harbour line corridor.',
    history: 'Established by Juinagar Sector 23 residents, famous for spiritual atmosphere, eco-friendly practices, and active youth volunteers.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg'
    ],
    address: 'Sector 23, Juinagar West, Near Juinagar Railway Station, Navi Mumbai 400706',
    area: 'Juinagar / Navi Mumbai',
    latitude: 19.0435,
    longitude: 73.0180,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'Moderate',
    facilities: ['Juinagar Station Walking Access', 'Prasad Hall', 'Senior Assistance'],
    popularity: 88,
    famousFeatures: ['Divine Idol Posture', 'Traditional Dhol Tasha', 'Cultural Evening Stage'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-18',
    name: 'Yuva Ganesh Utsav Mandal (Vashi Sec 8)',
    description: 'Dynamic youth-led Ganeshotsav mandal in Vashi Sector 8 celebrated for high energy and social initiatives.',
    history: 'Initiated by the passionate youth of Vashi Sector 8, known for hosting blood donation drives and vibrant aarti performances.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg'
    ],
    address: 'Sector 8, Vashi, Near Vashi Plaza, Navi Mumbai 400703',
    area: 'Vashi / Navi Mumbai',
    latitude: 19.0792,
    longitude: 72.9935,
    darshanStart: '06:30 AM',
    darshanEnd: '10:30 PM',
    crowdLevel: 'Moderate',
    facilities: ['Vashi Station Bus Access', 'Prasad Counter', 'First Aid'],
    popularity: 85,
    famousFeatures: ['Youth Dhol Tasha Pathak', 'Social Awareness Theme', 'Vashi City Center Venue'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-19',
    name: 'Juhugaoncha Raja Sarvajanik Mandal',
    description: 'Heritage village Ganeshotsav pandal in Juhugaon Vashi Sector 11 with rich local traditions.',
    history: 'Preserving over 5 decades of ancestral village Ganeshotsav heritage in Juhugaon, Vashi.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20on%20Juhu%20Beach%2C%20Mumbai.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg'
    ],
    address: 'Juhugaon, Sector 11, Vashi, Navi Mumbai 400703',
    area: 'Vashi / Navi Mumbai',
    latitude: 19.0815,
    longitude: 72.9860,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'Moderate',
    facilities: ['Prasad Stalls', 'Drinking Water', 'Community Hall'],
    popularity: 86,
    famousFeatures: ['Traditional Village Heritage', 'Eco-Clay Idol', 'Lively Visarjan Procession'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-20',
    name: 'Prerna Seva Mandal (Vashi Sec 6)',
    description: 'Community-oriented Ganeshotsav mandal in Vashi Sector 6 known for civic service projects and grand mandap.',
    history: 'Established in Vashi Sector 6 to foster local harmony and support underprivileged students during festival season.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg'
    ],
    address: 'Sector 6, Vashi, Navi Mumbai 400703',
    area: 'Vashi / Navi Mumbai',
    latitude: 19.0720,
    longitude: 72.9912,
    darshanStart: '06:00 AM',
    darshanEnd: '10:30 PM',
    crowdLevel: 'Low',
    facilities: ['Prasad Distribution', 'Medical Desk', 'Parking Area'],
    popularity: 83,
    famousFeatures: ['Prerna Educational Drive', 'Devotional Bhajan Evenings', 'Vashi Sector 6 Landmark'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-21',
    name: 'Akhil Diva Airoli Ganeshotsav Mandal',
    description: 'Premier Northern Navi Mumbai Ganeshotsav pandal in Airoli Sector 8 Diva gaon.',
    history: 'The principal community mandal in Airoli Sector 8, famous for hosting palace replica stages and grand lighting.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg'
    ],
    address: 'Diva Gaon, Sector 8, Airoli, Navi Mumbai 400708',
    area: 'Airoli / Navi Mumbai',
    latitude: 19.1558,
    longitude: 72.9968,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'High',
    facilities: ['Airoli Station Bus Connection', 'Queue Lines', 'Prasad Counter', 'Security Guarded'],
    popularity: 89,
    famousFeatures: ['Airoli Northern Pride', 'Palace Replica Mandap', 'Grand Mahaprasad'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-22',
    name: 'Shivlalkar Ganesh Utsav Mitra Mandal',
    description: 'Beloved Kopar Khairane Sector 15 pandal celebrated for divine idol design and energetic evening bhakthi.',
    history: 'Serving Kopar Khairane Sector 15 residents with devotional fervor and traditional Marathi cultural programs.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg'
    ],
    address: 'Sector 15, Kopar Khairane, Navi Mumbai 400709',
    area: 'Kopar Khairane / Navi Mumbai',
    latitude: 19.1065,
    longitude: 73.0080,
    darshanStart: '06:00 AM',
    darshanEnd: '10:30 PM',
    crowdLevel: 'Moderate',
    facilities: ['Prasad Stalls', 'First Aid Center', 'Water Station'],
    popularity: 84,
    famousFeatures: ['Shivlalkar Tradition', 'Artistic Entrance Gate', 'Cultural Drama Stage'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-23',
    name: 'Varadvinayak Mandir (Kopar Khairane Sec 4)',
    description: 'Revered Ganesha temple shrine in Kopar Khairane Sector 4 attracting devotees year-round and during Ganeshotsav.',
    history: 'A sanctified temple complex in Sector 4 Kopar Khairane that becomes a major festival pilgrimage destination.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg'
    ],
    address: 'Sector 4, Kopar Khairane, Navi Mumbai 400709',
    area: 'Kopar Khairane / Navi Mumbai',
    latitude: 19.0982,
    longitude: 73.0035,
    darshanStart: '05:30 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'Moderate',
    facilities: ['Kopar Khairane Station Access', 'Temple Hall', 'VIP Queue', 'Prasad Counters'],
    popularity: 87,
    famousFeatures: ['Permanent Varadvinayak Shrine', 'Vedic Abhishek Rituals', 'Peaceful Atmosphere'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-24',
    name: 'Shree Ichhaaporti Ganesh Mandir (Sec 10)',
    description: 'The "Wish-Fulfilling" Ganesha mandir and pandal in Kopar Khairane Sector 10.',
    history: 'Deeply revered by locals as Ichhaaporti (wish fulfiller), hosting serene morning aartis and modak offerings.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg'
    ],
    address: 'Sector 10, Kopar Khairane, Navi Mumbai 400709',
    area: 'Kopar Khairane / Navi Mumbai',
    latitude: 19.1025,
    longitude: 73.0098,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'Moderate',
    facilities: ['Prasad Hall', 'Senior Seating', 'Drinking Water'],
    popularity: 86,
    famousFeatures: ['Wish-Fulfilling Idol', 'Special Modak Mahaprasad', 'Devotional Chanting'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-25',
    name: 'Shree Ganesh Mitra Mandal (Ghansoli Sec 5)',
    description: 'Vibrant Ghansoli Sector 5 mandal with artistic lighting and community cultural programs.',
    history: 'One of Ghansoli’s foundational mandals located in Sector 5, famous for creative pandal decorations.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg'
    ],
    address: 'Sector 5, Ghansoli, Navi Mumbai 400701',
    area: 'Ghansoli / Navi Mumbai',
    latitude: 19.1220,
    longitude: 73.0015,
    darshanStart: '06:00 AM',
    darshanEnd: '10:30 PM',
    crowdLevel: 'Moderate',
    facilities: ['Ghansoli Station Access', 'Prasad Counter', 'First Aid'],
    popularity: 85,
    famousFeatures: ['Ghansoli Sector 5 Landmark', 'Creative Lighting', 'Cultural Night Shows'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-26',
    name: 'Shree Ganesh Mitra Mandal (Ghansoli Sec 9)',
    description: 'Popular Ghansoli Sector 9 mandal drawing heavy evening crowds for authentic dhol tasha and aarti.',
    history: 'Established by Ghansoli Sector 9 residents to bring together the industrial and residential community.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg'
    ],
    address: 'Sector 9, Ghansoli, Navi Mumbai 400701',
    area: 'Ghansoli / Navi Mumbai',
    latitude: 19.1285,
    longitude: 72.9985,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'Moderate',
    facilities: ['Prasad Distribution', 'Medical Desk', 'Parking Space'],
    popularity: 84,
    famousFeatures: ['Authentic Marathi Aarti', 'Eco-Clay Idol Art', 'Youth Volunteers'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-27',
    name: 'Shree Ganesh Mitra Mandal Kopara (Kharghar)',
    description: 'Historic Kopara village Ganeshotsav mandal in Kharghar Sector 10 combining traditional heritage with modern scale.',
    history: 'Rooted in Kopara village Kharghar, celebrating over 40 years of community Ganeshotsav oneness.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg'
    ],
    address: 'Kopara Village, Sector 10, Kharghar, Navi Mumbai 410210',
    area: 'Kharghar / Navi Mumbai',
    latitude: 19.0380,
    longitude: 73.0675,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'High',
    facilities: ['Kharghar Station Connection', 'Prasad Hall', 'Security Desk'],
    popularity: 88,
    famousFeatures: ['Kopara Village Pride', 'Grand Traditional Pandal', 'Massive Visarjan Procession'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-28',
    name: 'Kharghar Realtors Ganpati Pandal (Sec 15)',
    description: 'Modern, well-organized community pandal in Kharghar Sector 15 with impressive architecture.',
    history: 'Initiated in Sector 15 Kharghar by local realtors and residents, recognized for clean eco-friendly arrangements.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg'
    ],
    address: 'Sector 15, Kharghar, Near Central Park Road, Navi Mumbai 410210',
    area: 'Kharghar / Navi Mumbai',
    latitude: 19.0465,
    longitude: 73.0612,
    darshanStart: '06:30 AM',
    darshanEnd: '10:30 PM',
    crowdLevel: 'Moderate',
    facilities: ['Ample Parking', 'Prasad Counter', 'First Aid', 'Senior Seating'],
    popularity: 85,
    famousFeatures: ['Modern Mandap Architecture', 'Blood Donation Camp', 'Kharghar Sec 15 Hub'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-29',
    name: 'Sanpadyacha Maharaja (Sanpada Sec 10)',
    description: 'The majestic "Sanpadyacha Maharaja" of Sanpada Sector 10 featuring a royal throne Ganesha idol.',
    history: 'Sanpada’s most revered Sarvajanik Ganeshotsav mandal, attracting thousands across Sanpada and Vashi.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg'
    ],
    address: 'Sector 10, Sanpada, Near Sanpada Railway Station, Navi Mumbai 400705',
    area: 'Sanpada / Navi Mumbai',
    latitude: 19.0628,
    longitude: 73.0042,
    darshanStart: '06:00 AM',
    darshanEnd: '11:30 PM',
    crowdLevel: 'High',
    facilities: ['Sanpada Station Walking Distance', 'Bhandara Hall', 'Prasad Stalls', 'CCTV Security'],
    popularity: 90,
    famousFeatures: ['Sanpadyacha Maharaja Title', 'Royal Court Mandap', 'Daily Bhandara Prasad'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-30',
    name: 'Panvel Cha Raja Chintamani (New Panvel Sec 4)',
    description: 'The legendary "Panvel Cha Raja Chintamani" in New Panvel Sector 4 — gateway to Konkan Ganeshotsav.',
    history: 'Established in New Panvel Sector 4, drawing massive footfalls from across Raigad district and Navi Mumbai.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg'
    ],
    address: 'Plot No. 42, behind Siciliano Cafe, Sector 4, New Panvel East, Panvel, Navi Mumbai, Maharashtra 410206',
    area: 'Panvel / Navi Mumbai',
    latitude: 18.98932,
    longitude: 73.12229,
    darshanStart: '05:30 AM',
    darshanEnd: '11:30 PM',
    crowdLevel: 'High',
    facilities: ['Panvel Station Access', 'Large Queue Lines', 'Prasad Counters', 'Medical Camp'],
    popularity: 93,
    famousFeatures: ['Panvel Cha Raja Chintamani Title', 'Raigad Region Gateway', 'Magnificent Visual Backdrop'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-31',
    name: 'Juinagarcha Raja (Sector 23)',
    description: 'Jai Bhavani Mitra Mandal Ganeshotsav in Juinagar, a long-running community Ganpati celebration.',
    history: 'Established in 2002 by local residents of Juinagar to build community unity through Ganeshotsav.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Juinagarcha%20Raja%202019.jpg'
    ],
    address: 'Plot No. 139, Sector 23, Juinagar, Navi Mumbai, Maharashtra 400706',
    area: 'Juinagar / Navi Mumbai',
    latitude: 19.05166,
    longitude: 73.01414,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'Moderate',
    facilities: ['Juinagar Station Nearby', 'Prasad Counter', 'Community Seva'],
    popularity: 90,
    famousFeatures: ['Established 2002', 'Jai Bhavani Mitra Mandal', 'Aagman Sohla'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pandal-32',
    name: 'Kharghar Cha Raja (Sector 12)',
    description: 'A prominent Kharghar Ganpati celebration known for large thematic presentations and community participation.',
    history: 'A long-running Kharghar Ganeshotsav mandal associated with Sector 12 and CIDCO Ground celebrations.',
    images: [
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg'
    ],
    address: 'Gokhale High School Maidan, Sector 12, Kharghar, Navi Mumbai, Maharashtra 410210',
    area: 'Kharghar / Navi Mumbai',
    latitude: 19.04126,
    longitude: 73.06885,
    darshanStart: '06:00 AM',
    darshanEnd: '11:00 PM',
    crowdLevel: 'High',
    facilities: ['Kharghar Metro Nearby', 'Prasad Counter', 'Eco-Friendly Initiatives'],
    popularity: 92,
    famousFeatures: ['Thematic Pandal', 'Sector 12', 'Eco-Conscious Celebration'],
    createdAt: new Date().toISOString(),
  }
];

// Sample Initial Challenges
const initialChallenges: Challenge[] = [
  {
    id: 'community-photo-upload',
    title: 'Community Ganpati Photo',
    description: 'Share a Ganpati, pandal, decoration, aarti or festival moment with the community. Admins review every upload before it is approved.',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
    latitude: 19.0178,
    longitude: 72.8478,
    points: 0,
    difficulty: 'Easy',
    deadline: '2026-12-31',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'challenge-1',
    title: 'Selfie near Mumbai Cha Raja',
    description: 'Visit Ganesh Galli Mumbaicha Raja pandal and capture a respectful photo/selfie enjoying the magnificent temple replica.',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
    pandalId: 'pandal-5',
    pandalName: 'Mumbaicha Raja (Ganesh Galli)',
    latitude: 18.9901,
    longitude: 72.8370,
    points: 150,
    difficulty: 'Easy',
    deadline: '2026-09-30',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'challenge-2',
    title: 'Lalbaug Trio Pandal Trail',
    description: 'Visit 3 iconic Lalbaug pandals (Lalbaugcha Raja, Ganesh Galli, and Tejukaya) in a single visit and upload proof photo.',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lalbaugcha%20Raja%20Mumbai%20Ganesh%20Utsav%202024.jpg',
    pandalId: 'pandal-1',
    pandalName: 'Lalbaugcha Raja',
    latitude: 18.9912,
    longitude: 72.8385,
    points: 300,
    difficulty: 'Medium',
    deadline: '2026-09-30',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'challenge-3',
    title: 'Capture Traditional Eco-friendly Decoration',
    description: 'Photograph unique traditional marigold flowers, diyas or eco-friendly decorations at any Mumbai Ganpati Pandal.',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg',
    pandalId: 'pandal-7',
    pandalName: 'Keshavji Naik Chawl (Girgaon)',
    latitude: 18.9542,
    longitude: 72.8190,
    points: 100,
    difficulty: 'Easy',
    deadline: '2026-09-30',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'challenge-4',
    title: 'Golden Darshan at GSB Seva Mandal',
    description: 'Take part in early morning darshan or pooja at GSB Seva Mandal Kings Circle.',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
    pandalId: 'pandal-3',
    pandalName: 'GSB Seva Mandal (Kings Circle)',
    latitude: 19.0278,
    longitude: 72.8580,
    points: 200,
    difficulty: 'Medium',
    deadline: '2026-09-30',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'challenge-5',
    title: 'Mumbai Master Pandal Explorer',
    description: 'Visit 5 distinct pandals across South and Western Mumbai to earn the prestigious Bappa Master Badge!',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
    latitude: 18.9912,
    longitude: 72.8385,
    points: 500,
    difficulty: 'Hard',
    deadline: '2026-09-30',
    createdAt: new Date().toISOString(),
  }
];

// Initial Submissions
const initialSubmissions: Submission[] = [];

// Special zero-point challenge used for general devotee/community photo uploads.
// These uploads still go through the same admin moderation queue as challenge proofs.


// Initial Favorites
const initialFavorites: Favorite[] = [];

// Initial Planner
const initialPlanner: PlannerItem[] = [];

// In-Memory store arrays
export const store = {
  users: [...initialUsers],
  passwords: { ...passwordsMap },
  pandals: [...initialPandals, ...expandedDirectoryPandals],
  challenges: [...initialChallenges],
  submissions: [...initialSubmissions],
  favorites: [...initialFavorites],
  planner: [...initialPlanner],
  visitPlans: [] as VisitPlan[],
  connections: [] as Connection[],
  conversations: [] as ChatConversation[],
  messages: [] as ChatMessage[],
  notifications: [] as CommunityNotification[],
  sharedVisitPlans: [] as SharedVisitPlan[],
  reports: [] as UserReport[],
  blockedUsers: [] as { userId: string; blockedUserId: string; createdAt: string }[],
};

// Helper to auto-award badges based on points & challenges completed
export function checkUserBadges(user: User): string[] {
  const badgeSet = new Set(user.badges || []);
  
  if (user.completedChallenges >= 1) badgeSet.add('Bappa Devotee');
  if (user.completedChallenges >= 3) badgeSet.add('Pandal Explorer');
  if (user.completedChallenges >= 5) badgeSet.add('Mumbai Raja Master');
  if (user.points >= 500) badgeSet.add('Speed Darshan');
  if (user.points >= 1000) badgeSet.add('Festive Photographer');
  
  return Array.from(badgeSet);
}

export async function initDb() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB successfully!');
    } catch (err) {
      console.warn('MongoDB connection failed. Falling back to in-memory JSON store.', err);
    }
  } else {
    console.log('No MONGODB_URI provided. Running with in-memory JSON store.');
  }
}
