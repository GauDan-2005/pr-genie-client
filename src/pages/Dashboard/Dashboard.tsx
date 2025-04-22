import { useEffect, useState } from "react";
import useUser from "../../api/useUser";
import { showToast } from "../../lib/toast";
import RepoCard from "../../components/RepoCard/RepoCard";
import useWebhooks from "../../api/useWebhooks";
import { Repo } from "../../utils/type";

type Repos = Repo[];

const Dashboard = () => {
  const [repos, setRepos] = useState<Repos>([]); // Set the type of repos as Repos (Repo[])
  const [user, setUser] = useState<any>(null);

  const { getUserRepos, logoutUser, getUser } = useUser();
  const { createWebhook } = useWebhooks();

  const getUserData = async () => {
    try {
      getUser((response, error) => {
        if (error || response === null) {
          showToast("error", "Failed fetching user data");
          return;
        }
        showToast("success", response.message);
        setUser(response.user);
      });
    } catch (err) {
      showToast("error", "Failed to get repositories.");
      console.log(err);
    }
  };

  // get repository list
  const getRepositoryList = () => {
    try {
      getUserRepos((response, error) => {
        if (error || response === null) {
          showToast("error", "Failed fetching repositories");
          return;
        }

        const filteredRepos: Repos = response.map((repo: Repo) => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          html_url: repo.html_url,
          description: repo.description,
          language: repo.language,
          default_branch: repo.default_branch,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          clone_url: repo.clone_url,
          forks_count: repo.forks_count,
          stargazers_count: repo.stargazers_count,
          open_issues_count: repo.open_issues_count,
          visibility: repo.visibility,
        }));
        console.log(filteredRepos);

        setRepos(filteredRepos); // No more 'never[]' error
      });
    } catch (err) {
      showToast("error", "Failed to get repositories.");
      console.log(err);
    }
  };

  // Create webhook for a specific repository
  const handleCreateWebhook = async (repo: Repo) => {
    console.log("createwebhook entered");
    const result = await createWebhook(repo); // Call createWebhook
    if (result?.message === "Webhook created successfully") {
      showToast("success", "Webhook created successfully!");
    } else {
      showToast("error", result?.message || "Failed to create webhook");
    }
  };

  useEffect(() => {
    getUserData();
    getRepositoryList();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl text">Dashboard</h1>
      {user ? (
        <div className="flex flex-col items-center justify-center gap-6">
          <h3 className="text-xl">Welcome, {user.name}!</h3>
          <button
            className="bg-red-700 hover:bg-red-800 text-base text-white font-bold px-6 py-2 rounded-lg cursor-pointer transition-all duration-300"
            onClick={() => logoutUser()}
          >
            Logout
          </button>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full px-10">
            {repos.map((repo, idx) => {
              return (
                <RepoCard
                  key={idx}
                  data={repo}
                  onClick={() => {
                    console.log(repo);
                    handleCreateWebhook(repo);
                  }}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};

export default Dashboard;
