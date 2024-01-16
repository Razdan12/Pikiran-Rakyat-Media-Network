const express = require("express");
const { GetMediaTayangServ, CreateOrderServ, CreateNetworkServ, CreateMitraServ, CreateSosmedServ, GetallOrderServ, GetorderByIdServ, UploadMitra } = require("./OrderService");
const { AuthAll } = require("../config/Auth");
const multer = require("multer");
const readXlsxFile = require("read-excel-file/node");
const { CreateMitraRepo } = require("./OrderRepo");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", AuthAll, async (req, res) => {
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
    SalesType,
    camp_name,
    order_no,
    order_date,
    mtPikiranRakyat,
    period_start,
    period_end,
    pay_type,
    OrderNetwork,
    OrderMitra,
    OrderArtikel,
    OrderSosmed,
    payment,
  } = req.body;

  const data = {
    idCust: idCust,
    SalesType: SalesType,
    camp_name: camp_name,
    order_no: order_no,
    order_date: order_date,
    mtPikiranRakyat: mtPikiranRakyat,
    period_start: period_start,
    period_end: period_end,
    pay_type: pay_type,
    OrderNetwork: OrderNetwork,
    OrderMitra: OrderMitra,
    OrderSosmed: OrderSosmed,
    OrderArtikel,
    payment,
  };

  try {
    const response = await CreateOrderServ(data);
    return res.status(response.status).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.post("/create/network", AuthAll, async (req, res) => {
  const {name, status} = req.body
  try {
    const response = await CreateNetworkServ(name, status)
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})

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
        nama: row[1]
      };
    });

    const response = await UploadMitra(MitraPromise);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(new Error("Terjadi kesalahan pada server"));
  }
});

router.post("/create/sosmed", AuthAll, async (req, res) => {
  const {name, status} = req.body
  try {
    const response = await CreateSosmedServ(name, status)
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})

router.get("/data", AuthAll, async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const response = await GetallOrderServ(pageNumber, pageSize);
    return res.status(200).json(response);
  } catch (error) {
    
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
