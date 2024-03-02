const { getCustomerByIdServ } = require("../Cutomer/CustService");
const { createOtiRepo, countOti } = require("../Oti/OtiRepo");
const { getUserByIdRepo } = require("../User/UserRepo");
const { Response } = require("../config/Response");
const {
  getartikelByIdServ,
  getSosmedByIdServ,
  getOtherByIdServ,
  getCpdByIdServ,
  getCpmByIdServ,
} = require("../rateCard/rateServ");
const {
  CreateOrderRepo,
  CreateMitraRepo,
  GetAllOrderRepo,
  GetMitraByIdRepo,
  getCountOrder,
  GetOrderByIdRepo,
  editOrderRepo,
  GetAllOrderByUserRepo,
  getCountByUserOrder,
  getOrderByProdukRepo,
  CreateProdukRepo,
  EditMitraRepo,
} = require("./OrderRepo");

const CreateOrderServ = async (dataOrder) => {
  const customer = await getCustomerByIdServ(dataOrder.idCust);
  const idUser = await getUserByIdRepo(dataOrder.idUser);
  const totalDataOrder = await getCountOrder();
  let dataRest = {
    id_cust: dataOrder.idCust,
    id_user: idUser.id,
    Sales_type: dataOrder.SalesType,
    camp_name: dataOrder.camp_name,
    order_no: totalDataOrder,
    order_date: dataOrder.order_date,
    period_start: dataOrder.period_start,
    period_end: dataOrder.period_end,
    pay_type: dataOrder.pay_type,
    media_tayang: dataOrder.opsiMediatayang,
    request_by: dataOrder.request_by,
    sales_approve: false,
    manager_approve: false,
    pic_approve: false,
    no_mo: `MO - ${totalDataOrder + 1}`,
  };

  if (customer != "data notfound" && idUser) {
    const qtyOrder =
      (new Date(dataOrder.period_end) - new Date(dataOrder.period_start)) /
        (24 * 60 * 60 * 1000) +
      1;
    if (dataOrder.OrderMitra) {
      const mistra = createOrderMitra(dataOrder.OrderMitra);
      console.log(mistra);
      dataRest.OrderMitra = mistra;
    }

    if (dataOrder.pay_type === "cash") {
      const total = parseInt(dataOrder.payment.total);
      const qtyMitra = dataOrder.OrderMitra;

      const jumlah =
        dataOrder.opsiMediatayang === "PRMN"
          ? total * qtyOrder
          : total * qtyMitra.length * qtyOrder;

      const rateFinal = jumlah - (dataOrder.payment.diskon / 100) * jumlah;
      dataRest.payCash = {
        create: {
          total: total,
          tempo: dataOrder.payment.tempo,
          diskon: dataOrder.payment.diskon,
          finalPrice: rateFinal,
        },
      };
    }
    if (dataOrder.pay_type === "barter") {
      const total = parseInt(dataOrder.payment.total);
      const qtyMitra = dataOrder.OrderMitra;

      const jumlah =
        dataOrder.opsiMediatayang === "PRMN"
          ? total * qtyOrder
          : total * qtyMitra.length * qtyOrder;

      const rateFinal = jumlah - (dataOrder.payment.diskon / 100) * jumlah;
      dataRest.barter = {
        create: {
          nilai: parseInt(total),
          tempo: dataOrder.payment.tempo,
          diskon: dataOrder.payment.diskon,
          finalPrice: rateFinal,
          barang: dataOrder.payment.barang,
        },
      };
    }
    if (dataOrder.pay_type === "semi") {
      const total = parseInt(dataOrder.payment.total);
      const qtyMitra = dataOrder.OrderMitra;

      const jumlah =
        dataOrder.opsiMediatayang === "PRMN"
          ? total * qtyOrder
          : total * qtyMitra.length * qtyOrder;

      const rateFinal = jumlah - (dataOrder.payment.diskon / 100) * jumlah;

      dataRest.semiBarter = {
        create: {
          totalRate: total,
          nilaiCash: dataOrder.payment.cash ? dataOrder.payment.cash : 0,
          nilaiBarter: total - dataOrder.payment.cash,
          tempoBarter: dataOrder.payment.tempoBarter,
          tempoCash: dataOrder.payment.tempoCash,
          diskon: dataOrder.payment.diskon,
          finalPrice: rateFinal,
          itemBarang: dataOrder.payment.barang,
        },
      };
    }
    if (dataOrder.pay_type === "kredit") {
      const total = parseInt(dataOrder.payment.total);
      const qtyMitra = dataOrder.OrderMitra;

      const jumlah =
        dataOrder.opsiMediatayang === "PRMN"
          ? total * qtyOrder
          : total * qtyMitra.length * qtyOrder;

      const rateFinal = jumlah - (dataOrder.payment.diskon / 100) * jumlah;
      dataRest.kredit = {
        create: {
          nilaiKredit: parseInt(total),
          diskon: dataOrder.payment.diskon,
          finalPrice: rateFinal,
          tempo: dataOrder.payment.tempo,
        },
      };
    }
    if (dataOrder.pay_type === "termin") {
      const total = parseInt(dataOrder.payment.total);
      const qtyMitra = dataOrder.OrderMitra;

      const jumlah =
        dataOrder.opsiMediatayang === "PRMN"
          ? total * qtyOrder
          : total * qtyMitra.length * qtyOrder;

      const rateFinal = jumlah - (dataOrder.payment.diskon / 100) * jumlah;
      dataRest.termin = {
        create: {
          termin_1: parseInt(dataOrder.payment.termin1),
          tempo_1: dataOrder.payment.tempo1,
          termin_2: parseInt(dataOrder.payment.termin2),
          tempo_2: dataOrder.payment.tempo2,
          termin_3: parseInt(dataOrder.payment.termin3),
          tempo_3: dataOrder.payment.tempo3,
          diskon: dataOrder.payment.diskon,
          finalPrice: rateFinal,
        },
      };
    }

    console.log(dataRest);
    const order = await CreateOrderRepo(dataRest);

    const dataProduk = createOrderProduk(dataOrder.rateCard, order.id);

    const produk = await CreateProdukRepo(dataProduk);

    const dataOti = {
      idOrder: order.id,
      // type: dataOrder.mediaTayang.type,
      data: dataOrder.rateCard,
    };

    const oti = await createOti(order.id, dataOti);

    return Response(200, order, "sukses");
  } else {
    return Response(404, "", "customer tidak ditemukan ");
  }
};

