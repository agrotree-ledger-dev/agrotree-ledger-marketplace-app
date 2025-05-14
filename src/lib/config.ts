import { clusterApiUrl } from "@solana/web3.js";
import { IS_PRODUCTION } from "./utils";

const appConfig = {
  appTitle: "AgroTree Ledger",
  appDescription:
    "Central hub for maintaining consistency and keeping the team aligned on technical aspects of AgroTree Ledger.",
  appCreator: "@agrotreeledger",
  appBaseUrl: IS_PRODUCTION
    ? new URL(`https://${process.env.NEXT_PUBLIC_HOST}`)
    : new URL(`http://localhost:${process.env.PORT || 3004}`),
  endpointRpc:
    `${process.env.NEXT_PUBLIC_HELIUS_CLUSTER_URL}/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}` ||
    clusterApiUrl("devnet"),
  dasApiRpc:
    `${process.env.NEXT_PUBLIC_HELIUS_CLUSTER_URL}/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}` ||
    clusterApiUrl("devnet"),
};

export default appConfig;
