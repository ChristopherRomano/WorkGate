// ── ACCOUNTS (for login) ─────────────────────────────────────────────────────
export const users = [
  {
    id: 'u001', username: 'employee', password: 'pass',
    name: 'Alex Turner', initials: 'AT', email: 'a.turner@fdmgroup.com',
    role: 'employee', tag: 'BENCH',
    phone: '+44 7700 900111', address: '22 Baker Street, London, W1U',
    emergencyContact: 'Sam Turner', emergencyPhone: '+44 7700 900222',
    manager: 'Sarah O\'Brien', leaveBalance: 20, leaveTotal: 25,
    skills: [],
  },
  {
    id: 'u002', username: 'consultant', password: 'pass',
    name: 'Jamie Chen', initials: 'JC', email: 'j.chen@fdmgroup.com',
    role: 'consultant', tag: 'CONSULTANT_DEPLOYED',
    phone: '+44 7700 900123', address: '14 Canary Wharf, London, E14',
    emergencyContact: 'Lin Chen', emergencyPhone: '+44 7700 900456',
    manager: 'Sarah O\'Brien', leaveBalance: 15, leaveTotal: 25,
    clientCode: 'CLIENT-003', clientName: 'Barclays', projectEndDate: '2026-06-30',
    skills: ['Python', 'SQL', 'Excel', 'Java', 'Agile', 'Power BI'],
  },
  {
    id: 'u003', username: 'manager', password: 'pass',
    name: 'Sarah O\'Brien', initials: 'SO', email: 's.obrien@fdmgroup.com',
    role: 'manager', tag: 'MANAGER',
    phone: '+44 7700 900789', address: '5 Liverpool Street, London, EC2M',
    emergencyContact: 'Tom O\'Brien', emergencyPhone: '+44 7700 900321',
    manager: 'Diana Frost', leaveBalance: 18, leaveTotal: 25,
    teamCode: 'TEAM-A', skills: [],
  },
  {
    id: 'u004', username: 'ittech', password: 'pass',
    name: 'Dev Patel', initials: 'DP', email: 'd.patel@fdmgroup.com',
    role: 'ittech', tag: 'IT',
  },
  {
    id: 'u005', username: 'hr', password: 'pass',
    name: 'Maya Singh', initials: 'MS', email: 'm.singh@fdmgroup.com',
    role: 'hr', tag: 'HR',
  },
  {
    id: 'u006', username: 'admin', password: 'pass',
    name: 'Chris Morgan', initials: 'CM', email: 'c.morgan@fdmgroup.com',
    role: 'admin', tag: 'ADMIN',
  },
];

// Legacy — kept for any pages that haven't migrated to useAuth() yet
export const currentUser = {
  id: 'u001',
  name: 'Jamie Chen',
  initials: 'JC',
  email: 'j.chen@fdmgroup.com',
  phone: '+44 7700 900123',
  address: '14 Canary Wharf, London, E14',
  emergencyContact: 'Lin Chen',
  emergencyPhone: '+44 7700 900456',
  tag: 'Administrator',
  tagCode: 'ADMIN',
  role: 'admin',
  manager: 'Sarah O\'Brien',
  clientCode: 'CLIENT-003',
  clientName: 'Barclays',
  projectEndDate: '2026-06-30',
  leaveBalance: 15,
  leaveTotal: 25,
  skillScore: 12,
  skills: ['Python', 'SQL', 'Excel', 'Java', 'Agile', 'Power BI'],
};

export const employees = [
  { id: 'e001', name: 'Marcus Reyes',  initials: 'MR', role: 'Consultant', client: 'HSBC',     clientCode: 'CLIENT-001', email: 'm.reyes@fdmgroup.com',   manager: 'Sarah O\'Brien', tag: 'CONSULTANT_DEPLOYED', active: true },
  { id: 'e002', name: 'Aisha Patel',   initials: 'AP', role: 'Consultant', client: 'Barclays', clientCode: 'CLIENT-003', email: 'a.patel@fdmgroup.com',   manager: 'Sarah O\'Brien', tag: 'CONSULTANT_DEPLOYED', active: true },
  { id: 'e003', name: 'Lucy Wang',     initials: 'LW', role: 'Consultant', client: 'Deloitte', clientCode: 'CLIENT-004', email: 'l.wang@fdmgroup.com',    manager: 'James Park',     tag: 'CONSULTANT_DEPLOYED', active: true },
  { id: 'e004', name: 'Sam Kim',       initials: 'SK', role: 'Consultant', client: 'KPMG',     clientCode: 'CLIENT-005', email: 's.kim@fdmgroup.com',     manager: 'James Park',     tag: 'CONSULTANT_BENCH',    active: true },
  { id: 'e005', name: 'Tom O\'Brien',  initials: 'TO', role: 'Consultant', client: 'NatWest',  clientCode: 'CLIENT-002', email: 't.obrien@fdmgroup.com',  manager: 'Sarah O\'Brien', tag: 'CONSULTANT_DEPLOYED', active: false },
  { id: 'e006', name: 'Priya Sharma',  initials: 'PS', role: 'Consultant', client: 'Barclays', clientCode: 'CLIENT-003', email: 'p.sharma@fdmgroup.com',  manager: 'James Park',     tag: 'CONSULTANT_DEPLOYED', active: true },
];

