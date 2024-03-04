const express = require("express");
const { addRoleSer, getAllRoleSer, editRoleDiscountLimitSer, getAllRoleDataSer } = require("./RoleServ");
const { AuthSDAdmin } = require("../config/Auth");
const { getRoleByid } = require("./RoleRepo");
const router = express.Router();

router.post("/create", async (req, res) => {
  const { role } = req.body;
  try {
    const response = await addRoleSer(role);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/", async (req, res) => {
  try {
    const response = await getAllRoleSer();
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get('/all', async (req, res) => {
  try{
    const response = await getAllRoleDataSer()
    return res.status(200).json(response)
  }catch(err){
    return res.status(500).json({ message: "Terjadi kesalahan pada server" })
  }
})

router.get('/:id', async (req, res) => {
  try{
    const response = await getRoleByid(req.params.id)
    return res.status(200).json(response)
  }catch(err){
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' })
  }
})

router.put('/:id', async (req, res) => {
  try{
    const response = await editRoleDiscountLimitSer(req.params.id, req.body)
    return res.status(200).json(response)
  }catch(err){
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' })
  }
})

module.exports = router;
