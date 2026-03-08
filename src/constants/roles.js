// User role constants
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
  PARENT: 'parent'
};

// Role display names
export const ROLE_NAMES = {
  [USER_ROLES.STUDENT]: 'Student',
  [USER_ROLES.TEACHER]: 'Teacher',
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.PARENT]: 'Parent'
};

// Default redirect paths for each role
export const ROLE_ROUTES = {
  [USER_ROLES.STUDENT]: '/student/dashboard',
  [USER_ROLES.TEACHER]: '/teacher/dashboard',
  [USER_ROLES.ADMIN]: '/admin/dashboard',
  [USER_ROLES.PARENT]: '/parent/dashboard'
};
