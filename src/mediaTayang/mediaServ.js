
const { getMitraRepo,totalMitra, findMitra, getAllMtraRepo, editMitra, deleteMitraRepo, } = require("./mediaRepo");


const getMitra = async (pageNumber, pageSize) => {
    let mitra = await getMitraRepo(pageNumber, pageSize)
    mitra = mitra.filter((item) => !item.is_deleted);
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

const editMitraServ = async (id, data) => {
    const dataRest = {
        name: data.name,
        status: data.status
    }
    return await editMitra(id, dataRest)
}

const deleteMitra = async (id)=> {
    return deleteMitraRepo(id)
}

module.exports = {
    getMitra,
    findMitraServ,
    getMitraServ,
    editMitraServ,
    deleteMitra
  
  };
  