import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env.local"),
});

async function makeAdmin() {
  try {
    // Dynamic imports AFTER .env.local has been loaded
    const { connectDB } = await import("../lib/mongodb");
    const { default: User } = await import("../models/User");

    const email = process.argv[2];

    if (!email) {
      console.log("Please provide an email address.");
      process.exit(1);
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      console.log("User not found.");
      process.exit(1);
    }

    console.log(`Admin role assigned to: ${user.email}`);
    console.log(`Role: ${user.role}`);

    process.exit(0);
  } catch (error) {
    console.error("Error assigning admin role:", error);
    process.exit(1);
  }
}

makeAdmin();