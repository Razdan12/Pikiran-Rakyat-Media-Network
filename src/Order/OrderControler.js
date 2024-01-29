const express = require("express");
const { GetMediaTayangServ, CreateOrderServ,  CreateMitraServ,  GetallOrderServ, GetorderByIdServ, UploadMitra } = require("./OrderService");
const { AuthAll } = require("../config/Auth");
const multer = require("multer");
const readXlsxFile = require("read-excel-file/node");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/",  async (req, res) => {
  try {
    const response = await GetMediaTayangServ();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.post("/new",  async (req, res) => {
  const {
    idCust,
    idUser,
    SalesType,
    camp_name,
    order_no,
    order_date,
    period_start,
    period_end,
    pay_type,
    OrderMitra,
    typeRate,
    mediaTayang,
    rateCard,
    payment,
  } = req.body;

  const data = {
    idCust: idCust,
    idUser,
    SalesType: SalesType,
    camp_name: camp_name,
    order_no: order_no,
    order_date: order_date,
    period_start: period_start,
    period_end: period_end,
    pay_type: pay_type,
    OrderMitra: OrderMitra,
    typeRate,
    rateCard,
    payment,
    mediaTayang
  };

  try {
    const response = await CreateOrderServ(data);
    return res.status(response.status).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.post("/create/mitra", AuthAll, async (req, res) => {
  const {name, status} = req.body
  try {
    const response = await CreateMitraServ(name, status)
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})

router.post("/upload/mitra", upload.single("file"), async (req, res, next) => {
  try {
    const rows = await readXlsxFile(req.file.path);
    const MitraPromise = rows.slice(1).map((row) => {
      return {
        name: row[1],
        status: true
      };
    });

    const response = await UploadMitra(MitraPromise);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(new Error("Terjadi kesalahan pada server"));
  }
});

router.get("/data", AuthAll, async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const response = await GetallOrderServ(pageNumber, pageSize);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/data/:id", AuthAll, async (req, res) => {
  const {id} = req.params
  try {
    const response = await GetorderByIdServ(id)
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    
  }
})

module.exports = router;