const createOrderMitra = (OrderMitra) => {
  const idMitra = Array.isArray(OrderMitra) ? OrderMitra : [OrderMitra];

  return { create: idMitra.map((idMitra) => ({ idMitra })) };
};

const createOrderProduk = (data, orderId) => {
  const produk = Array.isArray(data) ? data : [data];
  const rest = {
    data: produk.map((item) => ({
      idOrder: orderId, // use the same orderId for all listProduk in the same Order
      produk: item.produk,
      kategori: item.kategori,
      rate: item.rate,
    })),
  };
  return rest;
};

const CreateMitraServ = async (name, status) => {
  return await CreateMitraRepo(name, status);
};

const EditMitraServ = async (id, data) => {
  const dataRest = {
    name: data.name,
    status: data.status
  }

  const update = await EditMitraRepo(id, dataRest)
  console.log(update);
  return update
}

const UploadMitra = async (data) => {
  const dataRest = await Promise.all(
    data.map((Item) => {
      return CreateMitraRepo(Item.name, Item.status);
    })
  );
  return dataRest;
};

const GetallOrderServ = async (pageNumber, pageSize) => {
  const order = await GetAllOrderRepo(pageNumber, pageSize);
  const totalDataOrder = await getCountOrder();

  const orderResponse = await Promise.all(
    order.map(async (item) => {
      const mitra = await Promise.all(
        item.OrderMitra.map(async (MitItem) => {
          const mitra = await GetMitraByIdRepo(MitItem.idMitra);
          const data = {
            id: mitra.id,
            nama: mitra.name,
          };
          return data;
        })
      );

      const produk = await Promise.all(
        item.listProduk.map(async (Item) => {
          const data = {
            nama: Item.produk,
          };
          return data;
        })
      );

      return {
        idOrder: item.id,
        SalesType: item.Sales_type,
        camp_name: item.camp_name,
        order_no: item.order_no,
        order_date: new Date(item.order_date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        period_start: new Date(item.period_start).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        period_end: new Date(item.period_end).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        pay_type: item.pay_type,
        customer: {
          id: item.costumer.id,
          name: item.costumer.name,
        },
        mediaType: item.media_tayang,
        mediaTayang: mitra,
        approve1: item.sales_approve,
        approve2: item.manager_approve,
        approve3: item.pic_approve,
        no_mo: item.no_mo,
        payment: {
          ...(item.payCash.length ? { cash: item.payCash } : {}),
          ...(item.barter.length ? { barter: item.barter } : {}),
          ...(item.kredit.length ? { kredit: item.kredit } : {}),
          ...(item.semiBarter.length ? { semi_barter: item.semiBarter } : {}),
          ...(item.termin.length ? { termin: item.termin } : {}),
          ...(item.deposit.length ? { deposit: item.deposit } : {}),
        },
        produk: produk,
      };
    })
  );

  const data = {
    totalPage: Math.ceil(totalDataOrder / pageSize),
    pageNumber: pageNumber,
    totalData: order.length,
    dataOrder: orderResponse,
  };

  return data;
};

const GetallOrderByProdukServ = async (produk, pageNumber, pageSize) => {
  let order = await getOrderByProdukRepo(produk, pageNumber, pageSize);
  order = order.filter(item => item.listProduk.some(Item => Item.kategori === produk));

  const totalDataOrder = await getCountOrder();

  const orderResponse = await Promise.all(
    order.map(async (item) => {
      const mitra = await Promise.all(
        item.OrderMitra.map(async (MitItem) => {
          const mitra = await GetMitraByIdRepo(MitItem.idMitra);
          const data = {
            id: mitra.id,
            nama: mitra.name,
          };
          return data;
        })
      );
      const produk = await Promise.all(
        item.listProduk.map(async (Item) => {
          const data = {
            nama: Item.produk,
          };
          return data;
        })
      );

      return {
        idOrder: item.id,
        SalesType: item.Sales_type,
        camp_name: item.camp_name,
        order_no: item.order_no,
        order_date: new Date(item.order_date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        period_start: new Date(item.period_start).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        period_end: new Date(item.period_end).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        pay_type: item.pay_type,
        customer: {
          id: item.costumer.id,
          name: item.costumer.name,
        },
        mediaType: item.media_tayang,
        mediaTayang: mitra,
        approve1: item.sales_approve,
        approve2: item.manager_approve,
        approve3: item.pic_approve,
        payment: {
          ...(item.payCash.length ? { cash: item.payCash } : {}),
          ...(item.barter.length ? { barter: item.barter } : {}),
          ...(item.kredit.length ? { kredit: item.kredit } : {}),
          ...(item.semiBarter.length ? { semi_barter: item.semiBarter } : {}),
          ...(item.termin.length ? { termin: item.termin } : {}),
          ...(item.deposit.length ? { deposit: item.deposit } : {}),
        },
        produk: produk,
      };
    })
  );

  const data = {
    totalPage: Math.ceil(totalDataOrder / pageSize),
    pageNumber: pageNumber,
    totalData: order.length,
    dataOrder: orderResponse,
  };

  return data;
};

const GetallOrderByUserServ = async (id, pageNumber, pageSize) => {
  const order = await GetAllOrderByUserRepo(id, pageNumber, pageSize);

  const totalDataOrder = await getCountByUserOrder(id);

  const orderResponse = await Promise.all(
    order.map(async (item) => {
      const mitra = await Promise.all(
        item.OrderMitra.map(async (MitItem) => {
          const mitra = await GetMitraByIdRepo(MitItem.idMitra);
          const data = {
            id: mitra.id,
            nama: mitra.name,
          };
          return data;
        })
      );
      const produk = await Promise.all(
        item.listProduk.map(async (Item) => {
          const data = {
            nama: Item.produk,
          };
          return data;
        })
      );

      return {
        idOrder: item.id,
        SalesType: item.Sales_type,
        camp_name: item.camp_name,
        order_no: item.order_no,
        approve1: item.sales_approve,
        approve2: item.manager_approve,
        approve3: item.pic_approve,
        order_date: new Date(item.order_date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        period_start: new Date(item.period_start).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        period_end: new Date(item.period_end).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        pay_type: item.pay_type,
        customer: {
          id: item.costumer.id,
          name: item.costumer.name,
        },
        mediaType: item.media_tayang,
        mediaTayang: mitra,
        payment: {
          ...(item.payCash.length ? { cash: item.payCash } : {}),
          ...(item.barter.length ? { barter: item.barter } : {}),
          ...(item.kredit.length ? { kredit: item.kredit } : {}),
          ...(item.semiBarter.length ? { semi_barter: item.semiBarter } : {}),
          ...(item.termin.length ? { termin: item.termin } : {}),
          ...(item.deposit.length ? { deposit: item.deposit } : {}),
        },
        produk: produk,
        no_mo: item.no_mo,
      };
    })
  );

  const data = {
    totalPage: Math.ceil(totalDataOrder / pageSize),
    pageNumber: pageNumber,
    totalData: order.length,
    dataOrder: orderResponse,
  };

  return data;
};

const createOti = async (idOrder, dataProps) => {
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const romawi = (num) => {
    return [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
    ][num - 1];
  };
  const month = romawi(dateNow.getMonth() + 1);

  await Promise.all(
    dataProps.data.map(async (Item, index) => {
      const count = await countOti();
      const formattedCount = String(count + index + 1).padStart(3, "0");
      const dataRest = {
        idOrder: idOrder,
        product: Item.kategori,
        sub: Item.produk,
        oti: `${formattedCount}/MS03/291/OTI-CRW/${month}/${year}`,
        tayang: false,
      };
      const oti = await createOtiRepo(dataRest);
    })
  );
};

const GetorderByIdServ = async (id) => {
  const order = await GetOrderByIdRepo(id);

  const mitra = await Promise.all(
    order.OrderMitra.map(async (MitItem) => {
      return await GetMitraByIdRepo(MitItem.idMitra);
    })
  );

  return {
    idOrder: order.id,
    SalesType: order.Sales_type,
    camp_name: order.camp_name,
    order_no: order.order_no,
    order_date: order.order_date,
    period_start: order.period_start,
    period_end: order.period_end,
    pay_type: order.pay_type,
    customer: {
      id: order.costumer.id,
      name: order.costumer.name,
    },
    mediaTayang: {
      ...(mitra.length ? { mitra: mitra } : {}),
    },

    payment: {
      ...(order.payCash.length ? { cash: order.payCash } : {}),
      ...(order.barter.length ? { barter: order.barter } : {}),
      ...(order.kredit.length ? { kredit: order.kredit } : {}),
      ...(order.semiBarter.length ? { semi_barter: order.semiBarter } : {}),
      ...(order.termin.length ? { termin: order.termin } : {}),
    },
  };
};

const editOrderServ = async (id, data) => {
  const order = GetOrderByIdRepo(id);

  const dataRes = {
    sales_approve: data.sales_approve,
    manager_approve: data.manager_approve,
    pic_approve: data.pic_approve,
  };

  return await editOrderRepo(id, dataRes);
};

module.exports = {
  CreateOrderServ,
  CreateMitraServ,
  GetallOrderServ,
  GetorderByIdServ,
  UploadMitra,
  editOrderServ,
  GetallOrderByUserServ,
  GetallOrderByProdukServ,
  EditMitraServ
};
