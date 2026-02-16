export const getRole = (user) => {
  if (!user || !user.role) return null;

  return user.role.replace("ROLE_", "");
};
