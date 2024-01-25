const express = require("express");
const {
  addArticleServ,
  addRateSosmedServ,
  addOtherContentServ,
  addCPDServ,
  addCPMServ,
  getAllArticleServ,
  getRateSosmed,
  getRateOtherServ,
  getAllCpdServ,
  getAllCpmServ,
  editartikelServ,
  getartikelByIdServ,
  deleteArticleServ,
  editSosmedServ,
  getSosmedByIdServ,
  deleteSosmedServ,
  editOtherServ,
  getOtherByIdServ,
  deleteOtherContent,
} = require("./rateServ");
const router = express.Router();

router.post("/article/create", async (req, res) => {
  const { name, prmn, mitra, note, customPricePrmn, customPriceMitra } =
    req.body;
  const data = {
    name,
    prmn,
    mitra,
    note,
    customPricePrmn,
    customPriceMitra,
  };
  try {
    const response = await addArticleServ(data);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/article/all", async (req, res) => {
  try {
    const response = await getAllArticleServ();
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.patch("/article/edit-by-id/:id", async (req, res) => {
  const { id } = req.params;
  const { name, prmn, mitra, note, customPricePrmn, customPriceMitra } =
    req.body;
  const data = {
    name,
    prmn,
    mitra,
    note,
    customPricePrmn,
    customPriceMitra,
  };
  try {
    const response = await editartikelServ(id, data);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/article/by-id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await getartikelByIdServ(id);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.delete("/article/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await deleteArticleServ(id);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.post("/sosmed/create/meta", async (req, res) => {
  const { name, instagram, facebook, note } = req.body;
  const data = {
    name,
    instagram,
    facebook,
    note,
    customPrice: false,
    other: false,
  };
  try {
    const response = await addRateSosmedServ(data);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.post("/sosmed/create/other", async (req, res) => {
  const { name, type, rate, note, customPrice } = req.body;
  const data = {
    name,
    type,
    rate,
    note,
    customPrice,
    other: true,
  };
  try {
    const response = await addRateSosmedServ(data);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/sosmed/all", async (req, res) => {
  try {
    const response = await getRateSosmed();
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.patch("/sosmed/edit-by-id/:id", async (req, res) => {
  const { id } = req.params;
  const { name, instagram, facebook, rate, note } = req.body;
  const data = {
    name,
    instagram,
    facebook,
    rate,
    note,
  };
  try {
    const response = await editSosmedServ(id, data);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/sosmed/get-by-id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await getSosmedByIdServ(id);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.delete("/sosmed/delete-by-id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await deleteSosmedServ(id);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})

router.post("/other-content/create", async (req, res) => {
  const { name, rate, note, customPrice } = req.body;
  const data = {
    name,
    rate,
    note,
    customPrice,
  };
  try {
    const response = await addOtherContentServ(data);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/other-constent/all", async (req, res) => {
  try {
    const response = await getRateOtherServ();
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.patch("/other-content/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { name, rate, note, customPrice } = req.body;
  const data = {
    name,
    rate,
    note,
    customPrice
  };
  try {
    const response = await editOtherServ(id, data);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})

router.get("/other-content/get-by-id/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const response = await getOtherByIdServ(id);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})
router.delete("/other-content/delete-by-id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await deleteOtherContent(id);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
})
router.post("/cpd/create/display", async (req, res) => {
  const { name, type, size, home, detail, section } = req.body;
  const data = {
    name,
    type,
    size,
    home,
    detail,
    section,
    customPrice: false,
    is_other: false,
  };

  try {
    const response = await addCPDServ(data);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.post("/cpd/create/other", async (req, res) => {
  const { name, type, size, rate, customPrice } = req.body;
  const data = {
    name,
    type,
    size,
    rate,
    customPrice,
    is_other: true,
  };

  try {
    const response = await addCPDServ(data);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/cpd/all", async (req, res) => {
  try {
    const response = await getAllCpdServ();
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.post("/cpm/create", async (req, res) => {
  const { name, type, size, rate, customPrice } = req.body;
  const data = {
    name,
    type,
    size,
    rate,
    customPrice: false,
  };

  try {
    const response = await addCPMServ(data);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/cpm/all", async (req, res) => {
  try {
    const response = await getAllCpmServ();
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});
module.exports = router;
