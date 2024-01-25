const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOtiRepo = async (data) => {
    return await prisma.orderTayangIklan.create({
        data: data
    })
}

const countOti = async () => {
    return await prisma.orderTayangIklan.count()
} 

const getOtiRepo = async (pageNumber, pageSize) => {
    return await prisma.orderTayangIklan.findMany({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        include: {
            order: true
        },
        orderBy: {
            createdAt: "desc",
           },
    })
}
const contAllOti = async () => {
    return await prisma.orderTayangIklan.count()
}


module.exports = {
    createOtiRepo,
    countOti,
    getOtiRepo,
    contAllOti
}