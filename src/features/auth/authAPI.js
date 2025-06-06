const API_URL = "http://localhost:8080/api";

export const authAPI = {
    async register(userData) {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to register");
        }
        return await response.json();
    },

    async login(credentials) {
        const response = await fetch(`${API_URL}/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            // Try to get error message from response
            let errorMsg = "Login failed";
            try {
                const errorData = await response.json();
                errorMsg = errorData.error || errorMsg;
            } catch (e) {
                console.error("Error parsing error response:", e);
            }
            throw new Error(errorMsg);
        }

        return await response.json();
    },

    async updateProfile(userId, updates, token) {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to update profile");
        }
        return await response.json();
    },

    async getProfile(email) {
        const response = await fetch(`${API_URL}/profile?email=${email}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to fetch profile");
        }
        return await response.json();
    },
};