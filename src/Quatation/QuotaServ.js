const { GetallOrderServ, GetallOrderByUserServ } = require("../Order/OrderService")
const { QuotationCustData } = require("./Quotrepo")

const QuotaDataList = async (id) => {
    const quota = await QuotationCustData(id)
   
    
    return {
        camp_name : quota.camp_name,
        camp_type : quota.Sales_type,
        period_start : new Date(quota.period_start).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric' }),
        period_end : new Date(quota.period_end).toLocaleDateString('id-ID', { day: 'numeric', month: 'long',  year: 'numeric' }),
        cust_type : quota.costumer.type,
        cust_name : quota.costumer.name,
        pic_name : quota.costumer.fincontact,
        pic_contact : quota.costumer.fincontact_phone,
        approve1: quota.sales_approve,
        approve2: quota.manager_approve,
        approve3: quota.pic_approve,
       request_by: quota.request_by
    }
}

const getMediaOrderData = async (pageNumber, pageSize) => {
    const order = await GetallOrderServ(pageNumber, pageSize);
  
    const orderResponse = await Promise.all(
      order.dataOrder.map(async (item) => {
        let cashBack = 0;
        let intensive = 0;

        const paymentTypes = ['cash', 'barter', 'semi_barter', 'kredit', 'termin'];
  
        for (const type of paymentTypes) {
          if (item.payment?.[type]?.length) {
            item.payment[type].map((pay) => {
              cashBack = pay.cash_back;
              intensive = pay.intensive;
            });
          }
        }
  
        return {
          idOrder: item.idOrder,
          client_name: item.customer.name,
          tgl_order: item.order_date,
          no_quo: item.order_no,
          period_start: item.period_start,
          period_end: item.period_end,
          media_order: item.no_mo,
          cashBack: cashBack,
          intensive: intensive,
        };
      })
    );
  
    return {
      pageNumber: order.pageNumber,
      totalPage: order.totalPage,
      totalData: order.totalData,
      data: orderResponse,
    };
  };
  
const getMediaOrderDataByUser = async (id, pageNumber, pageSize) => {
    const order = await GetallOrderByUserServ(id, pageNumber, pageSize);
        const orderResponse = await Promise.all(
            order.dataOrder.map(async (item) => {
                return {
                    idOrder : item.idOrder,
                    client_name : item.customer.name,
                    tgl_order : item.order_date,
                    no_quo : item.order_no,
                    period_start : item.period_start,
                    period_end: item.period_end,
                    media_order : item.no_mo
                }
            })
        )
        
    return {
        pageNumber : order.pageNumber,
        totalPage: order.totalPage,
        totalData: order.totalData,
        data: orderResponse
    };

}

module.exports = {QuotaDataList, getMediaOrderData,getMediaOrderDataByUser}