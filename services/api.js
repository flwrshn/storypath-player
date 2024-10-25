// services/api.js

// services/api.js

const API_BASE_URL = "https://0b5ff8b0.uqcloud.net/api/";
const JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDE5MTEifQ.5Gg6bIS85s_MX_jKfE89a2_YJx19ZFQ_SP7t67Z4Bu0";
const USERNAME = "s4741911";

// Centralized API request function
async function apiRequest(endpoint, method = "GET", body = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${JWT_TOKEN}`,
  };

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify({ ...body, username: USERNAME }) }),
  };

  // Set "Prefer" header for POST and PATCH methods
  if (method === "POST" || method === "PATCH") {
    options.headers["Prefer"] = "return=representation";
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${response.statusText} - ${
          errorData.message || "Unknown error"
        }`
      );
    }

    // Handle empty responses (e.g., DELETE)
    if (response.status === 204) return;

    return response.json();
  } catch (error) {
    console.error("API Request Failed:", error.message);
    throw error;
  }
}

// API functions for projects
export const createProject = (project) =>
  apiRequest("project", "POST", project);
export const getProjects = () => apiRequest("project?is_published=eq.true");

// Get only published projects
export const getPublishedProjects = async () => {
  const projects = await getProjects();

  // Fetch participant count for each project
  const projectsWithParticipants = await Promise.all(
    projects.map(async (project) => {
      const participants = await apiRequest(
        `tracking?project_id=eq.${project.id}`
      );
      return {
        ...project,
        participantCount: participants.length,
      };
    })
  );

  return projectsWithParticipants;
};

export const getProject = (id) => apiRequest(`project?id=eq.${id}`);
export const updateProject = (id, updatedProject) =>
  apiRequest(`project?id=eq.${id}`, "PATCH", updatedProject);
export const deleteProject = (id) =>
  apiRequest(`project?id=eq.${id}`, "DELETE");

// API functions for locations
export const createLocation = (location) =>
  apiRequest("location", "POST", location);
export const getLocations = (projectId) =>
  apiRequest(`location?project_id=eq.${projectId}`);
export const getLocation = (id) => apiRequest(`location?id=eq.${id}`);
export const updateLocation = (id, updatedLocation) =>
  apiRequest(`location?id=eq.${id}`, "PATCH", updatedLocation);
export const deleteLocation = (id) =>
  apiRequest(`location?id=eq.${id}`, "DELETE");

// API functions for tracking
export const createTracking = (trackingData) =>
  apiRequest("tracking", "POST", trackingData);
export const getTrackings = (participantUsername) =>
  apiRequest(`tracking?participant_username=eq.${participantUsername}`);
export const getTracking = (id) => apiRequest(`tracking?id=eq.${id}`);
export const updateTracking = (id, updatedTrackingData) =>
  apiRequest(`tracking?id=eq.${id}`, "PATCH", updatedTrackingData);
export const deleteTracking = (id) =>
  apiRequest(`tracking?id=eq.${id}`, "DELETE");
