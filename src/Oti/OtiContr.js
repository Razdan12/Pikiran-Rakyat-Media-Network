const express = require("express");
const { GetOtiServ, reportServ, reportByUserServ, reportByUserProduk, uploadButiTayangServ } = require("./OtiServ");
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // Dapatkan tanggal dan waktu saat ini
    const now = new Date();
    const date = now.toISOString().slice(0,10);
    const time = now.toTimeString().slice(0,8).replace(/:/g, '-');

    // Tambahkan tanggal dan waktu ke nama file
    const filename = `${date}_${time}_${file.originalname}`;

    cb(null, filename);
  }
})

const upload = multer({ storage: storage })

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const date = {
      from: req.query.from,
      to: req.query.to
    }
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const response = await GetOtiServ(pageNumber, pageSize, date);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/report", async (req, res) => {
  try {
    const date = {
      from: req.query.from,
      to: req.query.to
    }
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const response = await reportServ(pageNumber, pageSize, date)
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})

router.get("/report-user/:id", async (req, res) => {
  try {
    const id = req.params.id
    const date = {
      from: req.query.from,
      to: req.query.to
    }

    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const response = await reportByUserServ(id, pageNumber, pageSize, date)
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})

router.get("/report-produk/:produk", async (req, res) => {
  try {
    const produk = req.params.produk
    const date = {
      from: req.query.from,
      to: req.query.to
    }
   
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const response = await reportByUserProduk(produk, pageNumber, pageSize, date)
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})

router.post("/bukti-tayang/upload", upload.single('bukti_tayang'), async (req, res) => {
  const data = {
    idOti: req.body.idOti,
    nama_file : req.file.originalname 
  }
 
  try {
    const response = await uploadButiTayangServ(data)
    
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})


module.exports = router;
