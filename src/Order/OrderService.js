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
} = require("./OrderRepo");

const getRateArtikel = async (Item, mediaTayang) => {
  const artikel = await getartikelByIdServ(Item);
  return mediaTayang === "PRMN" ? artikel.prmn : artikel.mitra;
};

const getRateSosmed = async (id, mediaTayang) => {
  const sosmed = await getSosmedByIdServ(id);
  const harga =
    mediaTayang.media === "Facebook"
      ? sosmed.facebook
      : mediaTayang.media === "Instagram"
      ? sosmed.instagram
      : sosmed.rate;

  return harga;
};

const getRateCpd = async (id, data) => {
  const other = await getCpdByIdServ(id);
  const totalCpd =
    data === "home"
      ? other.rate_home
      : data === "detail"
      ? other.rate_detail
      : other.rate_section;
  return totalCpd;
};

const getRateCpm = async (id) => {
  const cpm = await getCpmByIdServ(id);
  const totalCpm = cpm.rate;
  return totalCpm;
};

const getTotalRate = async (article, mediaTayang) => {
  if (Array.isArray(article)) {
    return await Promise.all(
      article.map((Item) => getRateArtikel(Item, mediaTayang))
    );
  } else {
    return [await getRateArtikel(article, mediaTayang)];
  }
};

const getTotalRateSosmed = async (id, data) => {
  if (Array.isArray(id)) {
    const rate = await Promise.all(id.map((Item) => getRateSosmed(Item, data)));
    return rate;
  } else {
    const rate = [await getRateSosmed(id, data)];
    return rate;
  }
};

const getTotalRateCpd = async (id, data) => {
  if (Array.isArray(id)) {
    return await Promise.all(id.map((item) => getRateCpd(item, data)));
  } else {
    return [await getRateCpd(id, data)];
  }
};

const getTotalRateCpm = async (id) => {
  if (Array.isArray(id)) {
    return await Promise.all(id.map((item) => getRateCpm(item)));
  } else {
    return [await getRateCpm(id)];
  }
};

const createRateArticle = (article) => {
  const idArtikel = Array.isArray(article) ? article : [article];
  console.log({ idArtikel });
  return { create: idArtikel.map((idArtikel) => ({ idArtikel })) };
};

const createRateSosmed = (sosmed) => {
  const idSosmed = Array.isArray(sosmed) ? sosmed : [sosmed];
  return { create: idSosmed.map((idSosmed) => ({ idSosmed })) };
};

const createRateCpd = (cpd) => {
  const idCpd = Array.isArray(cpd) ? cpd : [cpd];
  return { create: idCpd.map((idCpd) => ({ idCpd })) };
};

const createRateCpm = (cpm, impresi) => {
  const idCpm = Array.isArray(cpm) ? cpm : [cpm];
  return { create: idCpm.map((idCpm) => ({ idCpm, impresi })) };
};

const createRateOther = (other) => {
  const idOther = Array.isArray(other) ? other : [other];
  return { create: idOther.map((idOther) => ({ idOther })) };
};

const createOrderMitra = (OrderMitra) => {
  const idMitra = Array.isArray(OrderMitra) ? OrderMitra : [OrderMitra];
  return { create: idMitra.map((idMitra) => ({ idMitra })) };
};

