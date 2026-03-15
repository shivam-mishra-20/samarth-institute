import { useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase.config";

export default function SetupUsers() {
  const [users, setUsers] = useState([
    { email: "", uid: "", role: "student", name: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const addUserRow = () => {
    setUsers([...users, { email: "", uid: "", role: "student", name: "" }]);
  };

  const removeUserRow = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const updateUser = (index, field, value) => {
    const newUsers = [...users];
    newUsers[index][field] = value;
    setUsers(newUsers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let created = 0;
      let skipped = 0;
      let errors = 0;

      for (const user of users) {
        if (!user.uid || !user.email || !user.name) {
          errors++;
          continue;
        }

        try {
          // Check if document already exists
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            skipped++;
            continue;
          }

          // Create user document
          await setDoc(docRef, {
            uid: user.uid,
            email: user.email,
            role: user.role,
            name: user.name,
            createdAt: new Date().toISOString(),
            passwordResetRequired: false,
          });
          created++;
        } catch (error) {
          console.error(`Error creating user ${user.email}:`, error);
          errors++;
        }
      }

      setMessage(
        `✅ Created: ${created} | ⏭️ Skipped (already exists): ${skipped} | ❌ Errors: ${errors}`,
      );
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Setup Firestore User Documents
          </h1>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700 font-semibold">⚠️ Instructions:</p>
            <ol className="list-decimal list-inside text-yellow-700 mt-2 space-y-1">
              <li>Go to Firebase Console → Authentication → Users</li>
              <li>
                Copy each user's <strong>User UID</strong> and{" "}
                <strong>Email</strong>
              </li>
              <li>
                Paste them below and add their <strong>Name</strong> and{" "}
                <strong>Role</strong>
              </li>
              <li>Click "Create User Documents"</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-start border-b pb-4"
                >
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User UID *
                    </label>
                    <input
                      type="text"
                      value={user.uid}
                      onChange={(e) => updateUser(index, "uid", e.target.value)}
                      placeholder="From Firebase Auth"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        updateUser(index, "email", e.target.value)
                      }
                      placeholder="user@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) =>
                        updateUser(index, "name", e.target.value)
                      }
                      placeholder="Full Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateUser(index, "role", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="col-span-2 flex items-end">
                    <button
                      type="button"
                      onClick={() => removeUserRow(index)}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      disabled={users.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={addUserRow}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                + Add Another User
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
              >
                {loading ? "Creating..." : "Create User Documents"}
              </button>
            </div>
          </form>

          {message && (
            <div
              className={`mt-6 p-4 rounded-md ${
                message.includes("Error")
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="mt-8 bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">📝 Notes:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>
                This page only creates Firestore documents. It does NOT create
                Authentication accounts.
              </li>
              <li>Users must already exist in Firebase Authentication.</li>
              <li>If a document already exists, it will be skipped.</li>
              <li>
                After setup, users can login normally with their existing
                credentials.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
