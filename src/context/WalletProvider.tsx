'use client';

import { createContext, useState, ReactNode, useCallback } from 'react';

const MOCK_WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

interface WalletContextType {
  address: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = useCallback(() => {
    // This is a mock connection
    setAddress(MOCK_WALLET_ADDRESS);
  }, []);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
  }, []);

  const value = { address, connectWallet, disconnectWallet };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
