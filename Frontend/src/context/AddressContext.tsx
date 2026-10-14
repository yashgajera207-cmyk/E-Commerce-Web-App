import React, { createContext, useState, useContext, useCallback } from "react";
import type { Address } from "../types";

interface AddressContextType {
  addresses: Address[];
  defaultAddressId: string | null;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefault: (id: string) => void;
  getDefaultAddress: () => Address | null;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

const generateId = () => `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const stored = localStorage.getItem("shopzone_addresses");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(() => {
    return localStorage.getItem("shopzone_default_address");
  });

  const persist = useCallback((addrs: Address[], defaultId: string | null) => {
    localStorage.setItem("shopzone_addresses", JSON.stringify(addrs));
    if (defaultId) {
      localStorage.setItem("shopzone_default_address", defaultId);
    } else {
      localStorage.removeItem("shopzone_default_address");
    }
  }, []);

  const addAddress = (address: Omit<Address, "id">) => {
    const newAddress: Address = { ...address, id: generateId() };
    setAddresses((prev) => {
      const updated = [...prev, newAddress];
      const newDefault = prev.length === 0 ? newAddress.id : defaultAddressId;
      persist(updated, newDefault);
      if (prev.length === 0) setDefaultAddressId(newAddress.id);
      return updated;
    });
  };

  const updateAddress = (id: string, partial: Partial<Address>) => {
    setAddresses((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...partial } : a));
      persist(updated, defaultAddressId);
      return updated;
    });
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      let newDefault = defaultAddressId;
      if (defaultAddressId === id) {
        newDefault = updated.length > 0 ? updated[0].id : null;
        setDefaultAddressId(newDefault);
      }
      persist(updated, newDefault);
      return updated;
    });
  };

  const setDefault = (id: string) => {
    setDefaultAddressId(id);
    persist(addresses, id);
  };

  const getDefaultAddress = (): Address | null => {
    if (!defaultAddressId) return addresses[0] || null;
    return addresses.find((a) => a.id === defaultAddressId) || addresses[0] || null;
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        defaultAddressId,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefault,
        getDefaultAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};
