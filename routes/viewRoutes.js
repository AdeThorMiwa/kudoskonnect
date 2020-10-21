const express = require("express");
const views = require("./../controllers/viewsController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.get(
  "/profile",
  views.useProfileLayout,
  authController.protect,
  views.profile
);
router.get(
  "/change-password",
  views.useProfileLayout,
  authController.protect,
  views.changePassword
);
router.get(
  "/history",
  views.useProfileLayout,
  authController.protect,
  views.history
);

router.use(authController.isLoggedIn);

router.get("/", views.home);

router.get("/buy-airtime", views.home);
router.get("/buy-data", views.dataBundle);
router.get("/fund-wallet", views.fundWallet);

router.use(views.usePagesLayout);

router.get("/auth", views.auth);
router.get("/about", views.about);
router.get("/contact", views.contact);
router.get("/faq", views.faq);
router.get("/support", views.support);

module.exports = router;
