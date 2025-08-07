import api from "./ticketAxiox";
export const getUserData = async () => {
  try {
    const response = await api.get("ticket/get-user-data");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const CreationGroup = async (formData) => {
  try {
    const response = await api.post("ticket/create-group", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getUserGroupCapabilities = async () => {
  try {
    const response = await api.get("ticket/user-group-capabilities");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getGroups = async () => {
  try {
    const response = await api.get("ticket/get-groups");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createTicketBasicInfo = async (formData) => {
  try {
    const response = await api.post(`ticket/create-event/${formData.groupId}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const updateTicketMedia = async (formData) => {
  try {
    const response = await api.post(`ticket/update-ticket-media/${formData.ticketId}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const updateTicketAddOns = async (formData) => {
  try {
    const response = await api.post("ticket/ticket-addons", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const updateTicketDetails = async (formData) => {
  try {
    const response = await api.post("ticket/update-ticket-details", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const updateTicketTerms = async (formData) => {
  try {
    const response = await api.post("ticket/ticket-terms", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const submitTicket = async (formData) => {
  try {
    const response = await api.post("ticket/submit-ticket", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const viewTickets = async () => {
  try {
    const response = await api.get("ticket/view-tickets");
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const getAllGroupTicketId = async () => {
  try {
    const response = await api.get("ticket/get-group-tickets");
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const getTicketById = async (ticketId) => {
  try {
    const response = await api.get(`ticket/get-ticket/${ticketId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const deleteTicket = async (ticketId) => {
  try {
    const response = await api.delete("ticket/delete-ticket", { data: { ticketId } });
    return response.data;
  } catch (error) {
    throw error;
  }
}