const CreateOrderServ = async (dataOrder) => {
  const customer = await getCustomerByIdServ(dataOrder.idCust);
  const idUser = await getUserByIdRepo(dataOrder.idUser);
  const totalDataOrder = await getCountOrder();
  let dataRest = {
    id_cust: dataOrder.idCust,
    Sales_type: dataOrder.SalesType,
    camp_name: dataOrder.camp_name,
    order_no: totalDataOrder,
    order_date: dataOrder.order_date,
    period_start: dataOrder.period_start,
    period_end: dataOrder.period_end,
    pay_type: dataOrder.pay_type,
    id_user: idUser.id,
    media_tayang: dataOrder.opsiMediatayang,
    rate_type: dataOrder.mediaTayang.type,
    request_by: dataOrder.request_by,
    sales_approve: false,
    manager_approve: false,
    pic_approve: false,
    no_mo: `MO - ${totalDataOrder}`,
  };

  let otiData = null;

  if (customer != "data notfound" || idUser) {
    let totalRate = [];
    const qtyOrder =
      (new Date(dataOrder.period_end) - new Date(dataOrder.period_start)) /
        (24 * 60 * 60 * 1000) +
      1;

    switch (dataOrder.mediaTayang.type) {
      case "artikel":
        const total = await getTotalRate(
          dataOrder.rateCard.article,
          dataOrder.opsiMediatayang
        );
        totalRate = total;
        console.log({ total });
        dataRest.rate_article_cust = createRateArticle(
          dataOrder.rateCard.article
        );
        otiData = dataOrder.rateCard.article;
        break;

      case "sosmed":
        totalRate = await getTotalRateSosmed(
          dataOrder.rateCard.sosmed,
          dataOrder.mediaTayang
        );
        dataRest.rate_sosmed_cust = createRateSosmed(dataOrder.rateCard.sosmed);
        otiData = dataOrder.rateCard.sosmed;
        break;

      case "cpd":
        const rate = await getTotalRateCpd(
          dataOrder.rateCard.cpd,
          dataOrder.mediaTayang
        );
        totalRate = rate;
        dataRest.rate_cpd_cust = createRateCpd(dataOrder.rateCard.cpd);
        otiData = dataOrder.rateCard.cpd;
        break;

      case "cpm":
        const rateCpm = await getTotalRateCpm(dataOrder.rateCard.cpd);
        totalRate = rateCpm;
        const impresi = parseInt(dataOrder.mediaTayang.impresi);
        dataRest.rate_cpm_cust = createRateCpm(dataOrder.rateCard.cpm, impresi);
        otiData = dataOrder.rateCard.cpm;
        break;

      case "other_content":
        totalRate = [dataOrder.mediaTayang.total];
        dataRest.rate_other_cust = createRateOther(dataOrder.rateCard.other);
        otiData = dataOrder.rateCard.other;
        break;
    }

    if (dataOrder.OrderMitra) {
      dataRest.OrderMitra = createOrderMitra(dataOrder.OrderMitra);
    }

    if (dataOrder.pay_type === "cash") {
      const total = totalRate.reduce((a, b) => a + b, 0);
      const qtyMitra = dataOrder.OrderMitra;

      const jumlah =
        dataOrder.opsiMediatayang === "PRMN"
          ? total * qtyOrder
          : total * qtyMitra.length * qtyOrder;

      const impresi = parseInt(dataOrder.mediaTayang.impresi);
      const jumlahCpm = (total * qtyMitra.length * impresi) / 1000;
      const hasil = dataOrder.mediaTayang.type === "cpm" ? jumlahCpm : jumlah;
      const rateFinal = hasil - (dataOrder.payment.diskon / 100) * hasil;

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
      const total = totalRate.reduce((a, b) => a + b, 0);
      const qtyMitra = dataOrder.OrderMitra;

      const jumlah =
        dataOrder.opsiMediatayang === "PRMN"
          ? total * qtyOrder
          : total * qtyMitra.length * qtyOrder;
      const impresi = parseInt(dataOrder.mediaTayang.impresi);
      const jumlahCpm = (total * qtyMitra.length * impresi) / 1000;
      const hasil = dataOrder.mediaTayang.type === "cpm" ? jumlahCpm : jumlah;
      const rateFinal = hasil - (dataOrder.payment.diskon / 100) * hasil;
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
      const total = totalRate.reduce((a, b) => a + b, 0);
      const qtyMitra = dataOrder.OrderMitra;

      const jumlah =
        dataOrder.opsiMediatayang === "PRMN"
          ? total * qtyOrder
          : total * qtyMitra.length * qtyOrder;
      const impresi = parseInt(dataOrder.mediaTayang.impresi);
      const jumlahCpm = (total * qtyMitra.length * impresi) / 1000;
      const hasil = dataOrder.mediaTayang.type === "cpm" ? jumlahCpm : jumlah;
      const rateFinal = hasil - (dataOrder.payment.diskon / 100) * hasil;
      
      dataRest.semiBarter = {
        create: {
          totalRate: total,
          nilaiCash: dataOrder.payment.cash,
          nilaiBarter: total - dataOrder.payment.cash,
          tempoBarter: dataOrder.payment.tempoBarter,
          tempoCash: dataOrder.payment.tempoCash,
          diskon: dataOrder.payment.diskon,
          finalRate: rateFinal,
          itemBarang: dataOrder.payment.barang,
        },
      };
    }
    if (dataOrder.pay_type === "kredit") {
      const total = totalRate.reduce((a, b) => a + b, 0);
      const qtyMitra = dataOrder.OrderMitra;

      const jumlah =
        dataOrder.opsiMediatayang === "PRMN"
          ? total * qtyOrder
          : total * qtyMitra.length * qtyOrder;
      const impresi = parseInt(dataOrder.mediaTayang.impresi);
      const jumlahCpm = (total * qtyMitra.length * impresi) / 1000;
      const hasil = dataOrder.mediaTayang.type === "cpm" ? jumlahCpm : jumlah;
      const rateFinal = hasil - (dataOrder.payment.diskon / 100) * hasil;
      dataRest.kredit = {
        create: {
          nilaiKredit: parseInt(total),
          diskon: dataOrder.payment.diskon,
          finalRate: rateFinal,
          tempo: dataOrder.payment.tempo,
        },
      };
    }
    if (dataOrder.pay_type === "termin") {
      const total = totalRate.reduce((a, b) => a + b, 0);
      const qtyMitra = dataOrder.OrderMitra;

      const jumlah =
        dataOrder.opsiMediatayang === "PRMN"
          ? total * qtyOrder
          : total * qtyMitra.length * qtyOrder;
      const impresi = parseInt(dataOrder.mediaTayang.impresi);
      const jumlahCpm = (total * qtyMitra.length * impresi) / 1000;
      const hasil = dataOrder.mediaTayang.type === "cpm" ? jumlahCpm : jumlah;
      const rateFinal = hasil - (dataOrder.payment.diskon / 100) * hasil;
      dataRest.termin = {
        create: {
          termin_1: parseInt(dataOrder.payment.termin1),
          tempo_1: dataOrder.payment.tempo1,
          termin_2: parseInt(dataOrder.payment.termin2),
          tempo_2: dataOrder.payment.tempo2,
          termin_3: parseInt(dataOrder.payment.termin3),
          tempo_3: dataOrder.payment.tempo3,
          diskon: dataOrder.payment.diskon,
          finalRate: rateFinal,
        },
      };
    }

    const order = await CreateOrderRepo(dataRest);
    const dataOti = {
      idOrder: order.id,
      type: dataOrder.mediaTayang.type,
      data: otiData,
    };

    const oti = await createOti(order.id, dataOti);

    return Response(200, order, "sukses");
  } else {
    return Response(404, "", "customer tidak ditemukan ");
  }
};

