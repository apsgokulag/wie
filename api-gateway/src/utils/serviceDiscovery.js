module.exports = {
  getServiceUrl: (serviceName) => {
    // Return registered service URL dynamically
    return `http://${serviceName}.localhost`; // Example
  },
};
