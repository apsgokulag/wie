// D:\DEVELOP\wie\server\services\ticket-service\src\services\ticket.service.js

import Group from "../models/group.model.js";
import Ticket from "../models/ticket.model.js";
import { getUserFromAuthService } from "../rabbit/consumerConnections.js";
export const CreateGroup = async (req, res) => {
  try {
    console.log("User from token:", req.user); // Debug log
    
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role; // 'admin' or 'organisation'

    // Validate user role
    if (!['admin', 'organisation'].includes(userRole)) {
      return res.status(400).json({ message: "Invalid user role" });
    }
    // Optional: Get additional user details from auth-service if needed
    // const userData = await getUserFromAuthService(userId);
    // if (!userData) {
    //   return res.status(404).json({ message: "User not found in auth service" });
    // }
    const {
      name,
      email,
      contact_no,
      address,
      gst_no,
      pan_no,
      id_proof,
      bank_check,
      company_certificate,
      company_logo,
      organisation_type,
      grp_type // This will be sent from frontend based on admin's choice
    } = req.body;

    console.log("Request body:", req.body); // Debug log

    // Validate required fields
    if (!name || !email || !contact_no || !pan_no || !id_proof) {
      return res.status(400).json({ 
        message: "Missing required fields: name, email, contact_no, pan_no, id_proof" 
      });
    }

    // Determine the actual group type
    let actualGroupType;
    
    if (userRole === 'admin') {
      // Admin can create both types, so use the grp_type from request
      if (!grp_type || !['admin', 'organisation'].includes(grp_type)) {
        return res.status(400).json({ 
          message: "Admin must specify group type (admin or organisation)" 
        });
      }
      actualGroupType = grp_type;
    } else if (userRole === 'organisation') {
      // Organisation can only create organisation groups
      actualGroupType = 'organisation';
    }

    // Validate required fields based on group type
    if (actualGroupType === 'organisation') {
      if (!organisation_type) {
        return res.status(400).json({ 
          message: "Organisation type is required for organisation groups" 
        });
      }
      if (!address) {
        return res.status(400).json({ 
          message: "Address is required for organisation groups" 
        });
      }
    }

    // Build group data
    const groupData = {
      name,
      email,
      contact_no,
      pan_no,
      id_proof,
      userId :userId,
      grp_type: actualGroupType,
    };

    // Add optional fields
    if (gst_no) groupData.gst_no = gst_no;
    if (bank_check) groupData.bank_check = bank_check;

    // Add organisation-specific fields if needed
    if (actualGroupType === 'organisation') {
      groupData.address = address;
      groupData.organisation_type = organisation_type;
      if (company_certificate) groupData.company_certificate = company_certificate;
      if (company_logo) groupData.company_logo = company_logo;
    }

    console.log("Group data to save:", groupData); // Debug log

    // Create and save the group
    const newGroup = new Group(groupData);
    await newGroup.save();

    res.status(201).json({ 
      message: "Group created successfully", 
      group: newGroup 
    });

  } catch (error) {
    console.error("Error creating group:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation error", 
        errors: messages 
      });
    }
    
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to get user capabilities for frontend
export const getUserGroupCapabilities = async (req, res) => {
  try {
    const userRole = req.user.role;
    
    const capabilities = {
      canCreateAdminGroup: userRole === 'admin',
      canCreateOrgGroup: true, // Both admin and organisation can create org groups
      userRole: userRole,
      showGroupTypeRadio: userRole === 'admin' // Only show radio button for admin
    };
    
    res.status(200).json(capabilities);
  } catch (error) {
    console.error("Error getting user capabilities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('userId', 'name email');
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, groupId } = req.body;
    const userId = req.user._id;

    const newEvent = new Ticket({
      title,
      description,
      date,
      groupId,
      userId,
    });
    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const getEvents = async (req, res) => {
  try {
    const events = await Ticket.find().populate('userId', 'name email');
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}