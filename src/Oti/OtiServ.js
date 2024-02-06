const { getCustomerByIdServ } = require("../Cutomer/CustService");
const { GetOrderByIdRepo, GetMitraByIdRepo } = require("../Order/OrderRepo");

const {
  getOtiRepo,
  countOti,
  getOtiRepoByUser,
  getOtiById,
  getOtiRepoByProduk,
  editOtiRepo,
} = require("./OtiRepo");

const GetOtiServ = async (pageNumber, pageSize) => {
  const otiRest = await getOtiRepo(pageNumber, pageSize);
  const oti = await Promise.all(
    otiRest.map(async (Item) => {
      const idCust = Item.order.id_cust;
      const customer = await getCustomerByIdServ(idCust);
      return {
        idOrder: Item.idOrder,
        client: customer.name,
        tgl_order: new Date(Item.order.order_date).toLocaleDateString("id-ID", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        period_start: new Date(Item.order.period_start).toLocaleDateString(
          "id-ID",
          { month: "long", year: "numeric" }
        ),
        period_end: new Date(Item.order.period_end).toLocaleDateString(
          "id-ID",
          { month: "long", year: "numeric" }
        ),
        noMo: Item.order.no_mo,
        product: Item.product,
        sub: Item.sub,
        oti: Item.oti,
        tayang: Item.tayang,
        file_bukti_tayang: Item.bukti_tayang
      };
    })
  );

  const totalOTI = await countOti();
  return {
    totalPage: Math.ceil(totalOTI / pageSize),
    pageNumber: pageNumber,
    totalData: otiRest.length,
    data: oti,
  };
};

const reportServ = async (pageNumber, pageSize) => {
  try {
    const otiRest = await getOtiRepo(pageNumber, pageSize);
    const report = await Promise.all(
      otiRest.map(async (Item) => {
        const idCust = Item.order.id_cust;
        const customer = await getCustomerByIdServ(idCust);
        const Order = await GetOrderByIdRepo(Item.idOrder);
        return {
          idOrder: Item.idOrder,
          client: customer.name,
          campaign: Order.camp_name,
          tgl_order: new Date(Order.order_date).toLocaleDateString("id-ID", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          noQuo: Order.order_no,
          mitra: Order.OrderMitra,
          media_tayang: Item.sub,
          noMo: Order.no_mo,
          period_start: new Date(Order.period_start).toLocaleDateString(
            "id-ID",
            {
              month: "long",
              year: "numeric",
            }
          ),
          period_end: new Date(Order.period_end).toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          }),
          oti: Item.oti,
          status: new Date(Order.period_end) > new Date() ? true : false,
        };
      })
    );
    return report;
  } catch (error) {
    console.log();
    throw error;
  }
};

const reportByUserServ = async (id, pageNumber, pageSize) => {
  try {
    const Report = await getOtiRepoByUser(id, pageNumber, pageSize);
    const report = await Promise.all(
      Report.map(async (Item) => {
        const idCust = Item.id_cust;
        const customer = await getCustomerByIdServ(idCust);
        const oti = await getOtiByIdServ(Item.oti);
        const mitra = await Promise.all(
          Item.OrderMitra.map(async (mitra) => {
            const mitraRes = await GetMitraByIdRepo(mitra.idMitra);
            return mitraRes.name;
          })
        );
        return {
          idOrder: Item.id,
          client: customer.name,
          campaign: Item.camp_name,
          tgl_order: new Date(Item.order_date).toLocaleDateString("id-ID", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          noQuo: Item.order_no,
          mitra: mitra.length == 0 ? ["PRMN"] : mitra,
          media_tayang: oti[0].sub,
          noMo: Item.no_mo,
          period_start: new Date(Item.period_start).toLocaleDateString(
            "id-ID",
            {
              month: "long",
              year: "numeric",
            }
          ),
          period_end: new Date(Item.period_end).toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          }),
          oti: oti[0].oti,
          status: new Date(Item.period_end) > new Date() ? true : false,
          product: oti[0].product,
          sub: oti[0].sub,
          tayang: oti[0].tayang,
          file_bukti_tayang : oti[0].bukti_tayang
        };
      })
    );
    return report;
  } catch (error) {
    console.log();
    throw error;
  }
};

const reportByUserProduk = async (produk, pageNumber, pageSize) => {
  try {
    const Report = await getOtiRepoByProduk(produk, pageNumber, pageSize);
    console.log(produk);
    const report = await Promise.all(
      Report.map(async (Item) => {
        const idCust = Item.id_cust;
        const customer = await getCustomerByIdServ(idCust);
        const oti = await getOtiByIdServ(Item.oti);
       
        const mitra = await Promise.all(
          Item.OrderMitra.map(async (mitra) => {
            const mitraRes = await GetMitraByIdRepo(mitra.idMitra);
            return mitraRes.name;
          })
        );
        return {
          idOrder: Item.id,

          client: customer.name,
          campaign: Item.camp_name,
          tgl_order: new Date(Item.order_date).toLocaleDateString("id-ID", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          noQuo: Item.order_no,
          mitra: mitra.length == 0 ? ["PRMN"] : mitra,
          media_tayang: oti[0].sub,
          noMo: Item.no_mo,
          period_start: new Date(Item.period_start).toLocaleDateString(
            "id-ID",
            {
              month: "long",
              year: "numeric",
            }
          ),
          period_end: new Date(Item.period_end).toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          }),
          oti: oti[0].oti,
          status: new Date(Item.period_end) > new Date() ? true : false,
          product: oti[0].product,
          sub: oti[0].sub,
          tayang: oti[0].tayang,
          idOti: oti[0].id,
          file_bukti_tayang : oti[0].bukti_tayang
        };
      })
    );
    return report;
  } catch (error) {
    console.log();
    throw error;
  }
};

const getOtiByIdServ = async (data) => {
  const Oti = await Promise.all(
    data.map(async (Item) => {
      const oti = await getOtiById(Item.id);
      return oti;
    })
  );
  return Oti;
};

const uploadButiTayangServ = async (data) => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 8).replace(/:/g, "-");

  // Tambahkan tanggal dan waktu ke nama file
  const filename = `${date}_${time}_${data.nama_file}`;
  const dataTayang = {
    tayang: true,
    bukti_tayang: filename
  };
  const tayang = await editOtiRepo(data.idOti, dataTayang);
  return tayang
 
};

module.exports = {
  GetOtiServ,
  reportServ,
  reportByUserServ,
  reportByUserProduk,
  uploadButiTayangServ,
};
