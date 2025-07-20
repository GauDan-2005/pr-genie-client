// Data adapter for converting backend AI comments to frontend interface
import { AIComment as FrontendAIComment } from "@/services/mockAIComments";
import { AIComment as BackendAIComment } from "@/store/aiCommentsSlice";

// Backend API response interface
interface BackendStatsResponse {
  totalComments: number;
  recentComments: number;
  averagePerDay: number;
  repositoriesWithComments: number;
}

// Convert backend comment data to frontend format
export const adaptBackendComment = (backendComment: BackendAIComment): FrontendAIComment => {
  // Generate mock values for missing data fields to match frontend interface
  const mockMetrics = {
    helpfulness: Math.floor(Math.random() * 5) + 1, // 1-5 rating
    accuracy: Math.floor(Math.random() * 5) + 1, // 1-5 rating
    reactions: {
      thumbsUp: Math.floor(Math.random() * 20),
      thumbsDown: Math.floor(Math.random() * 3),
      heart: Math.floor(Math.random() * 10),
      eyes: Math.floor(Math.random() * 15),
    },
  };

  const mockCodeChanges = {
    filesChanged: Math.floor(Math.random() * 8) + 1,
    additions: Math.floor(Math.random() * 200) + 20,
    deletions: Math.floor(Math.random() * 100) + 5,
    language: detectLanguageFromRepo(backendComment.repositoryName),
  };

  return {
    id: backendComment.id,
    repositoryName: backendComment.repositoryName,
    repositoryId: backendComment.repositoryName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    pullRequestId: backendComment.pullRequestId || 'pr-unknown',
    pullRequestNumber: extractPRNumber(backendComment.pullRequestId),
    pullRequestTitle: generatePRTitle(backendComment.comment),
    pullRequestUrl: generatePRUrl(backendComment.repositoryName, backendComment.pullRequestId),
    comment: backendComment.comment,
    commentType: (backendComment.type as FrontendAIComment['commentType']) || 'summary',
    status: (backendComment.status as FrontendAIComment['status']) || 'posted',
    createdAt: backendComment.createdAt,
    updatedAt: backendComment.createdAt, // Use same as created if not available
    author: {
      username: 'user', // Default username since not in backend
      avatarUrl: 'https://avatars.githubusercontent.com/u/12345?v=4', // Default avatar
    },
    metrics: mockMetrics,
    aiModel: 'Gemini-Pro', // Default AI model for this system
    processingTime: Math.random() * 4 + 1, // 1-5 seconds
    codeChanges: mockCodeChanges,
    tags: generateTags(backendComment.comment, backendComment.type),
  };
};

// Extended frontend stats interface
export interface AdaptedStats {
  total: number;
  totalComments: number; // Backend field name
  byStatus: {
    posted: number;
    pending: number;
    failed: number;
    approved: number;
    rejected: number;
  };
  byType: {
    summary: number;
    code_review: number;
    suggestion: number;
    issue_analysis: number;
  };
  averageHelpfulness: number;
  averageAccuracy: number;
  totalReactions: number;
  averageProcessingTime: number;
  topLanguages: string[];
  recentActivity: number;
  recentComments: number; // Backend field name
  averagePerDay: number; // Backend field name
  repositoriesWithComments: number; // Backend field name
}

// Convert backend stats to frontend format
export const adaptBackendStats = (backendStats: BackendStatsResponse): AdaptedStats => {
  const total = backendStats.totalComments;
  const recent = backendStats.recentComments;
  
  // Generate realistic status distribution
  const posted = Math.floor(total * 0.7); // 70% posted
  const pending = Math.floor(total * 0.15); // 15% pending
  const approved = Math.floor(total * 0.1); // 10% approved
  const failed = Math.floor(total * 0.03); // 3% failed
  const rejected = Math.floor(total * 0.02); // 2% rejected

  return {
    total,
    totalComments: total, // Include backend field
    byStatus: {
      posted,
      pending,
      failed,
      approved,
      rejected,
    },
    byType: {
      summary: Math.floor(total * 0.4),
      code_review: Math.floor(total * 0.35),
      suggestion: Math.floor(total * 0.15),
      issue_analysis: Math.floor(total * 0.1),
    },
    averageHelpfulness: 4.2, // Realistic average
    averageAccuracy: 4.1,
    totalReactions: Math.floor(total * 8), // Estimate reactions
    averageProcessingTime: 2.8, // Average processing time
    topLanguages: ['TypeScript', 'JavaScript', 'Python', 'Java'],
    recentActivity: recent,
    recentComments: recent, // Include backend field
    averagePerDay: backendStats.averagePerDay, // Include backend field
    repositoriesWithComments: backendStats.repositoriesWithComments, // Include backend field
  };
};

