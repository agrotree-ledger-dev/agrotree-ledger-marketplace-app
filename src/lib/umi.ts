"use server";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import bs58 from "bs58";
import {
  createSignerFromKeypair,
  RpcInterface,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { Connection } from "@solana/web3.js";
import {
  dasApi,
  DasApiInterface,
} from "@metaplex-foundation/digital-asset-standard-api";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { getHeliusApiKey } from "./utils";

// Monkey patch the Connection prototype
Connection.prototype.getRecentBlockhash = async function (commitment) {
  try {
    const { blockhash } = await this.getLatestBlockhash(commitment);
    const recentPrioritizationFees = await this.getRecentPrioritizationFees();
    const averageFee =
      recentPrioritizationFees.length > 0
        ? recentPrioritizationFees.reduce(
            (sum, fee) => sum + fee.prioritizationFee,
            0
          ) / recentPrioritizationFees.length
        : 5000;

    return {
      blockhash,
      feeCalculator: {
        lamportsPerSignature: averageFee,
      },
    };
  } catch (e) {
    throw new Error("failed to get recent blockhash: " + e);
  }
};

export async function getUmiServer() {
  const endpointRpc = `${
    process.env.NEXT_PUBLIC_HELIUS_CLUSTER_URL
  }/?api-key=${getHeliusApiKey()}` as string;
  const connection = new Connection(endpointRpc, "confirmed");
  const umiServer = createUmi(connection.rpcEndpoint, {
    commitment: "confirmed",
  })
    .use(mplBubblegum())
    .use(mplTokenMetadata())
    .use(dasApi());

  const keypair = umiServer.eddsa.createKeypairFromSecretKey(
    bs58.decode(process.env.PRIVATE_KEY as string)
  );

  const signer = createSignerFromKeypair(umiServer, keypair);
  umiServer.use(signerIdentity(signer));
  return {
    ...umiServer,
    rpc: umiServer.rpc as RpcInterface & DasApiInterface,
  };
}
