const { getCustomerByIdServ } = require("../Cutomer/CustService");
const { createOtiRepo, countOti } = require("../Oti/OtiRepo");
const { getUserByIdRepo } = require("../User/UserRepo");
const { Response } = require("../config/Response");
const { getartikelByIdServ, getSosmedByIdServ, getOtherByIdServ, getCpdByIdServ } = require("../rateCard/rateServ");
const {
  CreateOrderRepo,
  CreateMitraRepo,
  GetAllOrderRepo,
  GetMitraByIdRepo,
  getCountOrder,
} = require("./OrderRepo");

const getRateArtikel = async (Item, mediaTayang) => {
  const artikel = await getartikelByIdServ(Item);
  return mediaTayang === 'PRMN' ? artikel.prmn : artikel.mitra;
}

const getRateSosmed = async (id, mediaTayang) => {
 
  const sosmed = await getSosmedByIdServ(id)
  return mediaTayang === 'facebook' ? sosmed.facebook : mediaTayang === 'instagram' ? sosmed.instagram : sosmed.rate
}

const getRateOther = async (id) => {
  const other = await getOtherByIdServ(id)
  return other.rate
}

const getRateCpd = async (id) => {
  const other = await getCpdByIdServ(id)
  return other.rate
}



const getTotalRate = async (article, mediaTayang) => {
  if (Array.isArray(article)) {
    return await Promise.all(article.map(Item => getRateArtikel(Item, mediaTayang)));
  } else {
    return [await getRateArtikel(article, mediaTayang)];
  }
}
const getTotalRateSosmed = async (id, data) => {
  if (Array.isArray(id)) {
    return await Promise.all(id.map(Item => getRateSosmed(Item, data)));
  } else {
    return [await getRateSosmed(id, data)];
  }
}
const getTotalRateOther = async (id) => {
  if(Array.isArray(id)){
    return await Promise.all(id.map(Item => getRateOther(Item)))
  } else {
    return [await getRateOther(id)]
  }
}

const createRateArticle = (article) => {
  const idArtikel = Array.isArray(article) ? article : [article];
  return { create: idArtikel.map(idArtikel => ({ idArtikel })) };
}

const createRateSosmed = (sosmed) => {
  const idSosmed = Array.isArray(sosmed) ? sosmed : [sosmed];
  return { create: idSosmed.map(idSosmed => ({ idSosmed })) };
}

const createRateOther = (other) => {
  const idOther = Array.isArray(other) ? other : [other]
  return {create: idOther.map(idOther => ({idOther}))}
}

const createOrderMitra = (OrderMitra) => {
  const idMitra = Array.isArray(OrderMitra) ? OrderMitra : [OrderMitra];
  return { create: idMitra.map(idMitra => ({ idMitra })) };
}

