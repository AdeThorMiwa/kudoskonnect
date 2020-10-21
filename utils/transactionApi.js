const axios = require("axios");
const networks = require("./../constants/networks");
const crypto = require("./../utils/crypto");

exports.getAirtimeProductList = async (phone) => {
  const hash = crypto.generateHash();
  const res = await axios.post(
    "https://estoresms.com/network_list/v/2",
    JSON.stringify({
      username: process.env.ESTORE_USERNAME,
      hash,
      phone,
    })
  );

  if (res.data.response !== "OK")
    throw new Error("Unable to get Airtime Product List");

  return res.data;
};

exports.makeAirtimePurchase = async (productId, phone, amount, ref, hash) => {
  const res = await axios.post(
    "https://estoresms.com/network_processing/v/2",
    JSON.stringify({
      username: process.env.ESTORE_USERNAME,
      ref,
      callback: "https://samplewebsite.com/callback", // FIXME: change call back to changePurchaseStatus,
      hash,
      request: [
        {
          product: productId,
          phone,
          amount,
        },
      ],
    })
  );
  if (res.data.failed !== 0) throw new Error(res.data.message);

  return res.data.result[0];
};

exports.getDataProductList = async (phone) => {
  const hash = crypto.generateHash();
  const res = await axios.post(
    "https://estoresms.com/data_list/v/2",
    JSON.stringify({
      username: process.env.ESTORE_USERNAME,
      hash,
      phone,
    })
  );
  
  if (res.data.response !== "OK")
    throw new Error(`Error getting Data Product List: ${res.data.message}`);

  return res.data;
};

exports.makeDataPurchase = async (productId, phone, ref, hash) => {
  const res = await axios.post(
    "https://estoresms.com/data_processing/v/2",
    JSON.stringify({
      username: process.env.ESTORE_USERNAME,
      ref,
      callback: "https://samplewebsite.com/callback", // FIXME: change call back to changePurchaseStatus,
      hash,
      request: [
        {
          product: productId,
          phone,
        },
      ],
    })
  );
  
  if (res.data.failed !== 0) throw new Error(res.data.message);

  return res.data.result[0];
};

exports.getElectricCompany = async (companyCode) => {
  // REVIEW: confirm api authenticity
  const companies = await axios(
    `https://www.nellobytesystems.com/APIElectricityDiscosV1.asp`
  );
  return companies[companyCode];
};

exports.getAllNetworks = () => networks;
exports.getMobileNetworks = () =>
  networks.filter((network) => network.isMobile);

exports.convertToGigaRate = (megaRate) => {
  return `${megaRate / 1000}GB`;
};

exports.getDataValue = (amount) => {
  if (amount < 1000) return `${amount}MB`;
  return this.convertToGigaRate(amount);
};
