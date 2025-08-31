const API_URL = "http://localhost:5000/api/users"; // backend URL

// Register new user
export const registerUser = async (name: string, email: string, password: string) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) throw new Error("Failed to register user");

  return res.json();
};

// Get all users
export const getUsers = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};
