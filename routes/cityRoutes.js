const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityControllers");
const { isAuth } = require("../middleware/authMiddleware");

router.post("/add", isAuth, cityController.createCity);
router.get("/", cityController.getAllCities);
router.get("/:id", cityController.getCityById);
router.put("/edit/:id", isAuth, cityController.updateCity);
router.delete("/delete/:id", isAuth, cityController.deleteCity);
router.get("/:stateId", cityController.getCitiesByState);

module.exports = router;