const CreateMitraServ = async (name, status) => {
  return await CreateMitraRepo(name, status);
};

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

      let produk = [];
      if (item.rate_article_cust.length) {
        await Promise.all(
          item.rate_article_cust.map(async (item) => {
            const artikelData = await getartikelByIdServ(item.idArtikel);
            const dataRest = {
              name: artikelData.name,
            };
            produk.push(dataRest);
          })
        );
      }
      if (item.rate_sosmed_cust.length) {
        await Promise.all(
          item.rate_sosmed_cust.map(async (item) => {
            const Data = await getSosmedByIdServ(item.idSosmed);
            const dataRest = {
              name: Data.name,
            };
            produk.push(dataRest);
          })
        );
      }
      if (item.rate_other_cust.length) {
        await Promise.all(
          item.rate_other_cust.map(async (item) => {
            const Data = await getOtherByIdServ(item.idOther);
            const dataRest = {
              name: Data.name,
            };
            produk.push(dataRest);
          })
        );
      }
      if (item.rate_cpd_cust.length) {
        await Promise.all(
          item.rate_cpd_cust.map(async (item) => {
            const Data = await getCpdByIdServ(item.idCpd);
            const dataRest = {
              name: Data.name,
            };
            produk.push(dataRest);
          })
        );
      }
      if (item.rate_cpm_cust.length) {
        await Promise.all(
          item.rate_cpm_cust.map(async (item) => {
            const Data = await getCpmByIdServ(item.idCpm);
            const dataRest = {
              name: Data.name,
            };
            produk.push(dataRest);
          })
        );
      }

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
  const order = await getOrderByProdukRepo(produk, pageNumber, pageSize);
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

      let produk = [];
      if (item.rate_article_cust.length) {
        await Promise.all(
          item.rate_article_cust.map(async (item) => {
            const artikelData = await getartikelByIdServ(item.idArtikel);
            const dataRest = {
              name: artikelData.name,
            };
            produk.push(dataRest);
          })
        );
      }
      if (item.rate_sosmed_cust.length) {
        await Promise.all(
          item.rate_sosmed_cust.map(async (item) => {
            const Data = await getSosmedByIdServ(item.idSosmed);
            const dataRest = {
              name: Data.name,
            };
            produk.push(dataRest);
          })
        );
      }
      if (item.rate_other_cust.length) {
        await Promise.all(
          item.rate_other_cust.map(async (item) => {
            const Data = await getOtherByIdServ(item.idOther);
            const dataRest = {
              name: Data.name,
            };
            produk.push(dataRest);
          })
        );
      }
      if (item.rate_cpd_cust.length) {
        await Promise.all(
          item.rate_cpd_cust.map(async (item) => {
            const Data = await getCpdByIdServ(item.idCpd);
            const dataRest = {
              name: Data.name,
            };
            produk.push(dataRest);
          })
        );
      }
      if (item.rate_cpm_cust.length) {
        await Promise.all(
          item.rate_cpm_cust.map(async (item) => {
            const Data = await getCpmByIdServ(item.idCpm);
            const dataRest = {
              name: Data.name,
            };
            produk.push(dataRest);
          })
        );
      }

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

      let produk = [];
      if (item.rate_article_cust.length) {
        await Promise.all(
          item.rate_article_cust.map(async (item) => {
            const artikelData = await getartikelByIdServ(item.idArtikel);
            const dataRest = {
              name: artikelData.name,
            };
            produk.push(dataRest);
          })
        );
      }
      if (item.rate_sosmed_cust.length) {
        await Promise.all(
          item.rate_sosmed_cust.map(async (item) => {
            const Data = await getSosmedByIdServ(item.idSosmed);
            const dataRest = {
              name: Data.name,
            };
            produk.push(dataRest);
          })
        );
      }
      if (item.rate_other_cust.length) {
        await Promise.all(
          item.rate_other_cust.map(async (item) => {
            const Data = await getOtherByIdServ(item.idOther);
            const dataRest = {
              name: Data.name,
            };
            produk.push(dataRest);
          })
        );
      }
      if (item.rate_cpd_cust.length) {
        await Promise.all(
          item.rate_cpd_cust.map(async (item) => {
            const Data = await getCpdByIdServ(item.idCpd);
            const dataRest = {
              name: Data.name,
            };
            produk.push(dataRest);
          })
        );
      }
      if (item.rate_cpm_cust.length) {
        await Promise.all(
          item.rate_cpm_cust.map(async (item) => {
            const Data = await getCpmByIdServ(item.idCpm);
            const dataRest = {
              name: Data.name,
            };
            produk.push(dataRest);
          })
        );
      }

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
        no_mo: item.no_mo
       
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
      let data = undefined;
      if (dataProps.type === "artikel") {
        const artikel = await getartikelByIdServ(Item);
        data = artikel;
      }
      if (dataProps.type === "sosmed") {
        const artikel = await getSosmedByIdServ(Item);
        data = artikel;
      }
      if (dataProps.type === "cpd") {
        const cpd = await getCpdByIdServ(Item);
        data = cpd;
      }
      if (dataProps.type === "cpm") {
        const cpd = await getCpmByIdServ(Item);
        data = cpd;
      }
      if (dataProps.type === "other_content") {
        const other = await getOtherByIdServ(Item);
        data = other;
      }
      const count = await countOti();

      const formattedCount = String(count + index + 1).padStart(3, "0");
      const dataRest = {
        idOrder: idOrder,
        product: dataProps.type,
        sub: data.name,
        oti: `${formattedCount}/MS03/291/OTI-CRW/${month}/${year}`,
        tayang: false
      };
      await createOtiRepo(dataRest);
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
  const order = GetOrderByIdRepo(id)

  const dataRes = {
    sales_approve: data.sales_approve,
    manager_approve: data.manager_approve,
    pic_approve: data.pic_approve
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
  GetallOrderByProdukServ
};
