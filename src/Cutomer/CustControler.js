const express = require("express");
const upload = require("../config/Multer");
const router = express.Router();
const dotenv = require("dotenv");
const { createCustomerServ, getCustomerServ, getCustomerByIdServ } = require("./CustService");
const { AuthAll } = require("../config/Auth");
dotenv.config();

const base_url = process.env.BASE_URL;

router.post("/add", upload.array("files"), AuthAll, async (req, res) => {
  const dataFile = req.files;

  const {
    name,
    type,
    contact,
    phone,
    email,
    npwp,
    address,
    fincontact,
    fincontact_phone,
  } = req.body;

  const file = dataFile.map((item) => `${base_url}/img/${item.filename}`);

  const data = {
    name,
    type,
    contact,
    phone,
    email,
    npwp,
    address,
    fincontact,
    fincontact_phone,
    logo: file[0],
    akta: file[1],
    nib: file[2],
    img_npwp: file[3],
  };

  const response = await createCustomerServ(data);

  res.status(200).json(response);
});

router.get("/all", AuthAll, async (req, res) => {
  try {
    const response = await getCustomerServ();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/:id", AuthAll, async (req, res) => {
    const id = req.params.id
   
    try {
        const response = await getCustomerByIdServ(id)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
})

module.exports = router;
