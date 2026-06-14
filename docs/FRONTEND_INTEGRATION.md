# Frontend Integration Guide: User Registration

This document provides everything you need to connect your frontend application (e.g., React, Vue, Vanilla JS) to the Go backend we just built.

## API Details

- **Endpoint**: `http://localhost:8080/api/register`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`

## Example 1: Using `fetch` (Standard JavaScript / React)

Here is a complete, reusable function you can use in your frontend code to submit the registration form.

```javascript
/**
 * Submits the registration payload to the Go backend.
 * 
 * @param {Object} userData - The exact JSON payload structure matching the backend.
 * @returns {Promise<Object>} - The JSON response from the server.
 */
async function registerUser(userData) {
  try {
    const response = await fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // The backend expects the data wrapped inside a "user" object
      body: JSON.stringify({ user: userData }),
    });

    // Check if the response status is 201 Created or 200 OK
    if (!response.ok) {
      // Extract the error message sent from the backend
      const errorText = await response.text();
      throw new Error(errorText || "Registration failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
}
```

### How to use it in your Component:

```javascript
// Example usage inside a form submit handler
async function handleFormSubmit(event) {
  event.preventDefault();

  // Construct the payload exactly as the backend expects it
  const payload = {
    firstName: "John",
    lastName: "Doe",
    username: "johndoe123",
    email: "john@example.com",
    password: "securepassword123",
    confirmPassword: "securepassword123",
    phoneNumber: "+1234567890",
    dateOfBirth: "1990-01-01",
    gender: "male",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA"
    },
    preferences: {
      newsletterSubscription: true,
      notifications: true
    },
    termsAccepted: true
  };

  try {
    const result = await registerUser(payload);
    alert(result.message); // "User registered successfully"
    // Redirect to login page or dashboard
  } catch (err) {
    alert("Error: " + err.message);
  }
}
```

## Example 2: Using `axios` (Alternative)

If your project uses Axios instead of Fetch, the code will look like this:

```javascript
import axios from 'axios';

async function registerUserAxios(userData) {
  try {
    const response = await axios.post("http://localhost:8080/api/register", {
      user: userData
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    return response.data;
  } catch (error) {
    // Axios wraps the error response inside error.response
    if (error.response) {
      throw new Error(error.response.data || "Registration failed");
    }
    throw error;
  }
}
```

## Handling CORS Issues

Since your frontend (e.g. Vite on port `5173`) and backend (Go on port `8080`) run on different ports, the browser will likely block requests due to CORS (Cross-Origin Resource Sharing).

If you run into CORS errors in your browser console, you have two options to fix it:

**Option 1: Add CORS in your Go Backend (Recommended)**
Install the Go CORS package: `go get github.com/rs/cors` and update `cmd/server/main.go` to use it.

**Option 2: Use Vite Proxy**
If you are using Vite, you can open `vite.config.js` and add a proxy to forward requests to the backend:

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```
If you use the proxy, you would change the URL in your `fetch` call from `"http://localhost:8080/api/register"` to just `"/api/register"`.
