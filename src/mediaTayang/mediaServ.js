
const { getMitraRepo,totalMitra, findMitra, getAllMtraRepo, } = require("./mediaRepo");


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

const findMitraServ = async (name) => {
    return await findMitra(name)
}

const getMitraServ = async () => {
    return await getAllMtraRepo()
}

module.exports = {
    getMitra,
    findMitraServ,
    getMitraServ
  
  };
  