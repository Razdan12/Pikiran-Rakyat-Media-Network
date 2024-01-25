const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const getMitraRepo = async (pageNumber, pageSize) => {
  return await prisma.mitra.findMany({
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    orderBy: {
       created_At: "desc",
      },
  });
};

const findMitra = async (name) => {
  return await prisma.mitra.findMany({
    where: {
      name: {
        contains: name
      }
    }
  });
};


const totalMitra = async () => {
    return await prisma.mitra.count()
}

const getAllMtraRepo = async() => {
  return await prisma.mitra.findMany()
}

const editMitra = async(id, data) => {
  return prisma.mitra.update({
    where: {
      id
    },
    data
  })
}

const deleteMitraRepo = async(id) => {
  return prisma.mitra.update({
    where: {
      id
    },
    data : {
      is_deleted : true
    }
  })
}

module.exports = {

  getMitraRepo,
  totalMitra,
  findMitra,
  getAllMtraRepo,
  editMitra,
  deleteMitraRepo
 
};
