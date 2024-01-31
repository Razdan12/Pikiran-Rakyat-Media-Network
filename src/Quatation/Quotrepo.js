const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const QuotationCustData = async (id) => {
    return await prisma.order.findUnique({
        where: {
            id
        },
        include: {
            costumer: true,
            payCash: true,
            barter: true,
            semiBarter: true,
            kredit: true,
            termin: true,
            deposit: true,
            oti: true,
            OrderMitra: true
        }
    })
}

module.exports = {QuotationCustData}