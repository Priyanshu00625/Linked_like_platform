import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connection.model.js";
const convertUserDataTOPDF = async (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);

  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.fontSize(14).text(`name : ${userData.userId.name}`);
  doc.fontSize(14).text(`username : ${userData.userId.username}`);
  doc.fontSize(14).text(`email : ${userData.userId.email}`);
  doc.fontSize(14).text(`bio: ${userData.bio}`);
  doc.fontSize(14).text(`current position : ${userData.currentPosition}`);
  doc.fontSize(14).text("past work :");

  userData.passWork.forEach((work, index) => {
    doc.fontSize(14).text(`Comapny name :${work.companyName}`);
    doc.fontSize(14).text(`Position :${work.position}`);
    doc.fontSize(14).text(`Years:${work.years}`);
  });
  doc.end();
  return outputPath;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({
      email,
    });
    if (user) return res.status(400).json({ message: "user Already Exists" });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      username,
    });

    await newUser.save();
    const profile = new Profile({ userId: newUser.id });
    await profile.save();
    return res.json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid cardentials" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user.id }, { token });
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profilePicture = req.file.path;
    await user.save();
    return res.json({ message: "profile picture updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const { username, email } = newUserData;

    const exitingUser = User.findone({ $or: [{ username }, { email }] });
    if (exitingUser) {
      if (exitingUser || String(exitingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "User already exits" });
      }
    }
    Object.assign(user, newUserData);
    await user.save();
    return res.json({ message: "User Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );
    return res.json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  } 
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    const userProfile = await User.findOne({ token });

    if (!userProfile) {
      return res.status(400).json({ message: "User not found" });
    }

    const profile_to_update = User.findOne({ userId: userProfile._id });
    Object.assign(profile_to_update, newProfileData);
    await profile_to_update.save();
    return res.json({ message: "Profile Update" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAlluserProfile = async (req, res) => {
  try {
    const profile = await Profile.find().populate(
      "userId",
      "name username email picture"
    );
    return res.json({ profile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const downloadProfile = async (req, res) => {
  const user_Id = req.query.id;
  const userProfile = await Profile.findOne({ userId: user_Id }).populate(
    "userId",
    "name username email profilePicture"
  );
  let outputPath = await convertUserDataTOPDF(userProfile);

  return res.json({ message: outputPath });
};

export const sendConnectRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "connection User not found" });
    }
    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    if (existingRequest) {
      res.status(400).json({ message: "connection allready sent" });
    }
    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionId._id,
    });
    await request.save();
    return res.json({ message: "request sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnectionRequest = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "user not found  " });
    }
    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");
    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnection = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture");
    return res.json({connections})
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
};

export const acceptConnectionRequest = async(req, res)=>{

  const {token , requestId , action_type} = req.body ;
  try {
    const user = await User.findOne({token});
    if (!user) {
      return res.status(404).json({message:"user not found"});
    }
    const connection = await ConnectionRequest.findOne({_id:requestId});
    if (!connection) {
      return res.status(404).json({message:"connection not found"});
    }
    if (action_type === "accept") {
      connection.status_accepted = true;
    }else{
      connection.status_accepted = false;
    }
    await connection.save();
    return res.json({message:"request Updated"});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}