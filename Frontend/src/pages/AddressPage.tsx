import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, MapPin } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import EmptyState from "../components/common/EmptyState";
import AddressCard from "../components/address/AddressCard";
import AddressForm from "../components/address/AddressForm";
import AccountSidebar from "../components/account/AccountSidebar";
import { useAddress } from "../context/AddressContext";
import { useAuth } from "../context/AuthContext";
import type { Address } from "../types";

export default function AddressPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addresses, defaultAddressId, addAddress, updateAddress, deleteAddress, setDefault } = useAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Redirect to login     if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20 px-6 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-[#2874f0]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Login to manage addresses</h2>
            <p className="text-xs text-gray-500 mb-5">
              Please login to view and set your delivery locations.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#2874f0] hover:bg-[#1e65d8] text-white text-xs font-bold py-2.5 rounded shadow-sm transition-all cursor-pointer"
            >
              Login Now
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAdd = (data: Omit<Address, "id">) => {
    addAddress(data);
    setShowForm(false);
  };

  const handleUpdate = (data: Omit<Address, "id">) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, data);
      setEditingAddress(null);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Header />

      <main className="max-w-[1440px] mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex-1">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-3 sm:mb-4 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#2874f0]">Home</Link>
          <span>›</span>
          <Link to="/profile" className="hover:text-[#2874f0]">My Account</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Manage Addresses</span>
        </div>

        {/* 2-Column Flipkart My Account Layout */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Left Sidebar *  /}
          <AccountSidebar activeTab="addresses" />

          {/* Right Main Content */}
          <div className="flex-1 w-full bg-white rounded-lg shadow-xs border border-gray-100 p-4 sm:p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h1 className="text-base font-bold text-gray-900">
                Manage Addresses ({addresses.length})
              </h1>

              {!showForm && !editingAddress && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 bg-[#2874f0] hover:bg-[#1e65d8] text-white text-xs font-bold px-3.5 py-2 rounded shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD A NEW ADDRESS</span>
                </button>
              )}
            </div>

            {/* Add New Address Form */}
            {showForm && (
              <div className="bg-blue-50/40 border border-blue-100 rounded-lg p-4 sm:p-5">
                <h2 className="text-sm font-bold text-[#2874f0] mb-3 uppercase tracking-wider">
                  Add a New Address
                </h2>
                <AddressForm
                  onSubmit={handleAdd}
                  onCancel={() => setShowForm(false)}
                  submitLabel="SAVE AND DELIVER HERE"
                />
              </div>
            )}

            {/* Edit Address Form */}
            {editingAddress && (
              <div className="bg-amber-50/40 border border-amber-200 rounded-lg p-4 sm:p-5">
                <h2 className="text-sm font-bold text-amber-800 mb-3 uppercase tracking-wider">
                  Edit Address
                </h2>

                <AddressForm
                  initial={editingAddress}
                  onSubmit={handleUpdate}
                  onCancel={handleCancelEdit}
                  submitLabel="UPDATE ADDRESS"
                />
              </div>
            )}

            {/* Address List */}
            {addresses.length === 0 && !showForm ? (
              <div className="py-12 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-8 h-8 text-[#2874f0]" />
                </div>
                <h2 className="text-base font-bold text-gray-900 mb-1">No addresses found</h2>
                <p className="text-xs text-gray-500 mb-4">
                  Add a delivery address to set your location and enable 1-click checkout.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[#2874f0] text-white text-xs font-bold px-5 py-2.5 rounded shadow-xs cursor-pointer"
                >
                  + Add Address Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isDefault={address.id === defaultAddressId}
                    onEdit={handleEdit}
                    onDelete={deleteAddress}
                    onSetDefault={setDefault}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
