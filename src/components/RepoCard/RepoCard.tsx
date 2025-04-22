type Props = {
  data: {
    id: string;
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
  onClick: any;
};

const RepoCard = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-between bg-slate-700 px-6 py-4 rounded-lg">
      <h1 className="text-2xl self-stretch text-center">{props.data.name}</h1>
      <button
        className="px-6 py-2 border-0 outline-0 bg-black cursor-pointer text-white rounded-lg"
        onClick={props.onClick}
      >
        Activate Bot
      </button>
    </div>
  );
};

export default RepoCard;
