import { AIComment } from "@/services/mockAIComments";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { 
  ExternalLink, 
  ThumbsUp, 
 
  Heart, 
  Eye, 
  Clock, 
  GitPullRequest,
  FileText,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader
} from "lucide-react";

type Props = {
  comment: AIComment;
  onReaction?: (commentId: string, reactionType: string) => void;
};

const CommentCard = ({ comment, onReaction }: Props) => {
  const getStatusIcon = (status: AIComment['status']) => {
    switch (status) {
      case 'posted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Loader className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: AIComment['status']) => {
    switch (status) {
      case 'posted':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'approved':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'rejected':
        return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getTypeIcon = (type: AIComment['commentType']) => {
    switch (type) {
      case 'summary':
        return <FileText className="h-4 w-4" />;
      case 'code_review':
        return <GitPullRequest className="h-4 w-4" />;
      case 'suggestion':
        return <Star className="h-4 w-4" />;
      case 'issue_analysis':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCommentPreview = (comment: string) => {
    // Remove markdown formatting for preview
    const cleaned = comment
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
    
    return cleaned.length > 200 ? cleaned.substring(0, 200) + '...' : cleaned;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={comment.author.avatarUrl} 
            alt={comment.author.username}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <Link 
                to={`/repositories/${comment.repositoryId}`}
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                {comment.repositoryName}
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                PR #{comment.pullRequestNumber}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {getTypeIcon(comment.commentType)}
                <span className="ml-1 capitalize">{comment.commentType.replace('_', ' ')}</span>
              </Badge>
              <Badge className={`text-xs ${getStatusColor(comment.status)}`}>
                {getStatusIcon(comment.status)}
                <span className="ml-1 capitalize">{comment.status}</span>
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatDate(comment.createdAt)}
          </span>
          <Link 
            to={comment.pullRequestUrl}
            target="_blank"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Pull Request Title */}
      <h3 className="font-medium mb-3 text-foreground hover:text-primary transition-colors">
        <Link to={comment.pullRequestUrl} target="_blank">
          {comment.pullRequestTitle}
        </Link>
      </h3>

      {/* Comment Preview */}
      <div className="bg-muted/50 rounded-md p-3 mb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {formatCommentPreview(comment.comment)}
        </p>
      </div>

      {/* Metrics and Tags */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Reactions */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <button 
              onClick={() => onReaction?.(comment.id, 'thumbsUp')}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{comment.metrics.reactions.thumbsUp}</span>
            </button>
            <button 
              onClick={() => onReaction?.(comment.id, 'heart')}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span>{comment.metrics.reactions.heart}</span>
            </button>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{comment.metrics.reactions.eyes}</span>
            </div>
          </div>

          {/* Processing Time */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{comment.processingTime}s</span>
          </div>

          {/* AI Model */}
          <Badge variant="secondary" className="text-xs">
            {comment.aiModel}
          </Badge>
        </div>

        {/* Code Changes */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{comment.codeChanges.filesChanged} files</span>
          <span className="text-green-600">+{comment.codeChanges.additions}</span>
          <span className="text-red-600">-{comment.codeChanges.deletions}</span>
          <Badge variant="outline" className="text-xs">
            {comment.codeChanges.language}
          </Badge>
        </div>
      </div>

      {/* Tags */}
      {comment.tags.length > 0 && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
          {comment.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;