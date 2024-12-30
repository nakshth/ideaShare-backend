import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../src/models/userModel"; // Assuming you have a User model

// Configure passport to use the local strategy for username/password login
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Compare password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // If valid, return the user
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user: any, done) => {
  done(null, user._id); // Store user ID in session
});

// Deserialize user based on session data (user._id)
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Store full user object in session
  } catch (error) {
    done(error);
  }
});
