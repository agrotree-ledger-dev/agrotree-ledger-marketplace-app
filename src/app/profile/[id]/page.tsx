import ListedByUserSection from "@/components/profile/ListedByUserSection";
import TreesOwnByUser, {
  TreesOwnByUserSkeleton,
} from "@/components/trees/TreesOwnByUser";
import React, { Suspense } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
const ProfileIdPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params;
  return (
    <div className="mx-auto container px-6 py-12 lg:px-8">
      <Suspense fallback={<TreesOwnByUserSkeleton />}>
        <TreesOwnByUser address={id} />
      </Suspense>

      <ListedByUserSection address={id} />
    </div>
  );
};

export default ProfileIdPage;
