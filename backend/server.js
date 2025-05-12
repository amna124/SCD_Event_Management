// server.js (or app.js)
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const sponsorRoutes = require("./routes/sponsorRoutes");
const session = require("express-session");
const profileRoutes = require("./routes/profileRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Define updateUser function
const updateUser = async () => {
  try {
    const users = await User.find({});
    users.forEach(async (user) => {
      if (!user.profile.bookedEvents) {
        user.profile.bookedEvents = [];
        await user.save();
      }
    });
    console.log("Users updated with bookedEvents field.");
  } catch (error) {
    console.error("Error updating users:", error);
  }
};

// Connect to MongoDB and start the server AFTER successful connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("MongoDB connected");

    // ✅ Only run this after Mongo is connected
    updateUser();

    // ✅ Start server here
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/profile", profileRoutes);

app.use(
  session({
    secret: "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",
    resave: false,
    saveUninitialized: true,
  })
);

// Static files & catch-all route
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
