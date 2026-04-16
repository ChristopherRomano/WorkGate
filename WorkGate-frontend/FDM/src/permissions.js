/**
 * Permission map mirroring the Java class hierarchy:
 *
 *   User (abstract)
 *   ├── Employee                     → base employee permissions
 *   │   ├── Consultant extends Employee  → + timesheet
 *   │   ├── Manager    extends Employee  → + management tools
 *   │   ├── HrRep      extends Employee  → + HR management
 *   │   └── ItTechnician extends Employee → + IT management + unlock accounts
 *   └── Administrator extends User   → admin tools only (separate branch)
 *
 * Each role's set is the union of its own permissions and everything it inherits.
 */

const EMPLOYEE_BASE = [
  'dashboard',
  'profile',
  'settings',
  'tasks',
  'leave',
  'expenses',
  'it-support',
  'hr-support',
  'news',
];

export const ROLE_PERMISSIONS = {
  employee:   [
    ...EMPLOYEE_BASE,
  ],
  consultant: [
    ...EMPLOYEE_BASE,
  ],
  manager: [
    ...EMPLOYEE_BASE,
    'leave-approval',
    'expense-approval',
    'set-task',
    'posting',
  ],
  hr: [
    ...EMPLOYEE_BASE,
    'hr-management',
    'posting',
  ],
  ittech: [
    ...EMPLOYEE_BASE,
    'it-management',   // manage tickets
    'unlock-accounts', // included in IT management page
  ],
  admin: [
    'admin-dashboard',
    'manage-employees',
    'add-employee',
    'client-codes',
  ],
};

export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
