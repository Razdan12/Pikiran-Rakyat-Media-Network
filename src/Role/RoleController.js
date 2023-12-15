const express = require("express");
const { addRoleSer, getAllRoleSer } = require("./RoleServ");
const { AuthSDAdmin } = require("../config/Auth");
const router = express.Router();

router.post("/create", AuthSDAdmin, async (req, res) => {
  const { role } = req.body;
  try {
    const response = await addRoleSer(role);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/", AuthSDAdmin, async (req, res) => {
  try {
    const response = await getAllRoleSer();
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;
