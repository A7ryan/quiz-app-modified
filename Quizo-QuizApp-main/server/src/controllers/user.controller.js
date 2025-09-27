import { User } from "../models/user.model.js";

// View profile
const UserViewProfileController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile fetched successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        picture: user.picture,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update profile (only phone, gender, address, name allowed — NOT email)
const UserUpdateProfileController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone, gender, address, picture } = req.body;

    const allowedUpdates = { name, phone, gender, address, picture };

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email, // email stays fixed
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        picture: user.picture,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { UserViewProfileController, UserUpdateProfileController };
