const axios = require("axios");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const crypto = require("./../utils/crypto");
const {
  sendApiRequest,
  getElectricCompany,
  getNetwork,
  getAirtimeProductList,
  makeAirtimePurchase,
  makeDataPurchase,
  getDataProductList,
  getDataValue,
  getCablePlansFor,
  makeCablePurchase
} = require("./../utils/transactionApi");
const factory = require("./../factory/DBFactory");

const Transactions = require("./../models/TransactionModel");
const cables = require("../constants/cables");

exports.get = factory.getAll(Transactions);

exports.getMobileNetwork = catchAsync(async (req, res, next) => {
  if(!req.query.mobile) return next(new AppError("Mobile Number Not Provided."))
  const { info, products } = await getAirtimeProductList(req.query.mobile);

  res.status(201).json({
    status: "success",
    data: {
      operator: info.operator,
      min: products[0].min,
      max: products[0].max,
      rate: products[0].rate
    },
  });
})

exports.getAvailablePlans = catchAsync(async (req, res, next) => {
  if(!req.query.mobile) return next(new AppError("Mobile Number Not Provided."));

  const { info, products } = await getDataProductList(req.query.mobile);
  res.status(201).json({
    status: "success",
    data: {
      operator: info.operator,
      plans: products
    },
  });
})

exports.getAvailableCables = (req, res, next) => {
  res.status(201).json({
    status: "success",
    data: cables
  });
}

exports.getCablePlans = catchAsync(async (req ,res, next) => {
  const { cable, number } = req.body;
  if(!cable || !number) return next(new AppError("Invalid Inputs"));

  const data = await getCablePlansFor(cable, number)
  res.status(201).json({
    status: "success",
    data: data
  });
})

exports.buyAirtime = catchAsync(async (req, res, next) => {
  const { phone, amount } = req.body;
 
  if (!phone || !amount) return next(new AppError("Invalid Inputs"));

  const ref = crypto.genRandomId();
  let hash = crypto.generateHash();

  const { info, products } = await getAirtimeProductList(phone, hash);

  hash = crypto.generateHash(ref);
  const {
    response,
    transaction_id,
    amount: airtime_amount,
    amount_charged,
  } = await makeAirtimePurchase(products[0].id, phone, amount, ref, hash);

  const transaction = await Transactions.create({
    transactionId: transaction_id,
    status: response,
    type: "airtime",
    trx_detail: {
      mobileNetwork: info,
      mobileNumber: phone,
    },
    orderType: `${amount} Airtime Purchase`,
    amount: airtime_amount,
    amountCharged: amount_charged,
    walletBalance: (req.user.wallet || 0) - airtime_amount,
  });

  res.status(201).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

exports.buyData = catchAsync(async (req, res, next) => {
  const { phone, plan } = req.body;

  if (!phone || !plan) {
    return next(new AppError("Invalid Inputs"));
  }

  const ref = crypto.genRandomId();
  let hash = crypto.generateHash();

  const { products, info } = await getDataProductList(phone, hash);

  hash = crypto.generateHash(ref);
  const {
    response,
    transaction_id,
    data_amount,
    amount,
    amount_charged,
  } = await makeDataPurchase(plan, phone, ref, hash);

  const transaction = await Transactions.create({
    transactionId: transaction_id,
    status: response,
    type: "data_bundle",
    trx_detail: {
      mobileNetwork: info,
      mobileNumber: phone,
      plan: products.find(product.id === plan),
    },
    orderType: `${getDataValue(data_amount)} Data Purchase`,
    amount: amount,
    amountCharged: amount_charged,
    walletBalance: (req.user.wallet || 0) - amount,
  });

  res.status(201).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

exports.transferFund = catchAsync(async (req, res, next) => {
  const { amount, to } = req.body;
  if (!to) return next(new AppError("Please specify a receiver", 400));
  if (!amount) return next(new AppError("Please specify an amount", 400));

  const { _id: id, fullname, phone } = await req.user.transferFund(amount, to);

  const transaction = await Transactions.create({
    transactionId: crypto.genRandomId(),
    status: "ORDER_COMPLETED",
    type: "transfer_fund",
    trx_detail: {
      user: { id, fullname, phone },
    },
    orderType: `${amount} Fund Transfer`,
    amount: amount,
    amountCharged: amount,
    walletBalance: (req.user.wallet || 0) - amount,
  });

  res.status(200).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

exports.cableTV = catchAsync(async (req, res, next) => {
  const { cable, plan, number } = req.body;

  if (!cable || !plan || !number) {
    return next(new AppError("Invalid Inputs!"));
  }

  const { response, transaction_id, discounted_amount } = await makeCablePurchase(cable, plan, number);

  const transaction = await Transactions.create({
    transactionId: transaction_id,
    status: response,
    type: "cable",
    trx_detail: {
      cable,
      plan,
      number,
    },
    orderType: `${getDataValue(data_amount)} Data Purchase`,
    amount: discounted_amount,
    amountCharged: discounted_amount,
    walletBalance: (req.user.wallet || 0) - discounted_amount,
  });

  res.status(201).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

exports.rechargeCard = catchAsync(async (req, res, next) => {
  const { network, amount, order_quantity } = req.body;

  if (!network || !amount || !order_quantity) {
    return next(new AppError("Invalid Inputs!"));
  }

  const response = await axios(
    `${process.env.CLUB_KONNECT}/APIEPINV1.asp?UserID=${process.env.CLUB_KONNECT_USER_ID}&APIKey=${process.env.CLUB_KONNECT_API_KEY}&MobileNetwork=${network}&Value=${amount}&Quantity=${order_quantity}`
  );

  const transaction = await Transactions.create({
    orderId: crypto.randomBytes(12).toString("hex"),
    status: "ORDER_COMPLETED",
    type: "recharge_card",
    trx_detail: {
      TXN_EPIN: [...response.data.TXN_EPIN],
    },
    orderType: `${amount} ${getMobileNetwork(network)} Recharge PIN Print`,
    amount,
    amountCharged: amount - 5, // FIXME: get amount charged and update
    walletBalance: (req.user.wallet || 0) - amount,
  });

  res.status(201).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

exports.electricBill = catchAsync(async (req, res, next) => {
  const { electric_company_code, meter_type, meter_no, amount } = req.body;

  if (!electric_company_code || !meter_type || !meter_no || !amount) {
    return next(new AppError("Invalid Inputs"));
  }

  const { orderid, status, meterno, metertoken } = await sendApiRequest(
    "APIElectricityV1",
    `&ElectricCompany=${electric_company_code}&MeterType=${meter_type}&MeterNo=${meter_no}&Amount=${amount}`
  );

  const electricCompany = await getElectricCompany(electric_company_code);

  const transaction = await Transactions.create({
    orderId: orderid,
    status,
    type: "data_bundle",
    trx_detail: {
      meterNo: meterno,
      meterToken: metertoken,
    },
    orderType: `${electricCompany} Payment`,
    amount,
    amountCharged: amount - 5, // FIXME: get amount charged and update
    walletBalance: (req.user.wallet || 0) - amount,
  });

  res.status(201).json({
    status: "success",
    data: {
      transaction,
    },
  });
});


exports.hasSufficientFund = (req, res, next) => {
  if (!(req.user.wallet >= req.body.amount))
    return next(
      new AppError("Insufficient fund. Please fund account and try again.")
    );
  next();
};

exports.aliasUserHistory = (req, res, next) => {
  req.query.user = req.user.id;
  next();
};
