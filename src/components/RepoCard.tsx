import { Repo } from "@/utils/type";
import { Button } from "./ui/button";
import { LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  data: Repo;
  setActive: any;
  setDeactive: any;
  activated?: boolean | true;
};

const RepoCard = (props: Props) => {
  return (
    <Link
      to={`/repositories/${props.data.id}`}
      className={`relative flex flex-col items-start justify-between bg-card-foreground/5 hover:bg-card-foreground/10 border border-border/50 px-4 py-4 rounded-lg gap-4
      ${props.activated && "bg-primary/5 hover:bg-primary/20"}
      hover:bg-card-primary/20 transition-colors duration-200`}
    >
      <div className="flex items-start justify-between w-full">
        <h1 className="text-xl self-stretch flex-1">{props.data.name}</h1>
        <Link
          to={props.data.html_url}
          target="_blank"
          className="text-foreground/50 hover:text-foreground/100 transition-all duration-200 bg-foreground/10 hover:bg-foreground/20 p-2 rounded-full"
        >
          <LinkIcon size={12} />
        </Link>
      </div>
      {props.data.description && (
        <p className="text-xs">
          {props.data.description.length > 100
            ? props.data.description.slice(0, 100) + "..."
            : props.data.description}
        </p>
      )}
      <Button
        onClick={props.activated ? props.setDeactive : props.setActive}
        variant={props.activated ? "destructive" : "default"}
      >
        {props.activated ? "Deactivate Bot" : "Activate Bot"}
      </Button>
    </Link>
  );
};

export default RepoCard;
