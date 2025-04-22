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
  const [loading, setLoading] = useState<boolean>(true);

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
      showToast("error", "Failed to get user data");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // get repository list
  const getRepositoryList = () => {
    setLoading(true);
    try {
      getUserRepos((response, error) => {
        if (error || response === null) {
          showToast("error", "Failed fetching repositories");
          setLoading(false);
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

        setRepos(filteredRepos);
        setLoading(false);
      });
    } catch (err) {
      showToast("error", "Failed to get repositories.");
      console.log(err);
      setLoading(false);
    }
  };

  // Create webhook for a specific repository
  const handleCreateWebhook = async (repo: Repo) => {
    try {
      const result = await createWebhook(repo.name);
      if (result?.message === "Webhook created successfully") {
        showToast("success", "Webhook created successfully!");
      } else {
        showToast("error", result?.message || "Failed to create webhook");
      }
    } catch (error) {
      showToast("error", "Failed to create webhook");
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData();
    getRepositoryList();
  }, []);

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {user ? (
        <>
          <div className={styles.header}>
            <h3 className={styles.welcome}>Welcome, {user.name}!</h3>
            <button className={styles.logout_btn} onClick={() => logoutUser()}>
              Logout
            </button>
          </div>

          <div className={styles.repo_section}>
            <h2 className={styles.section_title}>Your Repositories</h2>
            <div className={styles.repo_wrapper}>
              {repos.length > 0 ? (
                repos.map((repo, idx) => (
                  <RepoCard
                    key={idx}
                    data={repo}
                    onClick={() => handleCreateWebhook(repo)}
                  />
                ))
              ) : (
                <p>No repositories found</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Please log in to view your dashboard</p>
      )}
    </div>
  );
};

export default Dashboard;
