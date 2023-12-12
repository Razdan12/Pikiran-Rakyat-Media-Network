const { GetMediaTayang, CreateOrderRepo } = require("./OrderRepo");

const GetMediaTayangServ = async () => {
  return await GetMediaTayang();
};

const CreateOrderServ = async (dataOrder) => {
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

  const order = await CreateOrderRepo(data);
  return order;
};

module.exports = { GetMediaTayangServ, CreateOrderServ };
