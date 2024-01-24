const { totalRole, addRole, getAllRole } = require("./RoleRepo");

const addRoleSer = async (role) => {
  const count = await totalRole();
  const data = {
    role: role,
    number_role: count + 1,
  };
  const response = await addRole(data);
  return response;
};

const getAllRoleSer = async () => {
    const role = await getAllRole()
    const roleRest = await Promise.all(
      role.map(async (item) => {
        return {
          value: item.id,
          label: item.role
        }
      })
    )
    return roleRest;
}

module.exports = { addRoleSer,getAllRoleSer };
