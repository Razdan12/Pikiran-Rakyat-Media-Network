const express = require("express");
const { AuthAll, AuthSDAdmin } = require("../config/Auth");
const { getMitra,  findMitraServ, getMitraServ } = require("./mediaServ");

const router = express.Router();


router.get("/mitra/all", AuthAll, async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const response = await getMitra(pageNumber, pageSize)
        return res.status(200).json(response);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
      }
}),

router.get("/mitra/find-by-name", async(req, res) => {
    try {
        const name = req.query.name
        const response = await findMitraServ(name)
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
})

router.get("/mitra/all/drop", async(req, res) => {
    try {
        const response = await getMitraServ()
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
})

module.exports = router;
