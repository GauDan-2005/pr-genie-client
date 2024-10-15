import { useEffect, useState } from "react";
import useUser from "../../api/useUser";
import styles from "./Dashboard.module.css";
import { errorToast, successToast } from "../../lib/toast";
import RepoCard from "../../components/RepoCard/RepoCard";
import useWebhooks from "../../api/useWebhooks";

type User = {
  id: string;
  name: string;
  email: string;
};

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

type Props = {
  user: User; // Adjust type to match your user object shape, e.g., `null | { id: string; name: string; }`
};

const Dashboard = ({ user }: Props) => {
  const [repos, setRepos] = useState<Repos>([]); // Set the type of repos as Repos (Repo[])

  const { getUserRepos, logoutUser } = useUser();
  const { createWebhook } = useWebhooks();

  const getRepositoryList = () => {
    try {
      getUserRepos((response, error) => {
        if (error || response === null) {
          errorToast("Failed fetching repositories");
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
      errorToast("Failed to get repositories.");
      console.log(err);
    }
  };

  // Create webhook for a specific repository
  const handleCreateWebhook = async (repo: Repo) => {
    console.log("createwebhook entered");
    const result = await createWebhook(repo.name); // Call createWebhook
    if (result?.message === "Webhook created successfully") {
      successToast("Webhook created successfully!");
    } else {
      errorToast(result?.message || "Failed to create webhook");
    }
  };

  useEffect(() => {
    getRepositoryList();
  }, []);

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
