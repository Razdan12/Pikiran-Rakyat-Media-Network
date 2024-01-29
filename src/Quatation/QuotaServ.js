const { GetallOrderServ } = require("../Order/OrderService")
const { QuotationCustData } = require("./Quotrepo")

const QuotaDataList = async (id) => {
    const quota = await QuotationCustData(id)
    return {
        camp_name : quota.camp_name,
        camp_type : quota.Sales_type,
        period_start : new Date(quota.period_start).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        period_end : new Date(quota.period_end).toLocaleDateString('id-ID', { month: 'long',  year: 'numeric' }),
        cust_type : quota.costumer.type,
        cust_name : quota.costumer.name,
        pic_name : quota.costumer.fincontact,
        pic_contact : quota.costumer.fincontact_phone
    }
}

const getMediaOrderData = async (pageNumber, pageSize) => {
    const order = await GetallOrderServ(pageNumber, pageSize);
        const orderResponse = await Promise.all(
            order.dataOrder.map(async (item) => {
                return {
                    idOrder : item.idOrder,
                    client_name : item.customer.name,
                    tgl_order : item.order_date,
                    no_quo : item.order_no,
                    period_start : item.period_start,
                    period_end: item.period_end,
                    media_order : 'mo/2023'
                }
            })
        )
        
        console.log(orderResponse);
    return {
        pageNumber : order.pageNumber,
        totalPage: order.totalPage,
        totalData: order.totalData,
        data: orderResponse
    };

}

module.exports = {QuotaDataList, getMediaOrderData}