const CreateOrderServ = async (dataOrder) => {
  console.log(dataOrder);
  const customer = await getCustomerByIdServ(dataOrder.idCust);
  const idUser = await getUserByIdRepo(dataOrder.idUser);
  let data = {
    id_cust: dataOrder.idCust,
    Sales_type: dataOrder.SalesType,
    camp_name: dataOrder.camp_name,
    order_no: dataOrder.order_no,
    order_date: dataOrder.order_date,
    period_start: dataOrder.period_start,
    period_end: dataOrder.period_end,
    pay_type: dataOrder.pay_type,
    id_user: idUser.id,
    media_tayang: dataOrder.mediaTayang,
    no_mo: "1/A01/291/OTI-CRW/XII/2023",
  };

  if (customer != "data notfound" || idUser) {
    let totalRate = [];

    if (dataOrder.typeRate === "article") {
      console.log('jalan artikel 1');
      totalRate = await getTotalRate(dataOrder.rateCard.article, dataOrder.mediaTayang);
      data.rate_article_cust = createRateArticle(dataOrder.rateCard.article);
    }

    if (dataOrder.typeRate === "sosmed") {
      console.log('jalan sosmed 1');
      totalRate = await getTotalRateSosmed(dataOrder.rateCard.sosmed, dataOrder.mediaTayang)
      data.rate_sosmed_cust = createRateSosmed(dataOrder.rateCard.sosmed);
      console.log();
    }

    if (dataOrder.typeRate === "other") {
      totalRate = await getTotalRateOther(dataOrder.rateCard.other)
      data.rate_other_cust = createRateOther(dataOrder.rateCard.other)
    }

    if (dataOrder.OrderMitra) {
      data.OrderMitra = createOrderMitra(dataOrder.OrderMitra);
    }

    if (dataOrder.pay_type === "cash") {
      const total = totalRate.reduce((a, b) => a + b, 0)
      const discountAmount = (dataOrder.payment.diskon / 100) * total;
      const finalPrice = total - discountAmount;

      data.payCash = {
        create: {
          total: total,
          tempo: dataOrder.payment.tempo,
          diskon: dataOrder.payment.diskon,
          finalPrice: finalPrice,
        },
      };
    }

    const order = await CreateOrderRepo(data);
    const dataOti = {
      idOrder: order.id,
      type: dataOrder.typeRate,
      data: dataOrder.typeRate === 'article' ? dataOrder.rateCard.article : dataOrder.rateCard.sosmed
    }
    await createOti(order.id, dataOti);

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
          return await GetMitraByIdRepo(MitItem.idMitra);
        })
      );

      return {
        idOrder: item.id,
        SalesType: item.SalesType,
        camp_name: item.camp_name,
        order_no: item.order_no,
        order_date: item.order_date,
        period_start: item.period_start,
        period_end: item.period_end,
        pay_type: item.pay_type,
        customer: {
          id: item.costumer.id,
          name: item.costumer.name,
        },
        mediaTayang: {
          ...(mitra.length ? { mitra: mitra } : {}),
        },
        payment: {
          ...(item.payCash.length ? { cash: item.payCash } : {}),
          ...(item.barter.length ? { barter: item.barter } : {}),
          ...(item.kredit.length ? { kredit: item.kredit } : {}),
          ...(item.semiBarter.length ? { semi_barter: item.semiBarter } : {}),
          ...(item.termin.length ? { termin: item.termin } : {}),
          ...(item.deposit.length ? { deposit: item.deposit } : {}),
        },
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
      let data = undefined
      if(dataProps.type === 'article'){
        const artikel = await getartikelByIdServ(Item);
        data = artikel
      }
      if(dataProps.type === 'sosmed'){
        const artikel = await getSosmedByIdServ(Item);
        data = artikel
      }
      const count = await countOti();

      const formattedCount = String(count + index + 1).padStart(3, "0");
      const dataRest = {
        idOrder: idOrder,
        product: dataProps.type,
        sub: data.name,
        oti: `${formattedCount}/MS03/291/OTI-CRW/${month}/${year}`,
      };
      await createOtiRepo(dataRest);
    })
  );
 
 
};

const GetorderByIdServ = async (id) => {
  const order = await GetOrderByIdRepo(id);

  const network = await Promise.all(
    order.OrderNetwork.map(async (NetItem) => {
      return await GetNetworkByIdRepo(NetItem.idNetwork);
    })
  );

  const mitra = await Promise.all(
    order.OrderMitra.map(async (MitItem) => {
      return await GetMitraByIdRepo(MitItem.idMitra);
    })
  );

  const sosmed = await Promise.all(
    order.OrderSosmed.map(async (SosItem) => {
      return await GetSosmedByIdRepo(SosItem.idSosmed);
    })
  );

  return {
    idOrder: order.id,
    SalesType: order.SalesType,
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
      ...(order.mtPikiranRakyat
        ? { pikiranRakyat: order.mtPikiranRakyat }
        : {}),
      ...(network.length ? { network: network } : {}),
      ...(sosmed.length ? { sosmed: sosmed } : {}),
      ...(mitra.length ? { mitra: mitra } : {}),
      ...(order.OrderArtikel.length ? { artikel: order.OrderArtikel } : {}),
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

module.exports = {
  CreateOrderServ,
  CreateMitraServ,
  GetallOrderServ,
  GetorderByIdServ,
  UploadMitra,
};
