import CollectionVerticalList, {
  CollectionVerticalListSkeleton,
} from "@/components/collection/CollectionVerticalList";
import TopMarketplaceItemsSection, {
  TopMarketplaceItemsSectionSkeleton,
} from "@/components/marketplace/TopMarketplaceItemsSection";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="py-10 space-y-10">
      <Suspense fallback={<CollectionVerticalListSkeleton />}>
        <CollectionVerticalList />
      </Suspense>
      <Suspense fallback={<TopMarketplaceItemsSectionSkeleton />}>
        <TopMarketplaceItemsSection />
      </Suspense>
    </div>
  );
}
