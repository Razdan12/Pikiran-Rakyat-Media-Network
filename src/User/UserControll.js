const express = require("express");
const jwt = require("jsonwebtoken");
const { createUserServ, LoginUser, getAllUserServ, editUserServ, deleteUserServ, cekLogin, ResetPasswordUserServ } = require("./UserService");
const { AuthSDAdmin } = require("../config/Auth");
const dotenv = require("dotenv");

const router = express.Router();
dotenv.config();

const secretKey = process.env.SECRET_KEY_JWT;

router.get("/auth/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Missing authorization header" });
    return;
  }
  const token = authHeader.split(" ")[1];
  
  try {
    // Verifikasi token dan dapatkan data yang dikodekan
    const decodedToken = jwt.verify(token, secretKey);
    
    // Cek apakah token telah kedaluwarsa
    const current_time = Date.now().valueOf() / 1000;
    if (decodedToken.exp < current_time) {
      res.status(401).json({ error: "Token expired" });
      return;
    }
    
    res.json({ status: 200, data: 'registered' });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});


router.post("/register", async (req, res) => {
  const { name, email, password, repassword, role_id , jabatan, phone} = req.body;

  if (password !== repassword) {
    return res.status(400).json({ message: "Password tidak sama" });
  }

  try {
    const data = {
      name,
      email,
      password,
      role_id,
      jabatan,
      phone

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
router.patch("/reset-password-user/:id", AuthSDAdmin, async (req, res) => {
  const {id} = req.params
  const {password} = req.body

 
  try {
    const response = await ResetPasswordUserServ(id, password)
    return res.status(201).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})

router.delete("/delete-user/:id", AuthSDAdmin, async (req, res) => {
  const {id} = req.params
 
  try {
    const response = await deleteUserServ(id)
    return res.status(201).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})



module.exports = router;
