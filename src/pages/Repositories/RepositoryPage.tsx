import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import useRepositories from "@/api/useRepositories";
import useRepositoryDetails from "@/api/useRepositoryDetails";
import useWebhookStatus from "@/api/useWebhookStatus";
import useWebhooks from "@/api/useWebhooks";
import { mockAIComments, aiCommentFilters } from "@/services/mockAIComments";
import CommentCard from "@/components/CommentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/lib/toast";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  GitFork,
  Eye,
  FileText,
  GitPullRequest,
  GitCommit,
  Users,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Calendar,
  Code,
  Globe,
  Lock,
  Webhook,
  TrendingUp,
  BarChart3
} from "lucide-react";

const RepositoryPage = () => {
  const { id: repoId } = useParams<{ id: string }>();
  const { repositories } = useRepositories(true);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'pullrequests' | 'commits' | 'aicomments' | 'settings'>('overview');

  // Get repository data
  const repoData = repositories.find((repo) => repo.id.toString() === repoId);
  
  // Extract owner and name from repository data
  const owner = repoData?.owner?.login || '';
  const name = repoData?.name || '';
  
  // Use real API hooks
  const {
    details,
    commits,
    pullRequests,
    collaborators,
    readme,
    loading,
    error
  } = useRepositoryDetails(owner, name);
  
  const { getWebhookStatus } = useWebhookStatus();
  const { createWebhook, deleteWebhook } = useWebhooks();
  const [webhookActive, setWebhookActive] = useState(false);
  const [webhookLoading, setWebhookLoading] = useState(false);

  // Filter AI comments for this repository (still using mock data for now)
  const repositoryAIComments = useMemo(() => {
    return aiCommentFilters.byRepository(mockAIComments, repoId || '');
  }, [repoId]);

  // Fetch webhook status when component mounts
  useEffect(() => {
    if (repoId) {
      const fetchWebhookStatus = async () => {
        const status = await getWebhookStatus(repoId);
        setWebhookActive(status?.active || false);
      };
      fetchWebhookStatus();
    }
  }, [repoId, getWebhookStatus]);

  const handleWebhookToggle = async () => {
    if (!repoData) return;
    
    setWebhookLoading(true);
    
    try {
      if (webhookActive) {
        // Deactivate webhook
        const result = await deleteWebhook({
          id: repoData.id.toString(),
          name: repoData.name,
          full_name: repoData.full_name,
          html_url: repoData.html_url,
          description: repoData.description || "",
          language: repoData.language || "",
          default_branch: "main",
          created_at: repoData.created_at,
          updated_at: repoData.updated_at,
          clone_url: repoData.clone_url,
          forks_count: repoData.forks_count,
          stargazers_count: repoData.stargazers_count,
          open_issues_count: repoData.open_issues_count,
          visibility: repoData.private ? "private" : "public",
        });
        
        if (result?.message === "Webhook deleted successfully from GitHub and database") {
          setWebhookActive(false);
          showToast("success", "Webhook deactivated successfully!");
        } else {
          showToast("error", result?.message || "Failed to deactivate webhook");
        }
      } else {
        // Activate webhook
        const result = await createWebhook({
          id: repoData.id.toString(),
          name: repoData.name,
          full_name: repoData.full_name,
          html_url: repoData.html_url,
          description: repoData.description || "",
          language: repoData.language || "",
          default_branch: "main",
          created_at: repoData.created_at,
          updated_at: repoData.updated_at,
          clone_url: repoData.clone_url,
          forks_count: repoData.forks_count,
          stargazers_count: repoData.stargazers_count,
          open_issues_count: repoData.open_issues_count,
          visibility: repoData.private ? "private" : "public",
        });
        
        if (result?.message === "Webhook created successfully") {
          setWebhookActive(true);
          showToast("success", "Webhook activated successfully!");
        } else {
          showToast("error", result?.message || "Failed to activate webhook");
        }
      }
    } catch (error) {
      console.error("Error toggling webhook:", error);
      showToast("error", "Failed to toggle webhook");
    } finally {
      setWebhookLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPRStatusIcon = (state: 'open' | 'closed' | 'merged') => {
    switch (state) {
      case 'open':
        return <GitPullRequest className="h-4 w-4 text-green-500" />;
      case 'merged':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <GitPullRequest className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading.details || !repoData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading repository details...</p>
        </div>
      </div>
    );
  }

  if (error.details || (!loading.details && !details)) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Repository Not Found</h2>
        <p className="text-muted-foreground mb-4">{error.details || "The repository you're looking for doesn't exist or you don't have access to it."}</p>
        <Link to="/repositories">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Repositories
          </Button>
        </Link>
      </div>
    );
  }

  // Use details from API or fallback to repoData
  const repositoryData = details || repoData;

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/repositories">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{repositoryData.name}</h1>
            <Badge variant={repositoryData.private ? 'secondary' : 'outline'} className="text-xs">
              {repositoryData.private ? (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </>
              ) : (
                <>
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </>
              )}
            </Badge>
            {webhookActive && (
              <Badge variant="default" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                AI Active
              </Badge>
            )}
          </div>
          
          {repositoryData.description && (
            <p className="text-muted-foreground mb-3">{repositoryData.description}</p>
          )}
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{repositoryData.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              <span>{repositoryData.forks_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{repositoryData.open_issues_count} issues</span>
            </div>
            {repositoryData.language && (
              <div className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>{repositoryData.language}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Updated {formatDate(repositoryData.updated_at)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to={repositoryData.html_url} target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on GitHub
            </Button>
          </Link>
          <Button 
            variant={webhookActive ? "destructive" : "default"}
            size="sm"
            onClick={handleWebhookToggle}
            disabled={webhookLoading}
          >
            <Webhook className="h-4 w-4 mr-2" />
            {webhookLoading 
              ? "Processing..." 
              : webhookActive 
                ? "Deactivate AI" 
                : "Activate AI"
            }
          </Button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitCommit className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Commits</span>
          </div>
          <div className="text-2xl font-bold">{commits.length}</div>
          <div className="text-xs text-muted-foreground">Recent</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitPullRequest className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Pull Requests</span>
          </div>
          <div className="text-2xl font-bold">{pullRequests.length}</div>
          <div className="text-xs text-muted-foreground">All time</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Issues</span>
          </div>
          <div className="text-2xl font-bold">{repositoryData.open_issues_count}</div>
          <div className="text-xs text-muted-foreground">Open</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">AI Comments</span>
          </div>
          <div className="text-2xl font-bold">{repositoryAIComments.length}</div>
          <div className="text-xs text-muted-foreground">Total generated</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-6">
          {[
            { key: 'overview', label: 'Overview', icon: FileText },
            { key: 'pullrequests', label: 'Pull Requests', icon: GitPullRequest, count: pullRequests.length },
            { key: 'commits', label: 'Commits', icon: GitCommit, count: commits.length },
            { key: 'aicomments', label: 'AI Comments', icon: BarChart3, count: repositoryAIComments.length },
            { key: 'settings', label: 'Settings', icon: Settings }
          ].map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-1 py-3 border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              {count !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* README */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                README
              </h3>
              {loading.readme ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading README...</p>
                </div>
              ) : error.readme ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">{error.readme}</p>
                </div>
              ) : readme ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {readme.decoded_content}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No README file found</p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Commits */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <GitCommit className="h-5 w-5" />
                  Recent Commits
                </h3>
                {loading.commits ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading commits...</p>
                  </div>
                ) : error.commits ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">{error.commits}</p>
                  </div>
                ) : commits.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {commits.slice(0, 3).map((commit) => (
                        <div key={commit.sha} className="flex items-start gap-3 pb-4 border-b border-border last:border-b-0">
                          {commit.author ? (
                            <img 
                              src={commit.author.avatar_url} 
                              alt={commit.author.login}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <GitCommit className="h-4 w-4" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {commit.commit.message.split('\n')[0]}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>{commit.author?.login || commit.commit.author.name}</span>
                              <span>•</span>
                              <span>{formatDate(commit.commit.author.date)}</span>
                              {commit.stats && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-600">+{commit.stats.additions}</span>
                                  <span className="text-red-600">-{commit.stats.deletions}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => setActiveTab('commits')}
                      className="text-sm text-primary hover:underline"
                    >
                      View all commits →
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <GitCommit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No commits found</p>
                  </div>
                )}
              </div>

              {/* Collaborators */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Collaborators
                </h3>
                {loading.collaborators ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading collaborators...</p>
                  </div>
                ) : error.collaborators ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">{error.collaborators}</p>
                  </div>
                ) : collaborators.length > 0 ? (
                  <div className="space-y-3">
                    {collaborators.map((collaborator) => (
                      <div key={collaborator.login} className="flex items-center gap-3">
                        <img 
                          src={collaborator.avatar_url} 
                          alt={collaborator.login}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{collaborator.login}</p>
                          <p className="text-xs text-muted-foreground capitalize">{collaborator.role_name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No collaborators found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pullrequests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Pull Requests</h3>
              <Badge variant="outline">{pullRequests.length} total</Badge>
            </div>
            
            {loading.pullRequests ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading pull requests...</p>
              </div>
            ) : error.pullRequests ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">{error.pullRequests}</p>
              </div>
            ) : pullRequests.length > 0 ? (
              <div className="space-y-4">
                {pullRequests.map((pr) => (
                  <div key={pr.id} className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getPRStatusIcon(pr.state)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link to={pr.html_url} target="_blank" className="text-lg font-medium hover:text-primary">
                            {pr.title}
                          </Link>
                          <Badge variant="outline" className="text-xs">
                            #{pr.number}
                          </Badge>
                          <Badge 
                            variant={pr.state === 'merged' ? 'default' : pr.state === 'open' ? 'secondary' : 'outline'}
                            className="text-xs capitalize"
                          >
                            {pr.state}
                          </Badge>
                        </div>
                        
                        {pr.body && (
                          <p className="text-sm text-muted-foreground mb-3">{pr.body}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <img src={pr.user.avatar_url} alt={pr.user.login} className="w-4 h-4 rounded-full" />
                            <span>{pr.user.login}</span>
                          </div>
                          <span>Created {formatDate(pr.created_at)}</span>
                          {pr.additions !== undefined && (
                            <>
                              <span className="text-green-600">+{pr.additions}</span>
                              <span className="text-red-600">-{pr.deletions}</span>
                              <span>{pr.changed_files} files</span>
                            </>
                          )}
                        </div>
                        
                        {pr.labels.length > 0 && (
                          <div className="flex items-center gap-1 mt-3">
                            {pr.labels.map((label) => (
                              <Badge key={label.id} variant="secondary" className="text-xs">
                                {label.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <GitPullRequest className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No pull requests</h3>
                <p className="text-sm text-muted-foreground">Pull requests will appear here when created.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'commits' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Recent Commits</h3>
              <Badge variant="outline">{commits.length} shown</Badge>
            </div>
            
            {loading.commits ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading commits...</p>
              </div>
            ) : error.commits ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">{error.commits}</p>
              </div>
            ) : commits.length > 0 ? (
              <div className="space-y-4">
                {commits.map((commit) => (
                  <div key={commit.sha} className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      {commit.author ? (
                        <img 
                          src={commit.author.avatar_url} 
                          alt={commit.author.login}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <GitCommit className="h-5 w-5" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">
                          {commit.commit.message.split('\n')[0]}
                        </h4>
                        {commit.commit.message.split('\n').length > 1 && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {commit.commit.message.split('\n').slice(1).join('\n').trim()}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{commit.author?.login || commit.commit.author.name}</span>
                          <span>committed {formatDate(commit.commit.author.date)}</span>
                          {commit.stats && (
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">+{commit.stats.additions}</span>
                              <span className="text-red-600">-{commit.stats.deletions}</span>
                            </div>
                          )}
                          <Link to={commit.html_url} target="_blank" className="text-primary hover:underline">
                            {commit.sha.substring(0, 7)}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <GitCommit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No commits found</h3>
                <p className="text-sm text-muted-foreground">Commits will appear here when available.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'aicomments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">AI Comments for this Repository</h3>
              <Badge variant="outline">{repositoryAIComments.length} comments</Badge>
            </div>
            
            {repositoryAIComments.length > 0 ? (
              <div className="space-y-4">
                {repositoryAIComments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    onReaction={(_commentId, _reactionType) => {
                      // Handle reaction logic here
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No AI comments yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  AI comments will appear here when pull requests are opened with an active webhook.
                </p>
                {!webhookActive && (
                  <Button onClick={handleWebhookToggle} disabled={webhookLoading}>
                    <Webhook className="h-4 w-4 mr-2" />
                    {webhookLoading ? "Processing..." : "Activate AI Bot"}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Repository Settings</h3>
            
            {/* Webhook Settings */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                AI Bot Configuration
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h5 className="font-medium">AI Comment Generation</h5>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate AI comments for new pull requests
                    </p>
                  </div>
                  <Button 
                    variant={webhookActive ? "destructive" : "default"}
                    onClick={handleWebhookToggle}
                    disabled={webhookLoading}
                  >
                    {webhookLoading 
                      ? "Processing..." 
                      : webhookActive 
                        ? "Deactivate" 
                        : "Activate"
                    }
                  </Button>
                </div>
                
                {webhookActive && (
                  <div className="space-y-3 p-4 border border-border rounded-lg">
                    <h6 className="font-medium text-sm">Webhook Details</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <span className="ml-2">Active</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Events:</span>
                        <span className="ml-2">pull_request, pull_request_review_comment</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">URL:</span>
                        <span className="ml-2 font-mono text-xs">{import.meta.env.VITE_BACKEND_URL}/webhooks/pull-request</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Content Type:</span>
                        <span className="ml-2">application/json</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Repository Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Repository Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Default Branch:</span>
                  <span className="ml-2">{details?.default_branch || 'main'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Language:</span>
                  <span className="ml-2">{repositoryData.language || 'Not detected'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <span className="ml-2">{formatDate(repositoryData.created_at)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="ml-2">{formatDate(repositoryData.updated_at)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Clone URL:</span>
                  <span className="ml-2 font-mono text-xs break-all">{repositoryData.clone_url}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Visibility:</span>
                  <span className="ml-2 capitalize">{repositoryData.private ? 'private' : 'public'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoryPage;
