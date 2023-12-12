const express = require("express");
const { GetMediaTayangServ, CreateOrderServ } = require("./OrderService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await GetMediaTayangServ();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.post("/new", async (req, res) => {
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
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});
module.exports = router;
