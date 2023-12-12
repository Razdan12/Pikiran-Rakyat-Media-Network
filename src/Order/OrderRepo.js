const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const GetMediaTayang = async () => {
  const network = await prisma.network.findMany();
  const mitra = await prisma.mitra.findMany();
  const sosmed = await prisma.sosmed.findMany();
  const dataRest = {
    network,
    mitra,
    sosmed,
  };

  return dataRest;
};

const CreateOrderRepo = async (dataOrder) => {
  try {
    const order = await prisma.order.create({
      data: dataOrder,
    });

    return order;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { GetMediaTayang, CreateOrderRepo };
