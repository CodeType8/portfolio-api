const hasBrandRole = (user, brandId, authorizedRoles) => {
  const hasBrandRole = user.brand_roles.some(role => role.brand_id === brandId && authorizedRoles.includes(role.role_id));
  const hasBranchRole = user.branch_roles.some(role => role.brand_id === brandId && authorizedRoles.includes(role.role_id));
  const result = hasBrandRole || hasBranchRole
  return result
}

const hasBranchRole = (user, brandId, branchId, authorizedRoles) => {
  const hasBrandRole = user.brand_roles.some(role => role.brand_id === brandId && authorizedRoles.includes(role.role_id));
  const hasBranchRole = user.branch_roles.some(role => role.branch_id === branchId && authorizedRoles.includes(role.role_id));
  const result = hasBrandRole || hasBranchRole
  return result
}

module.exports = {
  hasBrandRole,
  hasBranchRole
};
