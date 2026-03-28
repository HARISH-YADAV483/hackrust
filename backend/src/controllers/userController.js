import User from "../models/User.js";

// GET PROFILE
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json(user);
};

// UPDATE PROFILE PIC
export const updateProfilePic = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
   user.profilePic = req.file.filename;// image path

    const updatedUser = await user.save();

    res.json(updatedUser);
  }
};