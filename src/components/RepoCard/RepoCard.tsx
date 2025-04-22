import styles from "./RepoCard.module.css";

type Props = {
  data: {
    name: string;
    description?: string;
    language?: string;
    stargazers_count?: number;
    forks_count?: number;
  };
  onClick: any;
};

const RepoCard = (props: Props) => {
  const { data, onClick } = props;

  return (
    <div className={styles.repo_card}>
      <h1 className={styles.title}>{data.name}</h1>
      {data.description && (
        <p className={styles.description}>{data.description}</p>
      )}

      <div className={styles.meta}>
        {data.language && (
          <span className={styles.language}>
            <span className={styles.language_dot}></span>
            {data.language}
          </span>
        )}
        {data.stargazers_count !== undefined && (
          <span>
            <span>★</span> {data.stargazers_count}
          </span>
        )}
        {data.forks_count !== undefined && (
          <span>
            <span>🍴</span> {data.forks_count}
          </span>
        )}
      </div>

      <button className={styles.btn} onClick={onClick}>
        Activate Bot
      </button>
    </div>
  );
};

export default RepoCard;
