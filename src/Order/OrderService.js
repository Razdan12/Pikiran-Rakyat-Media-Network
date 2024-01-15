const { getCustomerByIdServ } = require("../Cutomer/CustService");
const { createOtiRepo, countOti } = require("../Oti/OtiRepo");
const { Response } = require("../config/Response");
const {
  GetMediaTayang,
  CreateOrderRepo,
  CreateNetworkRepo,
  CreateMitraRepo,
  CreateSosmedRepo,
  GetAllOrderRepo,
  GetNetworkByIdRepo,
  GetMitraByIdRepo,
  GetSosmedByIdRepo,
  GetOrderByIdRepo,
  getCountOrder,
} = require("./OrderRepo");

const GetMediaTayangServ = async () => {
  return await GetMediaTayang();
};

const CreateOrderServ = async (dataOrder) => {
  const customer = await getCustomerByIdServ(dataOrder.idCust);

  if (customer != "data notfound") {
    const data = {
      idCust: dataOrder.idCust,
      SalesType: dataOrder.SalesType,
      camp_name: dataOrder.camp_name,
      order_no: dataOrder.order_no,
      order_date: dataOrder.order_date,
      mtPikiranRakyat: dataOrder.mtPikiranRakyat,
      period_start: dataOrder.period_start,
      period_end: dataOrder.period_end,
      pay_type: dataOrder.pay_type,
      noMo: '1/A01/291/OTI-CRW/XII/2023',
    };

    if (dataOrder.OrderNetwork) {
      data.OrderNetwork = {
        create: Array.isArray(dataOrder.OrderNetwork)
          ? dataOrder.OrderNetwork.map((idNetwork) => ({
              idNetwork,
            }))
          : [{ idNetwork: dataOrder.OrderNetwork }],
      };
    }

    if (dataOrder.OrderMitra) {
      data.OrderMitra = {
        create: Array.isArray(dataOrder.OrderMitra)
          ? dataOrder.OrderMitra.map((idMitra) => ({
              idMitra,
            }))
          : [{ idMitra: dataOrder.OrderMitra }],
      };
    }

    if (dataOrder.OrderSosmed) {
      data.OrderSosmed = {
        create: Array.isArray(dataOrder.OrderSosmed)
          ? dataOrder.OrderSosmed.map((idSosmed) => ({
              idSosmed,
            }))
          : [{ idSosmed: dataOrder.OrderSosmed }],
      };
    }

    if (dataOrder.OrderArtikel) {
      data.OrderArtikel = {
        create: {
          Artikel_1: dataOrder.OrderArtikel.artikel_1,
          Artikel_2: dataOrder.OrderArtikel.artikel_2,
        },
      };
    }

    if (dataOrder.pay_type === "cash") {
      data.payCash = {
        create: {
          total: dataOrder.payment.total,
          tempo: dataOrder.payment.tempo,
          diskon: dataOrder.payment.diskon,
        },
      };
    }

    if (dataOrder.pay_type === "barter") {
      data.barter = {
        create: {
          nilai: dataOrder.payment.nilaiBarter,
          tempo: dataOrder.payment.tempo,
          diskon: dataOrder.payment.diskon,
          barang: dataOrder.payment.barang,
        },
      };
    }

    if (dataOrder.pay_type === "semi_barter") {
      data.semiBarter = {
        create: {
          nilaiBarter: dataOrder.payment.nilaiBarter,
          tempoBarter: dataOrder.payment.tempoBarter,
          diskon: dataOrder.payment.diskon,
          nilaiCash: dataOrder.payment.nilaiCash,
          tempoCash: dataOrder.payment.tempoCash,
          itemBarang: dataOrder.payment.itemBarang,
        },
      };
    }

    if (dataOrder.pay_type === "kredit") {
      data.kredit = {
        create: {
          nilaiKredit: dataOrder.payment.nilaiKredit,
          tempo: dataOrder.payment.tempoKredit,
          diskon: dataOrder.payment.diskon,
        },
      };
    }

    if (dataOrder.pay_type === "termin") {
      data.termin = {
        create: {
          termin_1: dataOrder.payment.termin_1,
          tempo_1: dataOrder.payment.tempo_1,
          termin_2: dataOrder.payment.termin_2,
          tempo_2: dataOrder.payment.tempo_2,
          termin_3: dataOrder.payment.termin_3,
          tempo_3: dataOrder.payment.tempo_3,
          diskon: dataOrder.payment.diskon,
        },
      };
    }
    if (dataOrder.pay_type === "deposit") {
      data.deposit = {
        create: {
          totalDeposit: dataOrder.payment.deposit,
          minDeposit: dataOrder.payment.minDeposit,
          status: "aktif",
        },
      };
    }

    const dataOti = {
      sosmed: dataOrder.OrderSosmed,
      artikel: dataOrder.OrderArtikel,
    };

    const order = await CreateOrderRepo(data);
   
    await createOti(order.id, dataOti);

    return Response(200, order, "sukses");
  } else {
    return Response(404, "", "customer tidak ditemukan ");
  }
};

