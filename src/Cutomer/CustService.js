const {
  createCustomerRepo,
  getCustomer,
  getCustomerByIdRepo,
  getCustomerAll,
  getCountCustomer,
  deleteCustomer,
  editCustomerRepo,
} = require("./CustRepo");

const createCustomerServ = async (dataRes) => {

  const data = {
    name: dataRes.name  ,
    type: dataRes.type,
    contact: dataRes.contact,
    contact_phone: dataRes.phone,
    email: dataRes.email,
    npwp: dataRes.npwp != 'undifinded' ? dataRes.npwp : '' ,
    address: dataRes.address != 'undifinded' ? dataRes.address : '',
    fincontact: dataRes.fincontact != 'undifinded' ? dataRes.fincontact: '',
    fincontact_phone: dataRes.fincontact_phone != 'undifinded' ? dataRes.fincontact_phone : '',
    is_deleted: false
  };
 
  return await createCustomerRepo(data);
};

const getCustomerServ = async () => {
  let customer = await getCustomer();
  customer = customer.filter((item) => !item.is_deleted);
  const customerResponse = await Promise.all(
    customer.map(async (item) => {
      const data = {
        id: item.id,
        name: item.name,
      };
      return data;
    })
  );
  return customerResponse;
};

const getCustomerByIdServ = async (id) => {
  try {
    const response = await getCustomerByIdRepo(id);
    const data = {
      id: response.id,
      name: response.name,
      picName: response.contact,
      phone: response.contact_phone,
      address: response.address,
      logo: response.img_logo,
      email: response.email,
      npwp: response.npwp,
      finContact: response.fincontact,
      finPhone: response.fincontact_phone
      
    };
    return data;
  } catch (error) {
    return "data notfound";
  }
};

const getAllCust = async (pageNumber, pageSize) => {
  try {
    let customer = await getCustomerAll(pageNumber, pageSize);
    customer = customer.filter((item) => !item.is_deleted);
    const count = await getCountCustomer();
    const customerResponse = await Promise.all(
      customer.map(async (item) => {
        return {
          id: item.id,
          custname: item.name,
          contactName: item.contact ? item.contact : '-',
          phone: item.contact_phone ? item.contact_phone : '-',
          email: item.email ? item.email : '-',
          address: item.address ? item.address : '-',
          finName: item.fincontact ? item.fincontact : '-',
          finContact: item.fincontact_phone ? item.fincontact_phone : '-',
        };
      })
    );

    const data = {
      totalPage: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      totalData: customer.length,
      data: customerResponse,
    };

    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteCustomerServ = async (id) => {
  const user = await getCustomerByIdRepo(id);

  if (user) {
    return await deleteCustomer(id);
  } else {
    return "user tidak ditemukan";
  }
};

const editCustomer = async (id, dataRes) => {
  const data = {
    name: dataRes.name,
    contact: dataRes.contact,
    contact_phone: dataRes.phone,
    email: dataRes.email,
    npwp: dataRes.npwp,
    address: dataRes.address,
    fincontact: dataRes.fincontact,
    fincontact_phone: dataRes.fincontact_phone,
  }

  const response = await editCustomerRepo(id, data)
  return response

}


module.exports = {
  createCustomerServ,
  getCustomerServ,
  getCustomerByIdServ,
  getAllCust,
  deleteCustomerServ,
  editCustomer
};
