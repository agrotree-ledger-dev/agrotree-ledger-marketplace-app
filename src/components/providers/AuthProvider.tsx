"use client";
import {
  SolanaChain,
  useAccount,
  useDisconnect,
  useWallets,
} from "@particle-network/connectkit";
import { Session } from "next-auth";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import bs58 from "bs58";
import { useRouter } from "next/navigation";

type AuthContextType = {
  session: Session | null;
  login: () => void;
  logout: () => void;
  loading?: boolean;
  isAuthenticated?: boolean;
};
const AuthContext = React.createContext<AuthContextType>({
  session: null,
  login: () => {},
  logout: () => {},
  loading: false,
  isAuthenticated: false,
});
const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: session, status } = useSession() as {
    data: Session | null;
    status: string;
  };
  const { disconnectAsync } = useDisconnect();
  const { isConnected, address, isDisconnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [primaryWallet] = useWallets();
  const login = useCallback(async () => {
    if (!primaryWallet) return;
    setLoading(true);

    try {
      const walletClient = primaryWallet.getWalletClient<SolanaChain>();
      const crsf = await getCsrfToken();
      if (!crsf) {
        console.error("Failed to get CSRF token");
        setLoading(false);
        return;
      }
      const message = `By signing this message, you are logging into ${process.env.NEXT_PUBLIC_APP_NAME}\n${crsf}`;
      const nonce = new TextEncoder().encode(message);
      const { signature } = await walletClient.signMessage(nonce);
      const serializedSignature = bs58.encode(signature);
      const response = await signIn("credentials", {
        signature: serializedSignature,
        publicKey: address,
        redirect: false,
      });

      if (response?.ok) {
        console.log("Login successful");
        router.refresh();
      }
      setLoading(false);
    } catch (error) {
      console.error("Login error", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [primaryWallet, address, router]);

  const logout = useCallback(async () => {
    await signOut();
    await disconnectAsync();
  }, [disconnectAsync]);

  const isAuthenticated = useMemo(() => {
    return isConnected && status === "authenticated";
  }, [isConnected, status]);

  useEffect(() => {
    console.log("isConnected", isConnected);
    console.log("address", address);
    console.log("status", status);
    if (isConnected && status === "unauthenticated") {
      console.log("Wallet Connected. Logging in");
      login();
    }
  }, [address, isConnected, login, status]);

  useEffect(() => {
    // if (isDisconnected && status === "authenticated") {
    console.log(isDisconnected, address, session?.user.id);
    if (session?.user.id && address !== session?.user.id) {
      console.log("Wallet Disconnected. Logging out");
      logout();
    }
  }, [isDisconnected, address, session?.user.id, logout]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        session,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthProvider = () => React.useContext(AuthContext);
