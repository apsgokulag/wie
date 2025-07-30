import api from "./ticketAxiox";

export const CreationGroup = async (formData) => {
  try {
    const response = await api.post("ticket/create-group", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getUserGroupCapabilities = async () => {
  try {
    const response = await api.get("ticket/user-group-capabilities");
    console.log("User group capabilities:", response.data); // Debug log
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