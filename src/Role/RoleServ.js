const { totalRole, addRole, getAllRole, isRoleExist, editRole } = require("./RoleRepo");

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

const getAllRoleDataSer = async () => {
  try{
    return await getAllRole()
  }catch(err){
    console.error(err)
  }
}

const editRoleDiscountLimitSer = async (id, data) => {
  try {
    await isRoleExist(id).then((exist) => {
      if (!exist) throw Error('Role didnt exist')
      if (data.discount > 100) throw Error('Discount cannot set higher than 100')
    })
    return await editRole(id, { disc_limit: data.discount })
  } catch (err) {
    console.error(err)
  }
}

module.exports = { addRoleSer, getAllRoleSer, editRoleDiscountLimitSer, getAllRoleDataSer };
