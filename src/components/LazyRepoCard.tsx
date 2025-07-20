import React, { useState, useRef, useEffect, useCallback } from 'react';
import RepoCard from '@/components/RepoCard';
import { Repository } from '@/api/useRepositories';
import axios from 'axios';

interface LazyRepoCardProps {
  data: Repository;
  setActive: () => void;
  setDeactive: () => void;
  activated: boolean;
  onIntersect?: (repoId: string) => void;
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

interface RepositoryDetails {
  latest_commit?: {
    sha: string;
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  contributors_count?: number;
  languages?: Record<string, number>;
  topics?: string[];
  license?: {
    key: string;
    name: string;
  };
  size: number;
  default_branch: string;
}

const LazyRepoCard: React.FC<LazyRepoCardProps> = ({
  data,
  setActive,
  setDeactive,
  activated,
  onIntersect,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [details, setDetails] = useState<RepositoryDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect when card becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          onIntersect?.(data.id.toString());
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before the card is visible
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [data.id, isVisible, onIntersect]);

  // Fetch repository details when card becomes visible
  const fetchRepositoryDetails = useCallback(async () => {
    if (!isVisible || details || detailsLoading) return;

    setDetailsLoading(true);
    setDetailsError(null);

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const [owner, name] = data.full_name.split('/');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/repositories/${owner}/${name}/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.status === 200) {
        setDetails(response.data);
      }
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        setDetailsError('Request timeout');
      } else if (error.response?.status === 404) {
        setDetailsError('Repository not found');
      } else if (error.response?.status === 403) {
        setDetailsError('Access denied');
      } else {
        setDetailsError('Failed to load details');
      }
      console.warn(`Failed to fetch details for ${data.full_name}:`, error.message);
    } finally {
      setDetailsLoading(false);
    }
  }, [isVisible, details, detailsLoading, data.full_name]);

  useEffect(() => {
    if (isVisible && !details && !detailsLoading && !detailsError) {
      fetchRepositoryDetails();
    }
  }, [isVisible, details, detailsLoading, detailsError, fetchRepositoryDetails]);

  // Map Repository to ExtendedRepo format with enhanced details
  const mapRepository = useCallback((): ExtendedRepo => {
    const baseRepo = {
      id: data.id.toString(),
      name: data.name,
      full_name: data.full_name,
      html_url: data.html_url,
      description: data.description || '',
      language: data.language || '',
      default_branch: details?.default_branch || 'main',
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

    return baseRepo;
  }, [data, details]);

  // Enhanced repo card with additional details
  const EnhancedRepoCard = () => {
    const mappedRepo = mapRepository();

    return (
      <div className="relative">
        <RepoCard
          data={mappedRepo}
          setActive={setActive}
          setDeactive={setDeactive}
          activated={activated}
        />
        
        {/* Lazy-loaded details overlay */}
        {isVisible && (details || detailsLoading || detailsError) && (
          <div className="absolute top-2 right-2 z-10">
            {detailsLoading && (
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {detailsError && (
              <div 
                className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center cursor-pointer"
                title={`Failed to load details: ${detailsError}`}
                onClick={() => {
                  setDetailsError(null);
                  fetchRepositoryDetails();
                }}
              >
                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            )}
            
            {details && (
              <div 
                className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center cursor-pointer"
                title="Enhanced details loaded"
              >
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        )}

        {/* Enhanced details panel */}
        {details && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-2 rounded-b-lg">
            <div className="text-xs text-muted-foreground space-y-1">
              {details.latest_commit && (
                <div className="truncate" title={details.latest_commit.message}>
                  Latest: {details.latest_commit.message.substring(0, 40)}...
                </div>
              )}
              
              {details.contributors_count && (
                <div>{details.contributors_count} contributors</div>
              )}
              
              {details.topics && details.topics.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {details.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="px-1 py-0.5 text-xs bg-muted rounded text-muted-foreground"
                    >
                      {topic}
                    </span>
                  ))}
                  {details.topics.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{details.topics.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={cardRef} className="h-full">
      <EnhancedRepoCard />
    </div>
  );
};

export default LazyRepoCard;