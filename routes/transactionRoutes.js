const express = require("express");
const transactionsController = require("./../controllers/transactionsController");
const authController = require("./../controllers/authController");

const router = express.Router();

/**
 * Protected Routes
 * Only authenticated user can access these routes
 */
router.use(authController.protect);

router.get(
  "/user-history",
  transactionsController.aliasUserHistory,
  transactionsController.get
);

router.get(
  "/history",
  authController.restrictTo("role", "admin"),
  transactionsController.get
);

router.get("/get-mobile-network", transactionsController.getMobileNetwork)

/**
 * Check if user has sufficient fund to perform transaction
 * Only users with sufficient funds can access the below routes
 */
// router.use(transactionsController.hasSufficientFund);

/**
 * Transactions
 * NOTE: for fund transfer, it includes only user on platform
 * NOTE: No external transfer is made
 */

router.post("/buy-airtime", transactionsController.buyAirtime);
router.post("/buy-data", transactionsController.buyData); //
router.post("/pay-electric-bill", transactionsController.electricBill);
router.post("/pay-cable-tv", transactionsController.cableTV); //
router.post("/transfer-fund", transactionsController.transferFund);
router.post("/recharge-card", transactionsController.rechargeCard);

module.exports = router;
