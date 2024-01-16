const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getNetworkRepo = async (pageNumber, pageSize) => {
  return await prisma.network.findMany({
    skip: (pageNumber - 1) * pageSize,
    take: pageSize
  });
};

const getMitraRepo = async (pageNumber, pageSize) => {
  return await prisma.mitra.findMany({
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    orderBy: {
        name: "asc",
      },
  });
};
const getSosmedRepo = async (pageNumber, pageSize) => {
  return await prisma.sosmed.findMany({
    skip: (pageNumber - 1) * pageSize,
    take: pageSize
  });
};

const editNetworkRepo = async (data) => {
    return await prisma.network.update({
        where:{
            id: data.id
        },
        data
    })
}

const totalMitra = async () => {
    return await prisma.mitra.count()
}
const totalSosmed = async () => {
    return await prisma.sosmed.count()
}


module.exports = {

  getNetworkRepo,
  editNetworkRepo,
  getMitraRepo,
  getSosmedRepo,
  totalMitra,
  totalSosmed
};
