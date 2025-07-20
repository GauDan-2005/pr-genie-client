import useUser from "@/api/useUser";
import useRepositoryStats from "@/api/useRepositoryStats";
import useAIComments from "@/api/useAIComments";
import { useSelector } from "react-redux";

import defaultCover from "@/assets/overview-bg.png";
import StatsCard from "@/components/StatsCard";
import { User } from "@/utils/type";

const Overview = () => {
  const user = useSelector((state: any) => state.user) as User;

  useUser();
  const { stats: repoStats, loading: repoLoading } = useRepositoryStats(true);
  const {
    stats: aiStats,
    pullRequestsCount: prCount,
    starredCount: starredData,
    loading: aiLoading,
  } = useAIComments({ autoFetch: true, adaptData: false });

  return (
    <div className="flex flex-col flex-1 gap-6 max-w-screen-xl items-start justify-start mx-auto">
      <h1 className="text-2xl font-bold">Overview</h1>

      <div className="flex flex-col flex-1 items-center justify-center gap-8">
        {user ? (
          <div className="flex flex-col flex-1 items-start justify-start w-full">
            <div className="relative w-full h-2/5 overflow-hidden">
              <img
                src={defaultCover}
                alt="cover"
                className="object-cover w-full flex-shrink-0 rounded-t-3xl"
              />
              <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="flex flex-col items-center justify-center w-full -mt-16 z-[5] gap-9">
              <div className="flex flex-col items-center justify-center gap-6 w-full">
                <img
                  src={user && user.avatarUrl}
                  alt="profile image"
                  className="w-32 h-32 rounded-full border-4 border-background"
                />
                <div className="flex flex-col items-center justify-center gap-4 w-full text-foreground/80 font-medium">
                  <div className="flex flex-col items-center justify-center gap-2 w-full">
                    <h1 className="text-xl font-bold">{user.name}</h1>
                    <a
                      href={user.profileUrl}
                      className="text-sm text-foreground/60 hover:underline hover:text-foreground/90"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{user.username}
                    </a>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <p className="font-bold">{user.followers}</p>
                      <p>followers</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="font-bold">{user.following}</p>
                      <p>following</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 w-full items-stretch justify-center self-stretch">
                <StatsCard
                  title={"Total Repositories"}
                  value={repoStats?.total || 0}
                  loading={repoLoading}
                />
                <StatsCard
                  title={"Starred Public Repositories"}
                  value={starredData?.totalStarred || 0}
                  loading={aiLoading}
                />
                <StatsCard
                  title={"Total AI Comments"}
                  value={aiStats?.totalComments || 0}
                  loading={aiLoading}
                />
                <StatsCard
                  title={"Open Pull Requests"}
                  value={prCount?.totalOpenPRs || 0}
                  loading={aiLoading}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xl font-bold">Please log in first</p>
        )}
      </div>
    </div>
  );
};

export default Overview;
