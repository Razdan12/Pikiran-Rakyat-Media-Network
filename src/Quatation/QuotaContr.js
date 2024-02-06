const express = require("express");

const { AuthAll } = require("../config/Auth");
const { QuotaDataList, getMediaOrderData, getMediaOrderDataByUser, addCashBackIntensive } = require("./QuotaServ");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await QuotaDataList(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/mo/all", async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const response = await getMediaOrderData(pageNumber, pageSize);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});
router.get("/mo/by-user/:id", async (req, res) => {
  try {
    const {id} = req.params
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const response = await getMediaOrderDataByUser(id, pageNumber, pageSize);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.patch("/mo/update-cash-intensive/:id", async (req, res) => {
  try {
    const {id} = req.params
    const data = {
      cashBack : req.body.cashBack,
      intensive : req.body.intensive
    }
    
    const response = await addCashBackIntensive(id, data)
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})

module.exports = router;