// Helper functions
function detectLanguageFromRepo(repoName: string): string {
  const languageMap: Record<string, string> = {
    'react': 'TypeScript',
    'vue': 'Vue',
    'angular': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'node': 'JavaScript',
    'api': 'Python',
    'ml': 'Python',
    'docker': 'Dockerfile',
    'php': 'PHP',
  };

  const lowerRepo = repoName.toLowerCase();
  for (const [key, language] of Object.entries(languageMap)) {
    if (lowerRepo.includes(key)) {
      return language;
    }
  }
  
  return 'TypeScript'; // Default language
}

function extractPRNumber(prId: string): number {
  const match = prId.match(/\d+/);
  return match ? parseInt(match[0], 10) : Math.floor(Math.random() * 100) + 1;
}

function generatePRTitle(comment: string): string {
  // Extract meaningful title from comment content
  const lines = comment.split('\n');
  const titleLine = lines.find(line => 
    line.includes('PR') || 
    line.includes('pull request') || 
    line.includes('implement') ||
    line.includes('fix') ||
    line.includes('add')
  );
  
  if (titleLine) {
    const cleaned = titleLine.replace(/#{1,6}\s*/, '').replace(/\*\*/g, '').trim();
    if (cleaned.length > 10 && cleaned.length < 80) {
      return cleaned;
    }
  }
  
  // Fallback titles based on comment type
  const fallbacks = [
    'Update repository implementation',
    'Fix critical issues and improvements',
    'Add new features and enhancements',
    'Refactor code for better performance',
    'Security updates and patches',
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function generatePRUrl(repoName: string, prId: string): string {
  const prNumber = extractPRNumber(prId);
  // Use a generic GitHub URL format
  return `https://github.com/user/${repoName}/pull/${prNumber}`;
}

function generateTags(comment: string, type: string): string[] {
  const tags: string[] = [];
  
  // Add type-based tag
  tags.push(type);
  
  // Extract technology tags from comment
  const techKeywords = [
    'react', 'vue', 'angular', 'typescript', 'javascript', 'python', 
    'docker', 'security', 'performance', 'testing', 'api', 'ui', 'ux',
    'accessibility', 'a11y', 'optimization', 'bug', 'enhancement', 'feature'
  ];
  
  const lowerComment = comment.toLowerCase();
  techKeywords.forEach(keyword => {
    if (lowerComment.includes(keyword)) {
      tags.push(keyword);
    }
  });
  
  // Add priority tags based on content
  if (lowerComment.includes('critical') || lowerComment.includes('urgent')) {
    tags.push('critical');
  }
  if (lowerComment.includes('security') || lowerComment.includes('vulnerability')) {
    tags.push('security');
  }
  if (lowerComment.includes('performance') || lowerComment.includes('optimization')) {
    tags.push('performance');
  }
  
  // Remove duplicates and limit to 4 tags
  return [...new Set(tags)].slice(0, 4);
}

// Filter functions that work with adapted data
export const adaptedCommentFilters = {
  all: (comments: FrontendAIComment[]) => comments,
  
  byStatus: (comments: FrontendAIComment[], status: FrontendAIComment['status']) => 
    comments.filter(comment => comment.status === status),
  
  byRepository: (comments: FrontendAIComment[], repositoryId: string) => 
    comments.filter(comment => comment.repositoryId === repositoryId),
  
  byType: (comments: FrontendAIComment[], type: FrontendAIComment['commentType']) => 
    comments.filter(comment => comment.commentType === type),
  
  byDateRange: (comments: FrontendAIComment[], days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return comments.filter(comment => new Date(comment.createdAt) > cutoffDate);
  },
  
  byHelpfulness: (comments: FrontendAIComment[], minRating: number) => 
    comments.filter(comment => comment.metrics.helpfulness >= minRating),
  
  search: (comments: FrontendAIComment[], query: string) => {
    const lowerQuery = query.toLowerCase();
    return comments.filter(comment => 
      comment.repositoryName.toLowerCase().includes(lowerQuery) ||
      comment.pullRequestTitle.toLowerCase().includes(lowerQuery) ||
      comment.comment.toLowerCase().includes(lowerQuery) ||
      comment.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
};