export const managers = [
  'Sarah O\'Brien',
  'James Park',
  'Diana Frost',
  'Alex Morgan',
];

export const clientCodes = [
  { id: 'cc1', code: 'CLIENT-001', client: 'HSBC',          sector: 'Banking' },
  { id: 'cc2', code: 'CLIENT-002', client: 'NatWest',       sector: 'Banking' },
  { id: 'cc3', code: 'CLIENT-003', client: 'Barclays',      sector: 'Banking' },
  { id: 'cc4', code: 'CLIENT-004', client: 'Deloitte',      sector: 'Consulting' },
  { id: 'cc5', code: 'CLIENT-005', client: 'KPMG',          sector: 'Consulting' },
  { id: 'cc6', code: 'INTERNAL',   client: 'FDM Internal',  sector: 'Internal' },
];

export const employeeLeaveRequests = [
  { id: 'el1', employee: 'Marcus Reyes',  initials: 'MR', start: '20 Apr 2026', end: '24 Apr 2026', days: 5, type: 'Annual Leave',    reason: 'Family holiday to Spain.',                             status: 'pending' },
  { id: 'el2', employee: 'Aisha Patel',   initials: 'AP', start: '28 Apr 2026', end: '28 Apr 2026', days: 1, type: 'Annual Leave',    reason: 'Personal appointment.',                                status: 'pending' },
  { id: 'el3', employee: 'Lucy Wang',     initials: 'LW', start: '5 May 2026',  end: '9 May 2026',  days: 5, type: 'Annual Leave',    reason: 'Pre-booked holiday.',                                  status: 'pending' },
  { id: 'el4', employee: 'Sam Kim',       initials: 'SK', start: '1 Apr 2026',  end: '2 Apr 2026',  days: 2, type: 'Sick Leave',      reason: 'Unwell, doctor appointment on 1st.',                   status: 'approved', comment: '' },
  { id: 'el5', employee: 'Marcus Reyes',  initials: 'MR', start: '10 Mar 2026', end: '10 Mar 2026', days: 1, type: 'Annual Leave',    reason: 'Personal errand.',                                     status: 'rejected', comment: 'Client deliverable due that day — please rebook.' },
];

export const tasks = [
  { id: 't1', title: 'Complete Security Awareness Training', type: 'Onboarding', priority: 'high', due: '5 Apr 2026', done: false },
  { id: 't2', title: 'Sign Employment Contract', type: 'Onboarding', priority: 'high', due: 'Completed 15 Jan 2026', done: true },
  { id: 't3', title: 'Set up MFA on account', type: 'Onboarding', priority: 'high', due: 'Completed 16 Jan 2026', done: true },
  { id: 't4', title: 'Submit weekly timesheet by Friday', type: 'Operational', priority: 'high', due: '4 Apr 2026', done: false },
  { id: 't5', title: 'Update client project end date', type: 'Operational', priority: 'medium', due: '10 Apr 2026', done: false },
  { id: 't6', title: 'Java SE 17 Certification', type: 'Upskilling', priority: 'low', due: '30 Apr 2026', done: false },
  { id: 't7', title: 'Agile & Scrum Workshop', type: 'Upskilling', priority: 'low', due: '15 May 2026', done: false },
];

export const leaveRequests = [
  { id: 'lr1', start: '14 Apr 2026', end: '18 Apr 2026', days: 5, status: 'approved' },
  { id: 'lr2', start: '28 Apr 2026', end: '29 Apr 2026', days: 2, status: 'pending' },
  { id: 'lr3', start: '23 Jan 2026', end: '24 Jan 2026', days: 2, status: 'approved' },
  { id: 'lr4', start: '10 Feb 2026', end: '11 Feb 2026', days: 2, status: 'rejected' },
];

export const expenses = [
  { id: 'ex1', description: 'Train – London to Manchester', date: '28 Mar 2026', project: 'CLIENT-003', amount: '£124.50', status: 'approved' },
  { id: 'ex2', description: 'Hotel – Client Site Visit', date: '1 Apr 2026', project: 'CLIENT-003', amount: '£189.00', status: 'pending' },
  { id: 'ex3', description: 'Lunch – Client Meeting', date: '2 Apr 2026', project: 'CLIENT-003', amount: '£34.00', status: 'pending' },
  { id: 'ex4', description: 'Taxi – Airport Transfer', date: '15 Mar 2026', project: 'CLIENT-003', amount: '£47.20', status: 'approved' },
];

