import { useState, useMemo, useEffect } from "react";
import CommentCard from "@/components/CommentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AIComment } from "@/services/mockAIComments";
import { adaptedCommentFilters } from "@/services/aiCommentsAdapter";
import useAIComments from "@/api/useAIComments";
import { 
  Search,
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Brain,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function AIComments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AIComment['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AIComment['commentType'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpfulness'>('newest');

  // Use consolidated API data with adaptation enabled
  const { loading, error, comments: apiComments, stats: apiStats, getComments } = useAIComments({ 
    autoFetch: true, 
    adaptData: true 
  });

  // Refresh data when filters change
  useEffect(() => {
    if (statusFilter !== 'all' || typeFilter !== 'all') {
      getComments({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
      });
    }
  }, [statusFilter, typeFilter, getComments]);

  // Filter and sort comments
  const filteredComments = useMemo(() => {
    let comments = [...apiComments];

    // Apply search filter
    if (searchQuery) {
      comments = adaptedCommentFilters.search(comments, searchQuery);
    }

    // Apply status filter (if not already applied by API)
    if (statusFilter !== 'all') {
      comments = adaptedCommentFilters.byStatus(comments, statusFilter);
    }

    // Apply type filter (if not already applied by API)
    if (typeFilter !== 'all') {
      comments = adaptedCommentFilters.byType(comments, typeFilter);
    }

    // Apply sorting
    comments.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'helpfulness':
          return b.metrics.helpfulness - a.metrics.helpfulness;
        default:
          return 0;
      }
    });

    return comments;
  }, [apiComments, searchQuery, statusFilter, typeFilter, sortBy]);

  // Use API stats or provide fallback - ensure consistent interface
  const stats = apiStats || {
    total: 0,
    totalComments: 0,
    byStatus: { posted: 0, pending: 0, failed: 0, approved: 0, rejected: 0 },
    averageHelpfulness: 0,
    averageProcessingTime: 0,
    recentActivity: 0,
    recentComments: 0,
    averagePerDay: 0,
    repositoriesWithComments: 0
  };

  // Helper function to safely access stats properties including nested ones
  const getStatValue = (path: string, fallback: number = 0): number => {
    if (!stats) return fallback;
    
    const keys = path.split('.');
    let value: any = stats;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return fallback;
      }
    }
    
    return typeof value === 'number' ? value : fallback;
  };

  const handleReaction = (_commentId: string, _reactionType: string) => {
    // Handle reaction logic here
    // In a real app, this would update the comment reactions
  };

  // Show loading state
  if (loading && apiComments.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Loading AI Comments
        </h3>
        <p className="text-sm text-muted-foreground">
          Fetching your AI comments from the server...
        </p>
      </div>
    );
  }

  // Show error state
  if (error && apiComments.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-96">
        <AlertCircle className="h-8 w-8 text-destructive mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Failed to Load AI Comments
        </h3>
        <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
          {error}
        </p>
        <Button 
          onClick={() => getComments()} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <Loader2 className={`h-4 w-4 ${loading ? 'animate-spin' : 'hidden'}`} />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI Comments Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage AI-generated comments across your repositories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {getStatValue('total')} Total Comments
          </Badge>
          <Badge variant="outline" className="text-sm">
            {getStatValue('recentActivity')} This Week
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium">Posted</span>
          </div>
          <div className="text-2xl font-bold">{getStatValue('byStatus.posted')}</div>
          <div className="text-sm text-muted-foreground">Successfully posted</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">Pending</span>
          </div>
          <div className="text-2xl font-bold">{getStatValue('byStatus.pending')}</div>
          <div className="text-sm text-muted-foreground">Awaiting review</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Avg. Helpfulness</span>
          </div>
          <div className="text-2xl font-bold">{getStatValue('averageHelpfulness').toFixed(1)}/5</div>
          <div className="text-sm text-muted-foreground">User rating</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-purple-500" />
            <span className="font-medium">Avg. Speed</span>
          </div>
          <div className="text-2xl font-bold">{getStatValue('averageProcessingTime').toFixed(1)}s</div>
          <div className="text-sm text-muted-foreground">Processing time</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {loading && (
          <div className="w-full bg-muted/50 rounded-md p-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating comments...
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search comments, repositories, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AIComment['status'] | 'all')}
            className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="posted">Posted</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as AIComment['commentType'] | 'all')}
            className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Types</option>
            <option value="summary">Summary</option>
            <option value="code_review">Code Review</option>
            <option value="suggestion">Suggestion</option>
            <option value="issue_analysis">Issue Analysis</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'helpfulness')}
            className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="helpfulness">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="text-xs">
              Search: "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="ml-1 hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Status: {statusFilter}
              <button
                onClick={() => setStatusFilter('all')}
                className="ml-1 hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
          {typeFilter !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Type: {typeFilter.replace('_', ' ')}
              <button
                onClick={() => setTypeFilter('all')}
                className="ml-1 hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter('all');
              setTypeFilter('all');
            }}
            className="text-xs h-6"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredComments.length} of {getStatValue('total')} comments
        </div>
      </div>

      {/* Comments List */}
      {filteredComments.length > 0 ? (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onReaction={handleReaction}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No comments found
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
              ? "Try adjusting your filters or search query to find more comments."
              : apiComments.length === 0 && !loading
              ? "No AI comments found. AI comments will appear here when pull requests are opened in your repositories with active webhooks."
              : "AI comments will appear here when pull requests are opened in your repositories with active webhooks."
            }
          </p>
          {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
