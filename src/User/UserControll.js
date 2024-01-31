const express = require("express");
const { createUserServ, LoginUser, getAllUserServ, editUserServ } = require("./UserService");
const { AuthSDAdmin } = require("../config/Auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, repassword, role_id } = req.body;

  if (password !== repassword) {
    return res.status(400).json({ message: "Password tidak sama" });
  }

  try {
    const data = {
      name,
      email,
      password,
      role_id,
    };

    const response = await createUserServ(data);

    if (response.error) {
      return res.status(500).json({ message: response.message });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await LoginUser(email, password)
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/all", AuthSDAdmin, async (req, res) => {
  try {
    const response = await getAllUserServ()
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})

router.patch("/edit-by-id/:id", AuthSDAdmin, async (req, res) => {
  const {id} = req.params
  const {name, role} = req.body
  const data = {
    name,
    role
  }
  try {
    const response = await editUserServ(id, data)
    return res.status(201).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})
module.exports = router;
