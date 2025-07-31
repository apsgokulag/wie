// D:\DEVELOP\wie\server\services\ticket-service\src\services\ticket.service.js

import User from "../../../auth-service/src/models/user.model.js";
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
    //   return res.status(404).json({ message: "User not found in auth service" });
    // }
    const {
      name,
      email,
      contact_no,
      address,
      gst_no,
      pan_no,
      id_proof,
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
      status: 'active',
    };
    // Add optional fields
    if (gst_no) groupData.gst_no = gst_no;
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
    const userId = req.user._id || req.user.id;
    const capabilities = {
      canCreateAdminGroup: userRole === 'admin',
      canCreateOrgGroup: true, // Both admin and organisation can create org groups
      userId: userId,
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
    const userId = req.user._id || req.user.id;
    const groups = await Group.find({ userId: userId });
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTicketBasicInfo = async (req, res) => {
  try {
    const { 
      event_name, 
      event_category, 
      event_subcategory,
      event_type,
      location, 
      venue,
      exact_map_location,
      event_date_type,
      start_date,
      end_date,
      start_time,
      end_time,
      event_description,
      guests,
      groupId 
    } = req.body;

    const userId = req.user._id || req.user.id;
    // Validate required fields
    if (!event_name || !event_category || !location || !venue || !start_date || !start_time || !event_description || !groupId) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["event_name", "event_category", "location", "venue", "start_date", "start_time", "event_description", "groupId"]
      });
    }

    // Create new ticket with basic information
    const newTicket = new Ticket({
      event_name,
      event_category,
      event_subcategory,
      event_type,
      location,
      venue,
      exact_map_location,
      event_date_type,
      start_date,
      end_date,
      start_time,
      end_time,
      event_description,
      guests: guests || [],
      groupId,
      userId: userId,
      form_progress: {
        basic_info: true,
        media: false,
        add_on_events: false,
        banking_tickets: false,
        terms_conditions: false,
      }
    });

    await newTicket.save();
    res.status(201).json({ 
      message: "Ticket basic information saved successfully", 
      ticket: newTicket,
      ticketId: newTicket._id,
      userId: userId,
      groupId: groupId
    });
  } catch (error) {
    console.error("Error creating ticket basic info:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateTicketMedia = async (req, res) => {
  try {
    // Fix: Extract ticketId from req.body, not assign entire req.body
    const { ticketId, event_logo, event_banner, event_images } = req.body;
    // Validate required parameters
    if (!ticketId) {
      return res.status(400).json({ 
        message: "Missing required parameters",
        required: "ticketId"
      });
    }
    // Validate event images limit
    if (event_images && event_images.length > 10) {
      return res.status(400).json({ message: "Maximum 10 images allowed for event" });
    }
    const userId = req.user._id || req.user.id;
    // Find and update the ticket
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId }, // Now ticketId is a string, not an object
      {
        event_logo,
        event_banner,
        event_images: event_images || [],
        'form_progress.media': true,
        updated_by: userId,
        updated_at: new Date()
      },
      { new: true }
    );
    console.log("Updated ticket:", updatedTicket); // Debug log
    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found or unauthorized" });
    }
    // Remove this line - findOneAndUpdate already saves the document
    // await updatedTicket.save();
    res.status(200).json({ 
      message: "Ticket media updated successfully", 
      ticket: updatedTicket,
      ticketId: ticketId,
    });

  } catch (error) {
    console.error("Error updating ticket media:", error);
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid ticket ID format. Please provide a valid MongoDB ObjectId." 
      });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateTicketAddOns = async (req, res) => {
  try {
    const { 
      ticketId,
      sub_events, 
      banking_details, 
      payment_type,
      hashtag 
    } = req.body;
    // Validate required parameters
    if (!ticketId) {
      return res.status(400).json({ 
        message: "Missing required parameters",
        required: ["ticketId"]
      });
    }
    const userId = req.user._id || req.user.id;
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId },
      {
        sub_events: sub_events || [],
        banking_details: banking_details || [],
        payment_type: payment_type || 'free',
        hashtag: hashtag || [],
        'form_progress.add_on_events': true,
        'form_progress.banking_tickets': true,
        updated_by: userId,
        updated_at: new Date()
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found or unauthorized" });
    }

    res.status(200).json({ 
      message: "Ticket add-on events and banking details updated successfully", 
      ticket: updatedTicket,
      ticketId: ticketId,
      userId: userId,
    });
  } catch (error) {
    console.error("Error updating ticket add-ons:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateTicketDetails = async (req, res) => {
  try {
    const { 
      ticketId,
      ticket_types, 
      guides
    } = req.body;

    // Validate required parameters
    if (!ticketId) {
      return res.status(400).json({ 
        message: "Missing required parameters",
        required: ["ticketId"]
      });
    }
    const userId = req.user._id || req.user.id;
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId},
      {
        ticket_types: ticket_types || [],
        guides: guides || [],
        'form_progress.banking_tickets': true,
        updated_by: userId,
        updated_at: new Date()
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found or unauthorized" });
    }

    res.status(200).json({ 
      message: "Ticket details updated successfully", 
      ticket: updatedTicket,
      ticketId: ticketId,
      userId: userId,
    });
  } catch (error) {
    console.error("Error updating ticket details:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Step 5: Update Ticket - Terms & Conditions (Company Provided)
export const updateTicketTerms = async (req, res) => {
  try {
    const { ticketId, terms_accepted, company_terms_version } = req.body;
    // Validate required parameters
    if (!ticketId) {
      return res.status(400).json({ 
        message: "Missing required parameters",
        required: ["ticketId"]
      });
    }
    if (!terms_accepted) {
      return res.status(400).json({ message: "Company terms and conditions must be accepted" });
    }
    const userId = req.user._id || req.user.id;
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId},
      {
        terms_accepted: true,
        terms_accepted_at: new Date(),
        company_terms_version: company_terms_version || '1.0',
        'form_progress.terms_conditions': true,
        updated_by: userId,
        updated_at: new Date()
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found or unauthorized" });
    }

    res.status(200).json({ 
      message: "Company terms and conditions accepted successfully", 
      ticket: updatedTicket,
      ticketId: ticketId,
      userId: userId,
    });
  } catch (error) {
    console.error("Error updating ticket terms:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Step 6: Final Preview and Submit Ticket
export const submitTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;
    // Validate required parameters
    if (!ticketId) {
      return res.status(400).json({ 
        message: "Missing required parameters",
        required: ["ticketId"]
      });
    }
    // Find ticket without populate since User model is in another service
    const ticket = await Ticket.findOne({ _id: ticketId });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found or unauthorized" });
    }
    // Check if all form steps are completed
    const { form_progress } = ticket;
    const allStepsCompleted = Object.values(form_progress).every(step => step === true);
    if (!allStepsCompleted) {
      return res.status(400).json({ 
        message: "Please complete all form steps before submitting",
        form_progress 
      });
    }
    if (!ticket.terms_accepted) {
      return res.status(400).json({ message: "Company terms and conditions must be accepted" });
    }
    const userId = req.user._id || req.user.id;
    // Update ticket to confirmed status
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId },
      {
        event_status: 'confirmed',
        updated_by: userId,
        updated_at: new Date()
      },
      { new: true }
    );
    res.status(200).json({ 
      message: "Ticket submitted successfully", 
      ticket: updatedTicket,
      ticketId: ticketId,
      userId: userId,
    });
  } catch (error) {
    console.error("Error submitting ticket:", error);
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid ticket ID format. Please provide a valid MongoDB ObjectId." 
      });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get Ticket by ID (for fetching ticket data in any step)
