const { getCustomerByIdServ } = require("../Cutomer/CustService");
const { getOtiRepo, countOti } = require("./OtiRepo")

const GetOtiServ = async (pageNumber, pageSize) => {
   const otiRest = await getOtiRepo(pageNumber, pageSize)
   const oti = await Promise.all(
      otiRest.map(async (Item) => {
         const idCust = Item.order.idCust
         const customer = await getCustomerByIdServ(idCust)
         return {
            idOrder: Item.idOrder,
            client : customer.name,
            tgl_order : new Date(Item.order.order_date).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' }),
            period_start : new Date(Item.order.period_start).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
            period_end: new Date(Item.order.period_end).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
            noMo: Item.order.noMo,
            product: Item.product,
            sub: Item.sub,
            oti: Item.oti 
         }
      })
    );

    const totalOTI = await countOti()
    return {
      totalPage: Math.ceil(totalOTI / pageSize),
      pageNumber: pageNumber,
      totalData: otiRest.length,
      data: oti,
    }
}

module.exports = {
   GetOtiServ
}