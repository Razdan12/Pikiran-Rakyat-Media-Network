const express = require("express");
const { AuthAll, AuthSDAdmin } = require("../config/Auth");
const { getNetwork, editNetwork, getMitra, getSosmed } = require("./mediaServ");
const { GetNetworkByIdRepo } = require("../Order/OrderRepo");
const router = express.Router();

router.get("/network/all", AuthAll, async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const response = await getNetwork(pageNumber, pageSize)
        return res.status(200).json(response);
      } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
      }
}),
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
router.get("/sosmed/all", AuthAll, async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const response = await getSosmed(pageNumber, pageSize)
        return res.status(200).json(response);
      } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
      }
}),


router.patch("/network/:id", AuthSDAdmin, async (req, res) => {
    try {
        const id = req.params.id
        const {name, status} = req.body
        const data = {
            id,
            name,
            status
        }
        const response = await editNetwork(data)
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
})

router.get("/network/by-id/:id", AuthAll, async (req, res) => {
    try {
        const id = req.params.id
        
        const response = await GetNetworkByIdRepo(id)
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
})


module.exports = router;
