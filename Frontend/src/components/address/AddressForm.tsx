import { useState, useEffect } from "react";
import type { Address } from "../../types";

interface AddressFormProps {
  initial?: Partial<Address>;
  onSubmit: (data: Omit<Address, "id">) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

export default function AddressForm({ initial, onSubmit, onCancel, submitLabel = "Save Address" }: AddressFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    phone: initial?.phone || "",
    street: initial?.street || "",
    city: initial?.city || "",
    state: initial?.state || "",
    pincode: initial?.pincode || "",
    type: initial?.type || ("Home" as Address["type"]),
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        phone: initial.phone || "",
        street: initial.street || "",
        city: initial.city || "",
        state: initial.state || "",
        pincode: initial.pincode || "",
        type: initial.type || "Home",
      });
    }
  }, [initial]);

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone.trim())) e.phone = "Enter valid 10-digit mobile number";
    if (!form.street.trim()) e.street = "Street address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state) e.state = "State is required";
    if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = "Enter valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, type: form.type as Address["type"] });
  };

  const Field = ({ label, field, type = "text", maxLength, placeholder }: {
    label: string; field: keyof typeof form; type?: string; maxLength?: number; placeholder?: string;
  }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-all ${
          errors[field]
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-gray-200 bg-gray-50 focus:border-[#2874f0] focus:bg-white"
        }`}
      />
      {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name *" field="name" placeholder="e.g. Ravi Kumar" />
        <Field label="Mobile Number *" field="phone" type="tel" maxLength={10} placeholder="10-digit mobile" />
      </div>

      <Field label="Street Address / Flat / Building *" field="street" placeholder="House No, Street, Landmark" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="City / Town *" field="city" placeholder="e.g. Mumbai" />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700">State *</label>
          <select
            value={form.state}
            onChange={(e) => handleChange("state", e.target.value)}
            className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-all ${
              errors.state
                ? "border-red-400 bg-red-50"
                : "border-gray-200 bg-gray-50 focus:border-[#2874f0] focus:bg-white"
            }`}
          >
            <option value="">Select State</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Pincode *" field="pincode" type="text" maxLength={6} placeholder="6-digit pincode" />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700">Address Type</label>
          <div className="flex gap-2">
            {(["Home", "Work", "Other"] as Address["type"][]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleChange("type", t)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg border-2 transition-all cursor-pointer ${
                  form.type === t
                    ? "border-[#2874f0] bg-blue-50 text-[#2874f0]"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 sm:flex-none bg-[#2874f0] hover:bg-[#1e65d8] text-white text-sm font-bold py-3 px-8 rounded-lg shadow-sm transition-all cursor-pointer"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 sm:flex-none border border-gray-200 text-gray-700 text-sm font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
