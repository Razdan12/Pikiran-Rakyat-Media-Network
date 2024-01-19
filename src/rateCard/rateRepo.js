const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addArticleRepo = async (data) => {
  const article = await prisma.rate_article.create({
    data: data,
  });
  return article;
};

const addRateSosmedRepo = async (data) => {
  const sosmed = await prisma.rate_sosmed.create({
    data: data,
  });
  return sosmed;
};

const addOtherContentRepo = async (data) => {
  const other = await prisma.rate_other_content.create({
    data: data,
  });
  return other;
};

const addCPDRepo = async (data) => {
  const cpd = await prisma.rate_cpd.create({
    data: data,
  });
  return cpd;
};

const addCPMRepo = async (data) => {
  const cpm = await prisma.rate_cpm.create({
    data: data,
  });
  return cpm;
};

const getArticleAllRepo = async () => {
    const article  = prisma.rate_article.findMany()
    return article
}

const getRateSosmedRepo = async (status) => {
    const meta = prisma.rate_sosmed.findMany({
        where: {
            is_other : status
        }
    })

    return meta
}

const getRateOtherRepo = async () => {
    const otherContent = await prisma.rate_other_content.findMany()
    return otherContent
}

const getCpdRepo = async (status) => {
    const cpd = await prisma.rate_cpd.findMany({
        where: {
            is_other: status
        }
    })
    return cpd
}

const getAllCpmRepo = async () => {
    const cpm = await prisma.rate_cpm.findMany()
    
    return cpm
}

module.exports = {
  addArticleRepo,
  addRateSosmedRepo,
  addOtherContentRepo,
  addCPDRepo,
  addCPMRepo,
  getArticleAllRepo,
  getRateSosmedRepo,
  getRateOtherRepo,
  getCpdRepo,
  getAllCpmRepo
};
