const axios = require('axios');
const services = require('../config/services');

module.exports = function (serviceName, path) {
  return async (req, res) => {
    try {
      const serviceUrl = services[serviceName];
      const response = await axios({
        method: req.method,
        url: `${serviceUrl}${path}`,
        data: req.body,
        headers: req.headers,
      });
      res.status(response.status).json(response.data);
    } catch (err) {
      res.status(err.response?.status || 500).json(err.response?.data || { message: 'Service error' });
    }
  };
};