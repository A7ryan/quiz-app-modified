import { useEffect, useState } from "react";
import { fetchUserProfile, updateUserProfile } from "../api/userApi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          phone: data.user.phone || "",
          gender: data.user.gender || "",
          address: data.user.address || "",
          picture: data.user.picture || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateUserProfile(formData);
      setUser(updated.user);
      setIsEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile");
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {!isEditing ? (
        // 🔹 View mode
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || "Not set"}</p>
          <p><strong>Gender:</strong> {user.gender || "Not set"}</p>
          <p><strong>Address:</strong> {user.address || "Not set"}</p>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      ) : (
        // 🔹 Edit mode
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded p-2"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full border rounded p-2"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-medium">Gender</label>
            <select
              name="gender"
              className="w-full border rounded p-2"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Address</label>
            <input
              type="text"
              name="address"
              className="w-full border rounded p-2"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
