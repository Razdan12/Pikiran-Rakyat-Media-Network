exports.Response = (status, data, message) => {
    const response = {
      status: status,
      data: data,
      message: message,
    };
    return response;
  };
  