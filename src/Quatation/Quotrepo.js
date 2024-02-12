const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const QuotationCustData = async (id) => {
  return await prisma.order.findUnique({
    where: {
      id,
    },

    include: {
      costumer: true,
      user: true,
      payCash: true,
      barter: true,
      semiBarter: true,
      kredit: true,
      termin: true,
      deposit: true,
      oti: true,
      OrderMitra: true,
      listProduk: true,
    },
  });
};

const editPayCashRepo = async (id, data) => {
  return await prisma.payCash.update({
    where: {
      idOrder: id,
    },
    data,
  });
};
const editPayKreditRepo = async (id, data) => {
  return await prisma.payKredit.update({
    where: {
      idOrder: id,
    },
    data,
  });
};
const editPaySemiRepo = async (id, data) => {
  return await prisma.paySemiBarter.update({
    where: {
      idOrder: id,
    },
    data,
  });
};
const editPayBarterRepo = async (id, data) => {
  return await prisma.payBarter.update({
    where: {
      idOrder: id,
    },
    data,
  });
};
const editPayTerminRepo = async (id, data) => {
  return await prisma.payTermin.update({
    where: {
      idOrder: id,
    },
    data,
  });
};

module.exports = {
  QuotationCustData,
  editPayCashRepo,
  editPayKreditRepo,
  editPaySemiRepo,
  editPayBarterRepo,
  editPayTerminRepo,
};
