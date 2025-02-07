const express = require("express");
const router = express.Router();
const countryController = require("../controllers/countryControllers");
const { isAuth } = require("../middleware/authMiddleware");

router.post("/add", isAuth, countryController.createCountry);
router.get("/", countryController.getAllCountries);
router.get("/:id", countryController.getCountryById);
router.put("/edit/:id", isAuth, countryController.updateCountry);
router.delete("/delete/:id", isAuth, countryController.deleteCountry);

module.exports = router;