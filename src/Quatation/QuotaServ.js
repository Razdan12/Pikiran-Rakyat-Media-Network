const { GetOrderByIdRepo } = require("../Order/OrderRepo");
const {
  GetallOrderServ,
  GetallOrderByUserServ,
} = require("../Order/OrderService");
const {
  getartikelByIdServ,
  getSosmedByIdServ,
  getOtherByIdServ,
  getCpdByIdServ,
  getCpmByIdServ,
} = require("../rateCard/rateServ");
const {
  QuotationCustData,
  editPayCashRepo,
  editPayBarterRepo,
  editPaySemiRepo,
  editPayKreditRepo,
  editPayTerminRepo,
} = require("./Quotrepo");

const QuotaDataList = async (id) => {
  const quota = await QuotationCustData(id);

  let dataRest = {
    camp_name: quota.camp_name,
    camp_type: quota.Sales_type,
    period_start: new Date(quota.period_start).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    period_end: new Date(quota.period_end).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    cust_type: quota.costumer.type,
    cust_name: quota.costumer.name,
    pic_name: quota.costumer.fincontact,
    pic_contact: quota.costumer.fincontact_phone,
    approve1: quota.sales_approve,
    approve2: quota.manager_approve,
    approve3: quota.pic_approve,
    request_by: quota.request_by,
    qty: quota.media_tayang === "PRMN" ? 1 : quota.OrderMitra.length,
    day:
      (new Date(quota.period_end) - new Date(quota.period_start)) /
        (24 * 60 * 60 * 1000) +
      1,
    remaks: "PRMN",
    payment: {
      ...(quota.payCash.length ? { data: quota.payCash[0] } : {}),
      ...(quota.barter.length ? { data: quota.barter[0] } : {}),
      ...(quota.kredit.length ? { data: quota.kredit[0] } : {}),
      ...(quota.semiBarter.length ? { data: quota.semiBarter[0] } : {}),
      ...(quota.termin.length ? { data: quota.termin[0] } : {}),
      ...(quota.deposit.length ? { data: quota.deposit[0] } : {}),
    },
    data: quota.listProduk
  };
  
  // const ResponseRest = await Promise.all(
  //   quota.listProduk.map(async (item) => {
  //     console.log(item);
  //     dataRest.data = {
  //       request_by: quota.request_by,
  //       spot_promo: item.kategori,
  //       promo_type: item.produk,
  //     };
  //   })
  // );

  return dataRest;
};

const getMediaOrderData = async (pageNumber, pageSize) => {
  const order = await GetallOrderServ(pageNumber, pageSize);

  const orderResponse = await Promise.all(
    order.dataOrder.map(async (item) => {
      let cashBack = 0;
      let intensive = 0;

      const paymentTypes = [
        "cash",
        "barter",
        "semi_barter",
        "kredit",
        "termin",
      ];

      for (const type of paymentTypes) {
        if (item.payment?.[type]?.length) {
          item.payment[type].map((pay) => {
            cashBack = pay.cash_back;
            intensive = pay.intensive;
          });
        }
      }

      return {
        idOrder: item.idOrder,
        client_name: item.customer.name,
        tgl_order: item.order_date,
        no_quo: item.order_no,
        period_start: item.period_start,
        period_end: item.period_end,
        media_order: item.no_mo,
        cashBack: cashBack,
        intensive: intensive,
      };
    })
  );

  return {
    pageNumber: order.pageNumber,
    totalPage: order.totalPage,
    totalData: order.totalData,
    data: orderResponse,
  };
};

const getMediaOrderDataByUser = async (id, pageNumber, pageSize) => {
  const order = await GetallOrderByUserServ(id, pageNumber, pageSize);
  const orderResponse = await Promise.all(
    order.dataOrder.map(async (item) => {
      return {
        idOrder: item.idOrder,
        client_name: item.customer.name,
        tgl_order: item.order_date,
        no_quo: item.order_no,
        period_start: item.period_start,
        period_end: item.period_end,
        media_order: item.no_mo,
      };
    })
  );

  return {
    pageNumber: order.pageNumber,
    totalPage: order.totalPage,
    totalData: order.totalData,
    data: orderResponse,
  };
};

const addCashBackIntensive = async (id, data) => {
  const order = await GetOrderByIdRepo(id);
  let dataRes = {};

  if (data.cashBack) {
    dataRes = {
      cash_back: parseInt(data.cashBack),
    };
  } else if (data.intensive) {
    dataRes = {
      intensive: parseInt(data.intensive),
    };
  }

  if (order.pay_type === "cash") {
    return await editPayCashRepo(id, dataRes);
  }
  if (order.pay_type === "barter") {
    return await editPayBarterRepo(id, dataRes);
  }
  if (order.pay_type === "semi") {
    return await editPaySemiRepo(id, dataRes);
  }
  if (order.pay_type === "kredit") {
    return await editPayKreditRepo(id, dataRes);
  }
  if (order.pay_type === "termin") {
    return await editPayTerminRepo(id, dataRes);
  }
};

const getModata = async (id) => {
  const order = await QuotationCustData(id);

  const produk = await Promise.all(
    order.listProduk.map(async (Item) => {
      const data = {
        nama: Item.produk,
      };
      return data;
    })
  );

  const dataRest = {
    no_mo: order.no_mo,
    customer: order.costumer,
    jenis_penjualan: order.Sales_type,
    user: order.user,
    produk: order.listProduk,
    detail_produk: produk,
    media_tayang: order.media_tayang,
    camp_name: order.camp_name,
    camp_type: order.Sales_type,
    period_start: new Date(order.period_start).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    period_end: new Date(order.period_end).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    type_bayar: order.pay_type,
    request_by: order.request_by,
    spot_promo: order.rate_type,
    qty: order.media_tayang === "PRMN" ? 1 : order.OrderMitra.length,
    day:
      (new Date(order.period_end) - new Date(order.period_start)) /
        (24 * 60 * 60 * 1000) +
      1,
    remaks: "PRMN",
    payment: {
      ...(order.payCash.length ? { data: order.payCash[0] } : {}),
      ...(order.barter.length ? { data: order.barter[0] } : {}),
      ...(order.kredit.length ? { data: order.kredit[0] } : {}),
      ...(order.semiBarter.length ? { data: order.semiBarter[0] } : {}),
      ...(order.termin.length ? { data: order.termin[0] } : {}),
      ...(order.deposit.length ? { data: order.deposit[0] } : {}),
    },
    data: order.listProduk
  };

  return dataRest;
};
module.exports = {
  QuotaDataList,
  getMediaOrderData,
  getMediaOrderDataByUser,
  addCashBackIntensive,
  getModata,
};
