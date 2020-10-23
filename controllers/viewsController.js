const crypto = require("./../utils/crypto");
const tabIntros = require("./../constants/tabIntro");
const cables = require("../constants/cables");

exports.home = (req, res, next) => {
  const page = req.url.slice(1, req.url.length);
  res.render("pages/home", {
    page,
    title: "Buy Airtime",
    tabContent: tabIntros[page]
  });
};

exports.dataBundle = (req, res, next) => {
  const page = req.url.slice(1, req.url.length);
  res.render("pages/data-bundle", {
    page,
    title: "Buy Data Bundle",
    tabContent: tabIntros[page]
  });
};

exports.fundWallet = (req, res, next) => {
  const page = req.url.slice(1, req.url.length);
  res.render("pages/fund-wallet", {
    page,
    title: "Fund Wallet",
    tabContent: tabIntros[page],
  });
};

exports.transferFund = (req, res, next) => {
  const page = req.url.slice(1, req.url.length);
  res.render("pages/transferFund", {
    page,
    title: "Transfer Fund",
    tabContent: tabIntros[page],
  });
};

exports.cableTv = (req, res, next) => {
  const page = req.url.slice(1, req.url.length);
  res.render("pages/cableTv", {
    page,
    title: "Cable Tv",
    tabContent: tabIntros[page],
    cables: cables
  });
};

exports.electricBill = (req, res, next) => {
  const page = req.url.slice(1, req.url.length);
  res.render("pages/electricBill", {
    page,
    title: "Electricity Bill",
    tabContent: tabIntros[page],
  });
};

exports.auth = (req, res, next) => {
  res.render("pages/loginAndSignUp", {
    title: "Login / Sign Up",
  });
};

exports.profile = (req, res, next) => {
  res.render("pages/profile", {
    title: "My Profile",
  });
};

exports.changePassword = (req, res, next) => {
  res.render("pages/changePassword", {
    title: "Change Password",
  });
};

exports.history = (req, res, next) => {
  res.render("pages/history", {
    title: "Transaction History",
    noSideDetail: true,
  });
};

exports.about = (req, res, next) => {
  res.render("pages/about", {
    title: "About Kudos Konnect",
  });
};

exports.contact = (req, res, next) => {
  res.render("pages/contact", {
    title: "Contact Us",
  });
};

exports.faq = (req, res, next) => {
  res.render("pages/faq", {
    title: "FAQ",
  });
};

exports.support = (req, res, next) => {
  res.render("pages/support", {
    title: "Support",
  });
};

exports.airtimeSummary = (req, res, next) => {
  res.render("pages/summary/airtime", {
    title: "Airtime",
  });
}

exports.dataSummary = (req, res, next) => {
  res.render("pages/summary/data", {
    title: "Data Bundle",
  });
}

exports.transferSummary = (req, res, next) => {
  res.render("pages/summary/transfer", {
    title: "Fund Transfer",
  });
}

exports.cableSummary = (req, res, next) => {
  res.render("pages/summary/cable", {
    title: "Cable Subscription",
  });
}

exports.usePagesLayout = (req, res, next) => {
  res.locals.layout = "pages";
  res.locals.page = req.url.slice(1, req.url.length);
  next();
};

exports.useProfileLayout = (req, res, next) => {
  res.locals.layout = "profile";
  res.locals.page = req.url.slice(1, req.url.length);
  next();
};

exports.useSummaryLayout = (req, res, next ) => {
  res.locals.layout = "summary";
  res.locals.page = req.url.slice(1, req.url.length);
  res.locals = { ...res.locals, ...req.query }
  next();
}
