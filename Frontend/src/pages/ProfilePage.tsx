import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Edit3, Check, Shield } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AccountSidebar from "../components/account/AccountSidebar";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [editPersonal, setEditPersonal] = useState(false);
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ").slice(1).join(" ") || "");
  const [gender, setGender] = useState<"male" | "female">("male");

  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState(user?.email || "");

  const [editMobile, setEditMobile] = useState(false);
  const [mobile, setMobile] = useState(user?.mobile || "+91 9876543210");

  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center py-20 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-blue-50 mx-auto flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-[#2874f0]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Please log in</h2>
            <p className="text-gray-500 text-xs mb-5">Login to view and manage your profile details</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#2874f0] text-white font-bold py-2.5 rounded shadow-sm hover:bg-[#1e65d8] transition-colors text-xs cursor-pointer"
            >
              Login / Sign Up
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSavePersonal = () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (updateUser) {
      updateUser({ name: fullName });
    }
    setEditPersonal(false);
    setSaveSuccess("Personal Information updated successfully!");
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleSaveEmail = () => {
    if (updateUser) {
      updateUser({ email });
    }
    setEditEmail(false);
    setSaveSuccess("Email Address updated successfully!");
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleSaveMobile = () => {
    if (updateUser) {
      updateUser({ mobile });
    }
    setEditMobile(false);
    setSaveSuccess("Mobile Number updated successfully!");
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Header />

      <main className="max-w-[1440px] mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex-1 font-sans">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-3 sm:mb-4 flex items-center gap-1.5">
          <button onClick={() => navigate("/")} className="hover:text-[#2874f0] cursor-pointer">Home</button>
          <span>›</span>
          <span className="text-gray-900 font-medium">My Account</span>
          <span>›</span>
          <span className="text-gray-900 font-medium">Profile Information</span>
        </div>

        {/* 2-Column Flipkart My Account Layout */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Left Sidebar */}
          <AccountSidebar activeTab="profile" />

          {/* Right Main Content */}
          <div className="flex-1 w-full bg-white rounded-lg shadow-xs border border-gray-100 p-5 sm:p-8 space-y-6">
            {saveSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 text-[#388e3c] text-xs font-semibold rounded flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{saveSuccess}</span>
              </div>
            )}

            {/* SECTION 1: Personal Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-gray-900">Personal Information</h2>
                {!editPersonal ? (
                  <button
                    onClick={() => setEditPersonal(true)}
                    className="text-xs font-bold text-[#2874f0] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setEditPersonal(false)}
                    className="text-xs font-bold text-gray-500 hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">First Name</label>
                  <input
                    type="text"
                    disabled={!editPersonal}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded border transition-colors ${
                      editPersonal
                        ? "border-[#2874f0] bg-white focus:outline-hidden"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                  <input
                    type="text"
                    disabled={!editPersonal}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded border transition-colors ${
                      editPersonal
                        ? "border-[#2874f0] bg-white focus:outline-hidden"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  />
                </div>
              </div>

              {/* Your Gender */}
              <div className="pt-2">
                <label className="block text-xs text-gray-500 mb-2">Your Gender</label>
                <div className="flex items-center gap-6 text-xs text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "male"}
                      onChange={() => editPersonal && setGender("male")}
                      disabled={!editPersonal}
                      className="text-[#2874f0] focus:ring-[#2874f0]"
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "female"}
                      onChange={() => editPersonal && setGender("female")}
                      disabled={!editPersonal}
                      className="text-[#2874f0] focus:ring-[#2874f0]"
                    />
                    <span>Female</span>
                  </label>
                </div>
              </div>

              {editPersonal && (
                <div className="pt-2">
                  <button
                    onClick={handleSavePersonal}
                    className="bg-[#2874f0] hover:bg-[#1e65d8] text-white text-xs font-bold py-2.5 px-6 rounded shadow-xs cursor-pointer"
                  >
                    SAVE
                  </button>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* SECTION 2: Email Address */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-gray-900">Email Address</h2>
                {!editEmail ? (
                  <button
                    onClick={() => setEditEmail(true)}
                    className="text-xs font-bold text-[#2874f0] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setEditEmail(false)}
                    className="text-xs font-bold text-gray-500 hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="max-w-sm">
                <input
                  type="email"
                  disabled={!editEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded border transition-colors ${
                    editEmail
                      ? "border-[#2874f0] bg-white focus:outline-hidden"
                      : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                />
              </div>

              {editEmail && (
                <div className="pt-1">
                  <button
                    onClick={handleSaveEmail}
                    className="bg-[#2874f0] hover:bg-[#1e65d8] text-white text-xs font-bold py-2.5 px-6 rounded shadow-xs cursor-pointer"
                  >
                    SAVE
                  </button>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* SECTION 3: Mobile Number */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-gray-900">Mobile Number</h2>
                {!editMobile ? (
                  <button
                    onClick={() => setEditMobile(true)}
                    className="text-xs font-bold text-[#2874f0] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setEditMobile(false)}
                    className="text-xs font-bold text-gray-500 hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="max-w-sm">
                <input
                  type="tel"
                  disabled={!editMobile}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded border transition-colors ${
                    editMobile
                      ? "border-[#2874f0] bg-white focus:outline-hidden"
                      : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                />
              </div>

              {editMobile && (
                <div className="pt-1">
                  <button
                    onClick={handleSaveMobile}
                    className="bg-[#2874f0] hover:bg-[#1e65d8] text-white text-xs font-bold py-2.5 px-6 rounded shadow-xs cursor-pointer"
                  >
                    SAVE
                  </button>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* SECTION 4: FAQs (Flipkart standard) */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-gray-900">FAQs</h3>
              <div className="space-y-3 text-xs text-gray-600">
                <div>
                  <p className="font-bold text-gray-800 mb-0.5">
                    What happens when I update my email address (or mobile number)?
                  </p>
                  <p className="leading-relaxed">
                    Your login email id (or mobile number) changes, likewise. You'll receive all your account updates and order confirmations on your updated contact details.
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-800 mb-0.5">
                    When will my ShopZone account be updated with the new email address (or mobile number)?
                  </p>
                  <p className="leading-relaxed">
                    It happens as soon as you confirm the verification code sent to your new email or mobile number.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 5: Deactivate Account */}
            <div className="pt-4">
              <button
                onClick={() => alert("Account deactivation request submitted. Our team will contact you shortly.")}
                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
