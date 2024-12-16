"use client"
import React, { createContext, useState, useContext } from 'react';

interface GlobalContextType {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

const GlobalContext = createContext<GlobalContextType>({
  selectedValue: '',
  setSelectedValue: () => {}
});

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedValue, setSelectedValue] = useState('');

    return (
        <GlobalContext.Provider value={{ selectedValue, setSelectedValue }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);