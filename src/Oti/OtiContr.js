const express = require("express");
const { GetOtiServ, reportServ } = require("./OtiServ");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const response = await GetOtiServ(pageNumber, pageSize);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});


router.get("/report", async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const response = await reportServ(pageNumber, pageSize)
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})


module.exports = router;
