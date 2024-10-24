// services/api.js

const API_BASE_URL = "https://0b5ff8b0.uqcloud.net/api/";
const JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDE5MTEifQ.5Gg6bIS85s_MX_jKfE89a2_YJx19ZFQ_SP7t67Z4Bu0";
const USERNAME = "s4741911";

// Helper function to handle API requests
async function apiRequest(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
  };

  if (method === "POST" || method === "PATCH") {
    options.headers["Prefer"] = "return=representation";
  }

  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Project API functions
export async function createProject(project) {
  return apiRequest("project", "POST", project);
}

export async function getProjects() {
  return apiRequest("project");
}

export async function getProject(id) {
  return apiRequest(`project?id=eq.${id}`);
}

export async function deleteProject(id) {
  const response = await fetch(`${API_BASE_URL}project?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
  });

  if (response.ok) {
    return;
  }

  throw new Error(`HTTP error! status: ${response.status}`);
}

export async function updateProject(id, updatedProject) {
  const response = await fetch(`${API_BASE_URL}project?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT_TOKEN}`,
      Prefer: "return=representation", // Ensures the updated project is returned in the response
    },
    body: JSON.stringify({ ...updatedProject, username: USERNAME }),
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error(
      `Failed to update project. HTTP status: ${response.status}`
    );
  }
}

// Location API functions
export async function createLocation(locationData) {
  return apiRequest("location", "POST", locationData);
}

export async function getLocations(projectId) {
  return apiRequest(`location?project_id=eq.${projectId}`);
}

export async function getLocation(id) {
  return apiRequest(`location?id=eq.${id}`);
}

export async function deleteLocation(id) {
  const response = await fetch(`${API_BASE_URL}location?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
  });

  if (response.ok) {
    return;
  }

  throw new Error(`HTTP error! status: ${response.status}`);
}

export async function updateLocation(id, updatedLocation) {
  const response = await fetch(`${API_BASE_URL}location?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT_TOKEN}`,
      Prefer: "return=representation", // Ensures the updated location is returned in the response
    },
    body: JSON.stringify({ ...updatedLocation, username: USERNAME }),
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error(
      `Failed to update location. HTTP status: ${response.status}`
    );
  }
}

// Tracking API functions
export async function createTracking(trackingData) {
  return apiRequest("tracking", "POST", trackingData);
}

export async function getTrackings(participantUsername) {
  return apiRequest(`tracking?participant_username=eq.${participantUsername}`);
}

export async function getTracking(id) {
  return apiRequest(`tracking?id=eq.${id}`);
}

export async function updateTracking(id, updatedTrackingData) {
  const response = await fetch(`${API_BASE_URL}tracking?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT_TOKEN}`,
      Prefer: "return=representation", // Ensures the updated tracking is returned in the response
    },
    body: JSON.stringify({
      ...updatedTrackingData,
      username: USERNAME,
    }),
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error(
      `Failed to update tracking. HTTP status: ${response.status}`
    );
  }
}

export async function deleteTracking(id) {
  const response = await fetch(`${API_BASE_URL}tracking?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
  });

  if (response.ok) {
    return;
  }

  throw new Error(`Failed to delete tracking. HTTP status: ${response.status}`);
}
