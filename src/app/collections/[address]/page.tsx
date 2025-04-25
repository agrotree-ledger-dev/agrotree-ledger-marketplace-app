import { getCollectionByAddressAction } from "@/_actions/collection.actions";
import CollectionNftsGrid from "@/components/collection/CollectionNftsGrid";
import { Library } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
type Props = {
  params: Promise<{
    address: string;
  }>;
};

const CollectionDetailPage: React.FC<Props> = async ({ params }) => {
  const { address } = await params;
  const collection = await getCollectionByAddressAction(address);
  if (!collection) {
    return notFound();
  }

  const addresses = collection.NftMetadata.map((nft) => nft.address);

  return (
    <div className="container mx-auto px-3 md:px-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Library className="size-5 mr-2" /> {collection?.name}
          <span className="text-muted-foreground ml-1"> Collection</span>
        </h2>
      </div>
      <CollectionNftsGrid collection={address} addresses={addresses} />
    </div>
  );
};

export default CollectionDetailPage;