const CreateNetworkServ = async (name) => {
  return await CreateNetworkRepo(name);
};

const CreateMitraServ = async (name) => {
  return await CreateMitraRepo(name);
};
const CreateSosmedServ = async (name) => {
  return await CreateSosmedRepo(name);
};

const UploadMitra = async (data) => {
  const dataRest = await Promise.all(
    data.map((Item) => {
      return CreateMitraRepo(Item.nama);
    })
  );
  return dataRest;
}

const GetallOrderServ = async (pageNumber, pageSize) => {
  const order = await GetAllOrderRepo(pageNumber, pageSize);
  const totalDataOrder = await getCountOrder();

  const orderResponse = await Promise.all(
    order.map(async (item) => {
      const network = await Promise.all(
        item.OrderNetwork.map(async (NetItem) => {
          return await GetNetworkByIdRepo(NetItem.idNetwork);
        })
      );

      const mitra = await Promise.all(
        item.OrderMitra.map(async (MitItem) => {
          return await GetMitraByIdRepo(MitItem.idMitra);
        })
      );

      const sosmed = await Promise.all(
        item.OrderSosmed.map(async (SosItem) => {
          return await GetSosmedByIdRepo(SosItem.idSosmed);
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
          ...(item.mtPikiranRakyat
            ? { pikiranRakyat: item.mtPikiranRakyat }
            : {}),
          ...(sosmed.length ? { sosmed: sosmed } : {}),
          ...(network.length ? { network: network } : {}),
          ...(mitra.length ? { mitra: mitra } : {}),
          ...(item.OrderArtikel.length ? { artikel: item.OrderArtikel } : {}),
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
    dataProps.sosmed.map(async (sosItem, index) => {
      const sosmedData = await GetSosmedByIdRepo(sosItem);
      const count = await countOti("Media Sosial");
     
      const formattedCount = String(count + index + 1).padStart(3, '0');
      const dataRest = {
        idOrder: idOrder,
        product: "Media Sosial",
        sub: sosmedData.name,
        oti: `${formattedCount}/MS03/291/OTI-CRW/${month}/${year}`,
      };
      await createOtiRepo(dataRest);
    })
  );

  if(dataProps.artikel.artikel_1){
    const count = await countOti("Artikel");
    const formattedCount = String(count + index + 1).padStart(3, '0');
      const dataRest = {
        idOrder: idOrder,
        product: "Artikel",
        sub: 'Artikel & Content',
        oti: `${formattedCount}/A01/291/OTI-CRW/${month}/${year}`,
      };
      
      await createOtiRepo(dataRest);
  }
  
  if(dataProps.artikel.artikel_2){
    const count = await countOti("Artikel");
    const formattedCount = String(count + index + 1).padStart(3, '0');
      const dataRest = {
        idOrder: idOrder,
        product: "Artikel",
        sub: 'Artikel & Content Nework',
        oti: `${formattedCount}/A01/291/OTI-CRW/${month}/${year}`,
      };
      
      await createOtiRepo(dataRest);
  }
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
  GetMediaTayangServ,
  CreateOrderServ,
  CreateNetworkServ,
  CreateMitraServ,
  CreateSosmedServ,
  GetallOrderServ,
  GetorderByIdServ,
  UploadMitra
};
