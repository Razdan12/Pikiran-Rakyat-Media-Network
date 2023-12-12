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
    return await getAllRole()
}

module.exports = { addRoleSer,getAllRoleSer };