export const teamExpenses = [
  { id: 'te1', employee: 'Marcus Reyes',  initials: 'MR', description: 'Train – London to Birmingham',  date: '2026-04-07', project: 'CLIENT-001', amount: '£89.50',  status: 'pending' },
  { id: 'te2', employee: 'Aisha Patel',   initials: 'AP', description: 'Hotel – Client Overnight Stay', date: '2026-04-08', project: 'CLIENT-003', amount: '£210.00', status: 'pending' },
  { id: 'te3', employee: 'Tom O\'Brien',  initials: 'TO', description: 'Taxi – Airport Transfer',       date: '2026-04-02', project: 'CLIENT-002', amount: '£42.00',  status: 'approved' },
  { id: 'te4', employee: 'Marcus Reyes',  initials: 'MR', description: 'Lunch – Team Meeting',          date: '2026-04-10', project: 'CLIENT-001', amount: '£28.50',  status: 'pending' },
  { id: 'te5', employee: 'Aisha Patel',   initials: 'AP', description: 'Flight – Manchester Return',    date: '2026-03-25', project: 'CLIENT-003', amount: '£156.00', status: 'approved' },
  { id: 'te6', employee: 'Tom O\'Brien',  initials: 'TO', description: 'Train – Client Site Visit',     date: '2026-04-11', project: 'CLIENT-002', amount: '£67.30',  status: 'rejected' },
  { id: 'te7', employee: 'Marcus Reyes',  initials: 'MR', description: 'Hotel – Overnight Conference',  date: '2026-04-14', project: 'CLIENT-001', amount: '£195.00', status: 'pending' },
  { id: 'te8', employee: 'Aisha Patel',   initials: 'AP', description: 'Taxi – Late Night Client Site', date: '2026-04-14', project: 'CLIENT-003', amount: '£31.80',  status: 'pending' },
];

export const newsPosts = [
  { id: 'n1', title: 'Q2 Policy Update: Remote Working Guidelines', excerpt: 'Updated guidelines effective from 1 May 2026. All consultants on the bench must attend the office a minimum of 3 days per week. Deployed consultants should follow client site requirements.', author: 'HR Team', date: '1 Apr 2026', category: 'Global', pinned: true },
  { id: 'n2', title: 'April Social Event – London Office Rooftop', excerpt: 'Join us Friday 25th April for drinks, networking and a panoramic view of the city. RSVP by 18th April. All are welcome!', author: 'Events Team', date: '28 Mar 2026', category: 'Social', pinned: false },
  { id: 'n3', title: 'System Maintenance – Sunday 6 April, 02:00–04:00 UTC', excerpt: 'WorkGate will be unavailable for scheduled maintenance. Please ensure all timesheets are submitted before midnight Saturday.', author: 'IT Team', date: '26 Mar 2026', category: 'Global', pinned: false },
  { id: 'n4', title: 'FDM Group Q1 Financial Results – Record Revenue', excerpt: 'We are delighted to announce another record quarter. Revenue grew 18% YoY, driven by strong demand in financial services and technology sectors.', author: 'Corporate Comms', date: '20 Mar 2026', category: 'Global', pinned: false },
];

export const itTickets = [
  { id: 'IT-042', title: 'VPN not connecting from client site', desc: 'Cannot access internal FDM systems. VPN shows authentication error. Screenshot attached.', category: 'Software', date: '1 Apr 2026', status: 'progress' },
  { id: 'IT-031', title: 'Password reset request', desc: 'Locked out after 5 failed attempts. Need account unlock.', category: 'Access', date: '15 Mar 2026', status: 'resolved' },
];

export const leaderboard = [
  { rank: 1, initials: 'SK', name: 'Sam Kim', score: 24, pct: 100 },
  { rank: 2, initials: 'AP', name: 'Aisha Patel', score: 21, pct: 87 },
  { rank: 3, initials: 'MR', name: 'Marcus Reyes', score: 18, pct: 75 },
  { rank: 4, initials: 'JC', name: 'Jamie Chen (You)', score: 12, pct: 50, isMe: true },
  { rank: 5, initials: 'LW', name: 'Lucy Wang', score: 10, pct: 41 },
];

export const hrReports = [
  { id: 'hr1', employee: 'Alex Turner',  initials: 'AT', title: 'Workplace Feedback – Team Communication', content: 'General feedback about team communication processes on client site.', date: '20 Mar 2026', status: 'resolved', anon: true,  claimedBy: 'Maya Singh' },
  { id: 'hr2', employee: 'Aisha Patel',  initials: 'AP', title: 'Overtime Concern', content: 'Repeated requests to work beyond contracted hours without appropriate compensation or advance notice.', date: '2 Apr 2026', status: 'pending', anon: false, claimedBy: null },
  { id: 'hr3', employee: 'Anonymous',    initials: '?',  title: 'Manager Conduct', content: 'Concerns regarding unprofessional communication from line manager during team meetings.', date: '5 Apr 2026', status: 'pending', anon: true,  claimedBy: null },
  { id: 'hr4', employee: 'Marcus Reyes', initials: 'MR', title: 'Client Site Safety', content: 'Safety concern raised regarding inadequate fire safety procedures at client premises.', date: '7 Apr 2026', status: 'pending', anon: false, claimedBy: null },
];
