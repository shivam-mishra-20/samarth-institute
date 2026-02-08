// User role constants
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
};

// Role display names
export const ROLE_NAMES = {
  [USER_ROLES.STUDENT]: 'Student',
  [USER_ROLES.TEACHER]: 'Teacher',
  [USER_ROLES.ADMIN]: 'Admin'
};

// Default redirect paths for each role
export const ROLE_ROUTES = {
  [USER_ROLES.STUDENT]: '/student/dashboard',
  [USER_ROLES.TEACHER]: '/teacher/dashboard',
  [USER_ROLES.ADMIN]: '/admin/dashboard'
};
