const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/userModel');

const createUser = async (req, res) => {
    const {name, email, mobile, profilePicture, password} = req.body;

    if(!name){
        return res.status(400).json({message: "Please Provide Valid Name"});
    }
    if(!email){
        return res.status(400).json({message: "Please Provide Valid Email"});
    }
    if(!mobile){
        return res.status(400).json({message: "Please Provide Valid Phone Number"});
    }
    if(!password){
        return res.status(400).json({message: "Please Provide Valid Passwordd"})
    }

    const oldDetails = await User.findOne({email: email});

    if(oldDetails){
        return res.status(400).json({message: "User Already Exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name: name,
        email: email,
        mobile: mobile,
        profilePicture: profilePicture !== "" ? profilePicture : "",
        password: hashedPassword
    }); 

    try {
        await newUser.save();
        res.status(200).json({message: 'User Created Successfully.'});
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error});
    }

}

const updateUser = async (req, res) => {
    const {userId} = req.params;
    const updatedData = req.body;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        return res.status(400).send({message: 'Invalid User ID.'});
    }

    try {
      const updateUserId = new mongoose.Types.ObjectId(userId);
      
      const updatedUser = await User.findOneAndUpdate(
        {userId: updateUserId},
        {$set: updatedData},
        {new: true}
      );

      if(updatedUser){
        res.status(200).json({message: `User with UserId: ${userId} updated successfully.`});
      } else {
        res.status(404).json({message: 'UserId Not Found or Updated Data Error.'});
      }
    } catch (error) {
        res.status(500).json({message: 'Server Error, failed to update user', error: error});
    }
}

const deleteUser = async (req, res) => {
    const {userIds} = req.body;

    if(!userIds || !Array.isArray(userIds) || userIds.length === 0){
        return res.status(400).json({message: "Please provide a valid taskId to proceed."});
    }

    try {
        const deletedUsers = await User.deleteMany({userId: {$in: userIds}});

        if(deletedUsers.deletedCount > 0){
            res.status(200).json({message: `${deletedUsers.deletedCount} users deleted successfully.`});
        } else {
            res.status(404).json({message: 'Failed to Delete the Users.'});
        }
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error});
    }
}

const getUser = async (req, res) => {
    const userID = req.params.userId;

    try {
        const reqUserID = new mongoose.Types.ObjectId(userID);

        const response = await User.find({userId: reqUserID});

        if(response.length !== 0){
            res.status(200).json({message: `User with userId: ${userID} generated successfully`, data: response});
        } else {
            res.status(404).json({message: "Error generating the required data."});
        }
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error});
    }
}

const getAllUsers = async (req, res) => {
    try {
        const getAllData = await User.find({});

        if(getAllData){
            res.status(200).json({message: "All Data Generated Successfully.", data: getAllData});
        } else {
            res.status(404).json({message: "Error: No Data Generated"});
        }
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error});
    }
}

module.exports = {createUser, updateUser, deleteUser, getUser, getAllUsers};