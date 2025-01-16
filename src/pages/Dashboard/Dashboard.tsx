import { useEffect, useState } from "react";
import useUser from "../../api/useUser";
import styles from "./Dashboard.module.css";
import { showToast } from "../../lib/toast";
import RepoCard from "../../components/RepoCard/RepoCard";
import useWebhooks from "../../api/useWebhooks";

type Repo = {
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  language: string;
  default_branch: string;
  created_at: string;
  updated_at: string;
  clone_url: string;
  forks_count: number;
  stargazers_count: number;
  open_issues_count: number;
  visibility: string;
};

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
    const result = await createWebhook(repo.name); // Call createWebhook
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

  console.log(user);

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <h3>Welcome, {user.name}!</h3>
          <button className={styles.logout_btn} onClick={() => logoutUser()}>
            Logout
          </button>
          <div className={styles.repo_wrapper}>
            {repos.map((repo, idx) => (
              <RepoCard
                key={idx}
                data={repo}
                onClick={() => {
                  handleCreateWebhook(repo);
                  console.log("clicked");
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};

export default Dashboard;
