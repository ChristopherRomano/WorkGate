export const currentUser = {
  id: 'u001',
  name: 'Jamie Chen',
  initials: 'JC',
  email: 'j.chen@fdmgroup.com',
  phone: '+44 7700 900123',
  address: '14 Canary Wharf, London, E14',
  emergencyContact: 'Lin Chen',
  emergencyPhone: '+44 7700 900456',
  tag: 'Consultant - Deployed',
  tagCode: 'CONSULTANT_DEPLOYED',
  role: 'manager',
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
  { id: 'e001', name: 'Marcus Reyes',  initials: 'MR', role: 'Consultant', client: 'HSBC',     email: 'm.reyes@fdmgroup.com' },
  { id: 'e002', name: 'Aisha Patel',   initials: 'AP', role: 'Consultant', client: 'Barclays', email: 'a.patel@fdmgroup.com' },
  { id: 'e003', name: 'Lucy Wang',     initials: 'LW', role: 'Consultant', client: 'Deloitte', email: 'l.wang@fdmgroup.com' },
  { id: 'e004', name: 'Sam Kim',       initials: 'SK', role: 'Consultant', client: 'KPMG',     email: 's.kim@fdmgroup.com' },
  { id: 'e005', name: 'Tom O\'Brien',  initials: 'TO', role: 'Consultant', client: 'NatWest',  email: 't.obrien@fdmgroup.com' },
  { id: 'e006', name: 'Priya Sharma',  initials: 'PS', role: 'Consultant', client: 'Barclays', email: 'p.sharma@fdmgroup.com' },
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

export const timesheetData = {
  weekLabel: 'Week of 31 Mar – 6 Apr 2026',
  days: ['Mon 31', 'Tue 1', 'Wed 2', 'Thu 3', 'Fri 4', 'Sat 5', 'Sun 6'],
  rows: [
    { label: 'CLIENT-003', hours: [8, 8, 7.5, 8, 7, 0, 0] },
    { label: 'Internal', hours: [0, 0, 0.5, 0, 1, 0, 0] },
  ],
  status: 'draft',
};
