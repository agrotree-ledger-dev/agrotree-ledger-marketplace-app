"use server";
import { getAgroTreeManagerConfigAddress } from "@/lib/contracts/marketplace.contract";
import { convertShyftApiAssetToTreeNftType } from "@/lib/utils";
import { PaginationShyftType } from "@/types/Pagination.type";
import { Nft } from "@/types/shyft.type";
import { TreeNftType } from "@/types/TreeNft.type";
import axios from "axios";
import { getAssetByOwnerFromHelius } from "./helius.action";

const API_KEY_BANKS = [
  "fR6hxcgz5w1QO1zv",
  "Eu-x7Y3bDyfsAasB",
  "DgTscp1QAFBjndzE",
];

const shyftFetcher = axios.create({
  baseURL: `https://api.shyft.to`,
  headers: {
    "Content-Type": "application/json",
  },
});

const network = "devnet";

export async function getAssetListFromShyft(
  addresses: (string | null)[],
  page: number = 1,
  limit: number = 10
): Promise<TreeNftType[]> {
  if (!addresses || addresses.length === 0) {
    return [];
  }
  try {
    const { data } = await shyftFetcher.post(
      `/sol/v1/nft/read_selected`,
      {
        network,
        nft_addresses: addresses
          .filter((item) => !!item)
          .slice(page - 1, limit),
        refresh: true,
      },
      {
        headers: {
          "x-api-key":
            API_KEY_BANKS[Math.floor(Math.random() * API_KEY_BANKS.length)],
        },
      }
    );

    if (data.success) {
      return data.result.map((item: Nft) =>
        convertShyftApiAssetToTreeNftType(item)
      );
    }
    return [];
  } catch (error) {
    // const data = await prisma.nftMetadata.findMany({
    //   where: {
    //     address: {
    //       in: addresses as string[],
    //     },
    //   },
    // });

    // return data.map((item) => convertShyftApiAssetToTreeNftType(item));

    console.error(error);
    return [];
  }
}

export async function getAssetFromShyft(
  address: string
): Promise<TreeNftType | null> {
  try {
    const { data } = await shyftFetcher.get(
      `/sol/v1/nft/read?network=${network}&nft_address=${address}`,
      {
        headers: {
          "x-api-key":
            API_KEY_BANKS[Math.floor(Math.random() * API_KEY_BANKS.length)],
        },
      }
    );
    if (data.success) {
      return convertShyftApiAssetToTreeNftType(data.result);
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAssetByOwnerFromShyft(
  owner: string,
  page: number = 1,
  size: number = 10
): Promise<PaginationShyftType<TreeNftType>> {
  try {
    await getAssetByOwnerFromHelius(owner, page, size);
    const [agroTreeManagerConfigAddress] = getAgroTreeManagerConfigAddress();
    const { data } = await shyftFetcher.get(
      `/sol/v1/nft/search?network=${network}&page=${page}&size=${size}&wallet=${owner}&creators=${agroTreeManagerConfigAddress.toString()}`,
      {
        headers: {
          "x-api-key":
            API_KEY_BANKS[Math.floor(Math.random() * API_KEY_BANKS.length)],
        },
      }
    );
    if (data.success) {
      return {
        items: data.result.nfts.map((item: Nft) =>
          convertShyftApiAssetToTreeNftType(item)
        ),
        total_data: data.result.total_data,
        page: data.result.page,
        size: data.result.size,
        total_page: data.result.total_page,
      };
    } else {
      return {
        items: [],
        total_data: 0,
        page: 1,
        size: 10,
        total_page: 0,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      items: [],
      total_data: 0,
      page: 1,
      size: 10,
      total_page: 0,
    };
  }
}
