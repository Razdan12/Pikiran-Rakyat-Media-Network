const { GetNetworkByIdRepo } = require("../Order/OrderRepo");
const { getNetworkRepo, editNetworkRepo, getMitraRepo, getSosmedRepo, totalMitra, totalSosmed } = require("./mediaRepo");

const getNetwork = async (pageNumber, pageSize) => {
    return await getNetworkRepo(pageNumber, pageSize)
}
const getMitra = async (pageNumber, pageSize) => {
    const mitra = await getMitraRepo(pageNumber, pageSize)
    const total = await totalMitra()
    const data = {
        totalPage: Math.ceil(total / pageSize),
        pageNumber: pageNumber,
        totalData: mitra.length,
        data: mitra,
      };
    
      return data;
}
const getSosmed = async (pageNumber, pageSize) => {
    const sosmed = await getSosmedRepo(pageNumber, pageSize)
    const total = await totalSosmed()
    const data = {
        totalPage: Math.ceil(total / pageSize),
        pageNumber: pageNumber,
        totalData: sosmed.length,
        data: sosmed,
      };
    
      return data;
}

const editNetwork = async(data) => {
    const network = await GetNetworkByIdRepo(data.id)
    if(!network){
        return "data tidak ditemukan"
    }
    const dataRest = {
        id: data.id,
        name: data.name ? data.name : network.name,
        status: data.status === undefined ? network.status : data.status
    }
    return await editNetworkRepo(dataRest)
}
module.exports = {
    getNetwork,
    editNetwork ,
    getMitra,
    getSosmed
  };
  