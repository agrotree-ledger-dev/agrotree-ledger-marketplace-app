import { NavbarItemType } from "../types/Navbar.type";
import { PublicKey } from "@solana/web3.js";

export const NAVBAR_ITEMS: NavbarItemType[] = [
  {
    label: "NFT Market",
    link: "/",
  },

  {
    label: "Projects",
    link: "/projects",
  },
  {
    label: "Collections",
    link: "/collections",
  },
  {
    label: "Console",
    link: "https://console.agrotreeledger.com",
  },
];

export const MPL_BUBBLEGUM_PROGRAM_ID = new PublicKey(
  "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY"
);

export const SPL_NOOP_PROGRAM_ID = new PublicKey(
  "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV"
);

export const SPL_ACCOUNT_COMPRESSION_PROGRAM_ID = new PublicKey(
  "cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK"
);

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const METADATA_SEED = "metadata";
export const EDITION_SEED = "edition";
