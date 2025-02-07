const express = require("express");
const router = express.Router();
const stateController = require("../controllers/stateControllers");
const { isAuth } = require("../middleware/authMiddleware");

router.post("/add", isAuth, stateController.createState);
router.get("/", stateController.getAllStates);
router.get("/:id", stateController.getStateById);
router.put("/edit/:id", isAuth, stateController.updateState);
router.delete("/delete/:id", isAuth, stateController.deleteState);
router.get("/:countryId", stateController.getStatesByCountry);

module.exports = router;