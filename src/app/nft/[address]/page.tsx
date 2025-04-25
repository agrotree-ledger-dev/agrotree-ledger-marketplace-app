import React, { Suspense } from "react";
import NftDetailDisplay, {
  NftDetailDisplaySkeleton,
} from "@/components/trees/NftDetailDisplay";
type Props = {
  params: Promise<{
    address: string;
  }>;
};
const NftDetailPage: React.FC<Props> = async ({ params }) => {
  const { address } = await params;
  return (
    <div className="container mx-auto">
      <Suspense fallback={<NftDetailDisplaySkeleton />}>
        <NftDetailDisplay address={address} />
      </Suspense>
    </div>
  );
};

export default NftDetailPage;
