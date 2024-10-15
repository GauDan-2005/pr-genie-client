import styles from "./RepoCard.module.css";

type Props = {
  data: {
    name: string;
  };
  onClick: any;
};

const RepoCard = (props: Props) => {
  return (
    <div className={styles.repo_card}>
      <h1 className={styles.title}>{props.data.name}</h1>
      <button className={styles.btn} onClick={props.onClick}>
        Activate Bot
      </button>
    </div>
  );
};

export default RepoCard;
