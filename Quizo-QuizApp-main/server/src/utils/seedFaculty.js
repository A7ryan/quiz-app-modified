import { User } from "../models/user.model.js";

/**
 * Creates a default faculty user if none exists
 */
export const createDefaultFaculty = async () => {
  try {
    // Check if any faculty user exists
    const existingFaculty = await User.findOne({ userType: "faculty" });
    
    if (existingFaculty) {
      console.log("✅ Faculty user already exists:", existingFaculty.email);
      return existingFaculty;
    }

    // Create default faculty user
    const defaultFaculty = new User({
      name: "Default Faculty",
      email: "faculty@quiz.com",
      password: "Faculty@123", // This will be hashed by the pre-save middleware
      userType: "faculty",
      picture: "https://ui-avatars.com/api/?name=Default+Faculty&background=0d1421&color=fff"
    });

    await defaultFaculty.save();
    console.log("✅ Default faculty user created successfully:");
    console.log("   Email: faculty@quiz.com");
    console.log("   Password: Faculty@123");
    console.log("   Role: faculty");
    
    return defaultFaculty;
  } catch (error) {
    console.error("❌ Error creating default faculty user:", error.message);
    throw error;
  }
};

/**
 * Lists all faculty users in the system
 */
export const listFacultyUsers = async () => {
  try {
    const facultyUsers = await User.find({ userType: "faculty" }).select("-password");
    console.log(`📋 Found ${facultyUsers.length} faculty user(s):`);
    facultyUsers.forEach((faculty, index) => {
      console.log(`   ${index + 1}. ${faculty.name} (${faculty.email})`);
    });
    return facultyUsers;
  } catch (error) {
    console.error("❌ Error listing faculty users:", error.message);
    throw error;
  }
};

/**
 * Create additional faculty user
 * @param {Object} facultyData - Faculty user data
 */
export const createFacultyUser = async (facultyData) => {
  try {
    const { name, email, password } = facultyData;
    
    // Validate required fields
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required");
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error(`User with email ${email} already exists`);
    }

    // Create faculty user
    const faculty = new User({
      name,
      email: email.toLowerCase(),
      password,
      userType: "faculty"
    });

    await faculty.save();
    console.log(`✅ Faculty user created: ${name} (${email})`);
    return faculty;
  } catch (error) {
    console.error("❌ Error creating faculty user:", error.message);
    throw error;
  }
};

/**
 * Creates a default admin user if none exists
 */
export const createDefaultAdmin = async () => {
  try {
    // Check if any admin user exists
    const existingAdmin = await User.findOne({ userType: "admin" });
    
    if (existingAdmin) {
      console.log("✅ Admin user already exists:", existingAdmin.email);
      return existingAdmin;
    }

    // Create default admin user
    const defaultAdmin = new User({
      name: "System Administrator",
      email: "admin@quiz.com",
      password: "Admin@123", // This will be hashed by the pre-save middleware
      userType: "admin",
      picture: "https://ui-avatars.com/api/?name=System+Administrator&background=dc2626&color=fff"
    });

    await defaultAdmin.save();
    console.log("✅ Default admin user created successfully:");
    console.log("   Email: admin@quiz.com");
    console.log("   Password: Admin@123");
    console.log("   Role: admin");
    
    return defaultAdmin;
  } catch (error) {
    console.error("❌ Error creating default admin user:", error.message);
    throw error;
  }
};

/**
 * Initialize all default users (faculty and admin)
 */
export const initializeDefaultUsers = async () => {
  try {
    console.log("🔄 Initializing default users...");
    await createDefaultFaculty();
    await createDefaultAdmin();
    console.log("✅ Default users initialization completed");
  } catch (error) {
    console.error("❌ Error initializing default users:", error.message);
    throw error;
  }
};
