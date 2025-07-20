import React, { useState, useCallback } from 'react';
import { Repository } from '@/api/useRepositories';
import LazyImage from '@/components/LazyImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Star, 
  GitFork, 
  Eye, 
  Lock, 
  Globe, 
  Archive,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface EnhancedRepoCardProps {
  data: Repository;
  setActive: () => void;
  setDeactive: () => void;
  activated: boolean;
  enableLazyLoading?: boolean;
  showEnhancedDetails?: boolean;
}

interface ExtendedRepo {
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
  private: boolean;
  fork: boolean;
  archived: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const EnhancedRepoCard: React.FC<EnhancedRepoCardProps> = ({
  data,
  setActive,
  setDeactive,
  activated,
  enableLazyLoading = true,
  showEnhancedDetails = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Map Repository to ExtendedRepo format
  const mappedRepo: ExtendedRepo = {
    id: data.id.toString(),
    name: data.name,
    full_name: data.full_name,
    html_url: data.html_url,
    description: data.description || '',
    language: data.language || '',
    default_branch: 'main',
    created_at: data.created_at,
    updated_at: data.updated_at,
    clone_url: data.clone_url,
    forks_count: data.forks_count,
    stargazers_count: data.stargazers_count,
    open_issues_count: data.open_issues_count,
    visibility: data.private ? 'private' : 'public',
    private: data.private,
    fork: data.fork,
    archived: data.archived,
    owner: data.owner,
  };

  // Calculate time since last update
  const getTimeSinceUpdate = useCallback((dateString: string) => {
    const now = new Date();
    const updated = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - updated.getTime()) / (1000 * 3600 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  }, []);

  // Get language color
  const getLanguageColor = useCallback((language: string) => {
    const colors: Record<string, string> = {
      JavaScript: '#f7df1e',
      TypeScript: '#007acc',
      Python: '#3776ab',
      Java: '#ed8b00',
      'C++': '#00599c',
      'C#': '#239120',
      PHP: '#777bb4',
      Ruby: '#cc342d',
      Go: '#00add8',
      Rust: '#dea584',
      Swift: '#fa7343',
      Kotlin: '#7f52ff',
      Vue: '#4fc08d',
      React: '#61dafb',
      Angular: '#dd0031',
      HTML: '#e34c26',
      CSS: '#1572b6',
      Shell: '#89e051',
    };
    return colors[language] || '#6b7280';
  }, []);

  // Truncate description
  const truncatedDescription = mappedRepo.description.length > 120 
    ? mappedRepo.description.substring(0, 120) + '...'
    : mappedRepo.description;

  return (
    <Card 
      className={`h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
        activated ? 'ring-2 ring-green-500' : ''
      } ${mappedRepo.archived ? 'opacity-75' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Repository Owner Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              {enableLazyLoading ? (
                <LazyImage
                  src={mappedRepo.owner.avatar_url}
                  alt={`${mappedRepo.owner.login} avatar`}
                  className="w-full h-full"
                  sizes="40px"
                />
              ) : (
                <img
                  src={mappedRepo.owner.avatar_url}
                  alt={`${mappedRepo.owner.login} avatar`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm truncate">
                  {mappedRepo.name}
                </h3>
                {/* Status Badges */}
                <div className="flex items-center space-x-1">
                  {mappedRepo.private && (
                    <Lock className="w-3 h-3 text-muted-foreground" />
                  )}
                  {mappedRepo.fork && (
                    <GitFork className="w-3 h-3 text-muted-foreground" />
                  )}
                  {mappedRepo.archived && (
                    <Archive className="w-3 h-3 text-yellow-500" />
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {mappedRepo.owner.login}
              </p>
            </div>
          </div>
          
          {/* Webhook Status Indicator */}
          <div className="flex-shrink-0">
            {activated ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description */}
        {mappedRepo.description && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {showFullDescription ? mappedRepo.description : truncatedDescription}
            </p>
            {mappedRepo.description.length > 120 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-xs text-primary hover:underline mt-1"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}

        {/* Repository Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-muted-foreground">{mappedRepo.stargazers_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitFork className="w-4 h-4 text-blue-500" />
            <span className="text-muted-foreground">{mappedRepo.forks_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4 text-gray-500" />
            <span className="text-muted-foreground">{mappedRepo.open_issues_count}</span>
          </div>
        </div>

        {/* Language and Last Updated */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          {mappedRepo.language && (
            <div className="flex items-center space-x-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getLanguageColor(mappedRepo.language) }}
              />
              <span>{mappedRepo.language}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{getTimeSinceUpdate(mappedRepo.updated_at)}</span>
          </div>
        </div>

        {/* Enhanced Details (if enabled) */}
        {showEnhancedDetails && isHovered && (
          <div className="border-t pt-3 space-y-2 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Created:</span>
              <span>{new Date(mappedRepo.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Visibility:</span>
              <div className="flex items-center space-x-1">
                {mappedRepo.private ? (
                  <>
                    <Lock className="w-3 h-3" />
                    <span>Private</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3 h-3" />
                    <span>Public</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-4">
          <Button
            onClick={activated ? setDeactive : setActive}
            variant={activated ? "destructive" : "default"}
            size="sm"
            className="flex-1"
            disabled={mappedRepo.archived}
          >
            {activated ? "Deactivate" : "Activate"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-shrink-0"
          >
            <a
              href={mappedRepo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedRepoCard;