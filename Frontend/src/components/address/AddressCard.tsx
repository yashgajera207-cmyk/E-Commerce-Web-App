import { useState } from "react";
import { MapPin, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import type { Address } from "../../types";

interface AddressCardProps {
  address: Address;
  isDefault: boolean;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (address: Address) => void;
}

export default function AddressCard({
  address,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
  selectable,
  selected,
  onSelect,
}: AddressCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(address.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div
      className={`relative bg-white rounded-xl border-2 transition-all duration-200 p-5 ${
        selected
          ? "border-[#2874f0] shadow-md shadow-blue-100"
          : isDefault
          ? "border-[#2874f0]/30"
          : "border-gray-100 hover:border-gray-200"
      } ${selectable ? "cursor-pointer hover:shadow-md" : ""}`}
      onClick={() => selectable && onSelect?.(address)}
    >
      {/* Selected indicator */}
      {selected && (
        <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-[#2874f0]" />
      )}

      {/* Type badge */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-[#2874f0] shrink-0" />
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          address.type === "Home"
            ? "bg-blue-50 text-blue-700"
            : address.type === "Work"
            ? "bg-green-50 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}>
          {address.type}
        </span>
        {isDefault && (
          <span className="text-xs font-semibold text-[#388e3c] bg-green-50 px-2 py-0.5 rounded-full">
            Default
          </span>
        )}
      </div>

      {/* Address details */}
      <div className="ml-6">
        <p className="text-sm font-bold text-gray-900">{address.name}</p>
        <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
          {address.street},<br />
          {address.city}, {address.state} — {address.pincode}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          <span className="font-medium">Mobile:</span> {address.phone}
        </p>
      </div>

      {/* Actions */}
      {!selectable && (
        <div className="flex items-center gap-3 mt-4 ml-6 pt-3 border-t border-gray-100">
          {!isDefault && (
            <button
              onClick={(e) => { e.stopPropagation(); onSetDefault(address.id); }}
              className="text-xs font-semibold text-[#2874f0] hover:underline cursor-pointer"
            >
              Set as Default
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(address); }}
            className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#2874f0] transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            className={`flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${
              confirmDelete ? "text-red-600 font-bold" : "text-gray-600 hover:text-red-600"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {confirmDelete ? "Confirm Delete?" : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
