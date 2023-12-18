const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const QuotationCustData = async (id) => {
    return await prisma.order.findUnique({
        where: {
            id
        },
        include: {
            costumer: true,
        }
    })
}

module.exports = {QuotationCustData}