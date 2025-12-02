export const checkRoleAdmin = (role: number) => {
  if (role === 1) {
    return true;
  } else {
    return false;
  }
};
