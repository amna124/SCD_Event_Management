const express = require("express");
const {
  registerSponsor,
  loginSponsor,
  sponsorNewEvent,
  getSponsoredEvents,
} = require("../controllers/sponsorController");
const { Sponsorprotect } = require("../middleware/sponsorMiddleware");
const router = express.Router();
router.post("/login", loginSponsor);
// Route to sponsor a new event
router.post("/sponsor", Sponsorprotect, sponsorNewEvent);

// Route to get all sponsored events for a sponsor
router.get("/:sponsorId/sponsored-events", getSponsoredEvents);
module.exports = router;
