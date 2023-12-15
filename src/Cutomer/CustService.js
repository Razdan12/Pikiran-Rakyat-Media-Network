const {
  createCustomerRepo,
  getCustomer,
  getCustomerByIdRepo,
} = require("./CustRepo");

const createCustomerServ = async (dataRes) => {
  const data = {
    name: dataRes.name,
    type: dataRes.type,
    contact: dataRes.contact,
    contact_phone: dataRes.phone,
    email: dataRes.email,
    npwp: dataRes.npwp,
    address: dataRes.address,
    fincontact: dataRes.fincontact,
    fincontact_phone: dataRes.fincontact_phone,
    img_logo: dataRes.logo,
    img_akta: dataRes.akta,
    img_nib: dataRes.nib,
    img_npwp: dataRes.img_npwp,
  };
  return await createCustomerRepo(data);
};

const getCustomerServ = async () => {
  const customer = await getCustomer();
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
      picName : response.contact,
      phone: response.contact_phone,
      address: response.address,
      logo: response.img_logo
    }
    return data;
  } catch (error) {
    return "data notfound"
  }
};

module.exports = { createCustomerServ, getCustomerServ, getCustomerByIdServ };
