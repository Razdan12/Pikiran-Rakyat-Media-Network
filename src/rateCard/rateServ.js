const {
  addArticleRepo,
  addRateSosmedRepo,
  addOtherContentRepo,
  addCPDRepo,
  addCPMRepo,
  getArticleAllRepo,
  getRateSosmedRepo,
  getRateOtherRepo,
  getCpdRepo,
  getAllCpmRepo,
  getArtikrelByIdRepo,
} = require("./rateRepo");

const addArticleServ = async (data) => {
  const dataRest = {
    name: data.name,
    prmn: data.prmn,
    mitra: data.mitra,
    note: data.note,
    is_custom_price_prmn: data.customPricePrmn,
    is_custom_price_mitra: data.customPriceMitra,
  };
  const article = await addArticleRepo(dataRest);
  return article;
};

const addRateSosmedServ = async (data) => {
  const dataRest = {
    name: data.name,
    instagram: data.instagram,
    facebook: data.facebook,
    rate: data.rate,
    type: data.type,
    note: data.note,
    is_custom_price: data.customPrice,
    is_other: data.other
  };

  const sosmed = await addRateSosmedRepo(dataRest);
  return sosmed;
};

const addOtherContentServ = async (data) => {
  const dataRest = {
    name: data.name,
    rate: data.rate,
    note: data.note,
    is_custom_price: data.customPrice,
  };
  const other = await addOtherContentRepo(dataRest);
  return other;
};

const addCPDServ = async (data) => {
  const dataRest = {
    name: data.name,
    type: data.type,
    size: data.size,
    rate_home: data.home,
    rate_detail : data.detail,
    rate_section: data.section,
    rate: data.rate,
    is_custom_price: data.customPrice,
    is_other: data.is_other
  };

  const cpd = await addCPDRepo(dataRest);
  return cpd;
};

const addCPMServ = async (data) => {
    const dataRest = {
        name: data.name,
        type: data.type,
        size: data.size,
        rate: data.rate,
        is_custom_price: data.customPrice
    }

    const cpd = await addCPMRepo(dataRest)
    return cpd
}

const getAllArticleServ = async () => {
    const article = await getArticleAllRepo()
    const articleRest = await Promise.all(
      article.map(async (item) => {
        const data = {
          id: item.id,
          name: item.name,
          mitra: item.mitra,
          prmn: item.prmn,
          note: item.note,
          is_custom_price_mitra: item.is_custom_price_mitra,
          is_custom_price_prmn: item.is_custom_price_prmn
        }
        return data
      })
    )
    return articleRest
}

const getRateSosmed = async () => {
    const meta = await getRateSosmedRepo(false)
    const other = await getRateSosmedRepo(true)

    const data = {
        meta,
        other
    }
    return data
}

const getRateOtherServ = async () => {
    const other = await getRateOtherRepo()
    return other
}

const getAllCpdServ = async () => {
    const cpdDisplay = await getCpdRepo(false)
    const cpdOther = await getCpdRepo(true)

    const data = {
        cpdDisplay,
        cpdOther
    }
    return data
}

const getAllCpmServ = async () => {
    const cpm = await getAllCpmRepo()
    return cpm
}

const getartikelByIdServ = async (id) => {
  const artikel = await getArtikrelByIdRepo(id)
  return artikel
}

module.exports = {
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
  getartikelByIdServ
};