export const getAllTicketId = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const groupId = req.body.groupId;
    // Validate required parameters
    if (!userId || !groupId) {
      return res.status(400).json({
        message: "Missing required parameters",
        required: ["userId", "groupId"]
      });
    }
    const tickets = await Ticket.find({ userId: userId, groupId: groupId }).sort({ createdAt: -1 });
    res.status(200).json({
      tickets,
      count: tickets.length,
      userId: userId,
      groupId: groupId
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    // Get ticketId from URL parameter
    const { ticketId } = req.params;
    // Validate required parameters
    if (!ticketId) {
      return res.status(400).json({
        message: "Missing required parameter: ticketId in URL"
      });
    }
    // Find ticket by ID and groupId
    const ticket = await Ticket.findOne({ 
      _id: ticketId, 
    });
    if (!ticket) {
      return res.status(404).json({ 
        message: "Ticket not found or you don't have access to this ticket" 
      });
    }
    res.status(200).json({ 
      message: "Ticket retrieved successfully",
      ticket,
      ticketId: ticketId,
      userId: userId,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid ticket ID format. Please provide a valid MongoDB ObjectId." 
      });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Delete Ticket
export const deleteTicket = async (req, res) => {
  try {
    const { ticketId, groupId } = req.body;
    // Validate required parameters
    if (!ticketId || !groupId) {
      return res.status(400).json({ 
        message: "Missing required parameters",
        required: ["ticketId", "groupId"]
      });
    }
    const deletedTicket = await Ticket.findOneAndDelete({ 
      _id: ticketId, 
      groupId: groupId 
    });

    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found or unauthorized" });
    }
    res.status(200).json({ 
      message: "Ticket deleted successfully",
      ticketId: ticketId,
      groupId: groupId
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};