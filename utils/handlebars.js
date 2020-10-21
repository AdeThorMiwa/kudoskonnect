exports.isActivePage = (currentPage, activePage) =>
  currentPage === activePage ? "active" : "";

exports.returnIfTrue = (condition, returnValue) =>
  condition ? returnValue : "";

exports.returnIfNotTrue = (condition, returnValue) =>
  !condition ? returnValue : "";

exports.getDisplayNameFrom = (user) =>
  user ? user.fullname.split(" ")[0] : "";
exports.getWalletBalanceFrom = (user) => (user ? user.wallet : 0);
exports.getFullNameFrom = (user) => user ? user.fullname : "";
exports.getMobileFrom = (user) => user ? user.phone : "";
exports.getEmailFrom = (user) => user ? user.email : "";
