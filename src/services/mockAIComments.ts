export interface AIComment {
  id: string;
  repositoryName: string;
  repositoryId: string;
  pullRequestId: string;
  pullRequestNumber: number;
  pullRequestTitle: string;
  pullRequestUrl: string;
  comment: string;
  commentType: 'summary' | 'code_review' | 'suggestion' | 'issue_analysis';
  status: 'posted' | 'pending' | 'failed' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
    avatarUrl: string;
  };
  metrics: {
    helpfulness: number; // 1-5 rating
    accuracy: number; // 1-5 rating
    reactions: {
      thumbsUp: number;
      thumbsDown: number;
      heart: number;
      eyes: number;
    };
  };
  aiModel: string;
  processingTime: number; // in seconds
  codeChanges: {
    filesChanged: number;
    additions: number;
    deletions: number;
    language: string;
  };
  tags: string[];
}

// Mock AI comments data
export const mockAIComments: AIComment[] = [
  {
    id: "ai-comment-1",
    repositoryName: "react-dashboard",
    repositoryId: "1",
    pullRequestId: "pr-101",
    pullRequestNumber: 15,
    pullRequestTitle: "Add dark mode toggle functionality",
    pullRequestUrl: "https://github.com/user/react-dashboard/pull/15",
    comment: `## PR Summary 📋

This pull request introduces a comprehensive dark mode toggle feature to the React dashboard application.

### Key Changes:
- **Theme Context Implementation**: Added a new ThemeContext to manage global theme state
- **Dark Mode Styles**: Updated Tailwind CSS configuration with dark mode variants
- **Toggle Component**: Created a reusable toggle switch in the header
- **Local Storage**: Implemented theme persistence across browser sessions

### Files Modified:
- \`src/contexts/ThemeContext.tsx\` - New theme management context
- \`src/components/ThemeToggle.tsx\` - Toggle switch component  
- \`tailwind.config.js\` - Added dark mode configuration
- \`src/App.tsx\` - Wrapped app with theme provider

### Impact Analysis:
✅ **Positive**: Enhanced user experience with theme customization
✅ **Positive**: Follows modern UI/UX best practices
⚠️ **Note**: Consider testing across different screen sizes for consistency

The implementation looks solid and follows React best practices. Great work on maintaining clean component structure!`,
    commentType: 'summary',
    status: 'posted',
    createdAt: "2024-12-15T10:30:00Z",
    updatedAt: "2024-12-15T10:30:00Z",
    author: {
      username: "user",
      avatarUrl: "https://avatars.githubusercontent.com/u/12345?v=4"
    },
    metrics: {
      helpfulness: 5,
      accuracy: 4,
      reactions: {
        thumbsUp: 12,
        thumbsDown: 1,
        heart: 5,
        eyes: 8
      }
    },
    aiModel: "GPT-4",
    processingTime: 3.2,
    codeChanges: {
      filesChanged: 4,
      additions: 156,
      deletions: 23,
      language: "TypeScript"
    },
    tags: ["ui", "theme", "enhancement", "accessibility"]
  },
  {
    id: "ai-comment-2",
    repositoryName: "python-api",
    repositoryId: "2",
    pullRequestId: "pr-201",
    pullRequestNumber: 8,
    pullRequestTitle: "Fix authentication middleware security vulnerability",
    pullRequestUrl: "https://github.com/user/python-api/pull/8",
    comment: `## Security Fix Review 🔒

This PR addresses a critical security vulnerability in the authentication middleware.

### Security Improvements:
- **JWT Token Validation**: Enhanced token verification with proper signature checking
- **Rate Limiting**: Added request rate limiting to prevent brute force attacks
- **Input Sanitization**: Implemented proper input validation for auth endpoints
- **Error Handling**: Improved error responses to prevent information leakage

### Critical Changes:
1. \`middleware/auth.py\` - Fixed JWT verification logic
2. \`utils/validators.py\` - Added input sanitization functions
3. \`config/security.py\` - New security configuration constants

### Security Impact:
🚨 **HIGH PRIORITY**: This fix addresses CVE-2024-XXXX
✅ **Authentication**: Now properly validates token signatures
✅ **Authorization**: Prevents unauthorized access attempts
✅ **Logging**: Added security event logging for monitoring

**Recommendation**: Deploy this fix immediately and consider security audit of related endpoints.`,
    commentType: 'code_review',
    status: 'approved',
    createdAt: "2024-12-14T16:45:00Z",
    updatedAt: "2024-12-14T17:30:00Z",
    author: {
      username: "user",
      avatarUrl: "https://avatars.githubusercontent.com/u/12345?v=4"
    },
    metrics: {
      helpfulness: 5,
      accuracy: 5,
      reactions: {
        thumbsUp: 25,
        thumbsDown: 0,
        heart: 15,
        eyes: 20
      }
    },
    aiModel: "Claude-3.5",
    processingTime: 2.8,
    codeChanges: {
      filesChanged: 3,
      additions: 89,
      deletions: 67,
      language: "Python"
    },
    tags: ["security", "critical", "authentication", "vulnerability"]
  },
  {
    id: "ai-comment-3",
    repositoryName: "machine-learning-models",
    repositoryId: "5",
    pullRequestId: "pr-301",
    pullRequestNumber: 22,
    pullRequestTitle: "Optimize model training performance",
    pullRequestUrl: "https://github.com/user/machine-learning-models/pull/22",
    comment: `## Performance Optimization Analysis 🚀

This PR implements several optimizations to improve model training performance.

### Performance Improvements:
- **Batch Processing**: Increased batch size from 32 to 128 for better GPU utilization
- **Data Pipeline**: Implemented tf.data optimizations with prefetching and caching
- **Memory Management**: Added gradient accumulation to handle larger batches
- **Mixed Precision**: Enabled FP16 training for faster computation

### Benchmark Results:
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Training Speed | 45s/epoch | 28s/epoch | 38% faster |
| Memory Usage | 8.2GB | 6.1GB | 25% reduction |
| GPU Utilization | 65% | 89% | 37% increase |

### Code Quality:
✅ **Modularity**: Well-structured optimization functions
✅ **Documentation**: Clear comments explaining optimization strategies
⚠️ **Testing**: Consider adding performance regression tests

The optimizations are well-implemented and show significant performance gains!`,
    commentType: 'code_review',
    status: 'posted',
    createdAt: "2024-12-13T14:20:00Z",
    updatedAt: "2024-12-13T14:20:00Z",
    author: {
      username: "user",
      avatarUrl: "https://avatars.githubusercontent.com/u/12345?v=4"
    },
    metrics: {
      helpfulness: 4,
      accuracy: 5,
      reactions: {
        thumbsUp: 18,
        thumbsDown: 2,
        heart: 8,
        eyes: 12
      }
    },
    aiModel: "GPT-4",
    processingTime: 4.1,
    codeChanges: {
      filesChanged: 6,
      additions: 234,
      deletions: 145,
      language: "Python"
    },
    tags: ["performance", "optimization", "ml", "tensorflow"]
  },
  {
    id: "ai-comment-4",
    repositoryName: "docker-templates",
    repositoryId: "8",
    pullRequestId: "pr-401",
    pullRequestNumber: 5,
    pullRequestTitle: "Add Node.js production template",
    pullRequestUrl: "https://github.com/user/docker-templates/pull/5",
    comment: `## Docker Template Review 🐳

New production-ready Node.js Docker template looks comprehensive!

### Template Features:
- **Multi-stage Build**: Efficient build process with separate build and runtime stages
- **Security**: Non-root user configuration and minimal base image
- **Optimization**: Layer caching and .dockerignore for faster builds
- **Health Checks**: Proper health check endpoints configured

### Best Practices Implemented:
✅ Alpine Linux base for smaller image size
✅ npm ci for reproducible builds
✅ Proper signal handling for graceful shutdowns
✅ Environment variable configuration

### Suggestions:
💡 Consider adding Docker Compose example
💡 Add documentation for SSL/TLS configuration
💡 Include example for different Node.js versions

Great addition to the template collection!`,
    commentType: 'suggestion',
    status: 'posted',
    createdAt: "2024-12-12T09:15:00Z",
    updatedAt: "2024-12-12T09:15:00Z",
    author: {
      username: "user",
      avatarUrl: "https://avatars.githubusercontent.com/u/12345?v=4"
    },
    metrics: {
      helpfulness: 4,
      accuracy: 4,
      reactions: {
        thumbsUp: 14,
        thumbsDown: 1,
        heart: 6,
        eyes: 9
      }
    },
    aiModel: "Claude-3.5",
    processingTime: 1.9,
    codeChanges: {
      filesChanged: 2,
      additions: 78,
      deletions: 0,
      language: "Dockerfile"
    },
    tags: ["docker", "nodejs", "template", "devops"]
  },
  {
    id: "ai-comment-5",
    repositoryName: "vue-components",
    repositoryId: "7",
    pullRequestId: "pr-501",
    pullRequestNumber: 33,
    pullRequestTitle: "Fix button component accessibility issues",
    pullRequestUrl: "https://github.com/community/vue-components/pull/33",
    comment: `## Accessibility Improvements Review ♿

Excellent work on improving button component accessibility!

### Accessibility Enhancements:
- **ARIA Labels**: Added proper aria-label and aria-describedby attributes
- **Keyboard Navigation**: Implemented focus management and tab order
- **Screen Reader Support**: Added sr-only text for context
- **Color Contrast**: Updated colors to meet WCAG 2.1 AA standards

### Changes Made:
1. \`Button.vue\` - Enhanced with ARIA attributes
2. \`styles/button.scss\` - Improved focus indicators
3. \`tests/Button.spec.js\` - Added accessibility tests

### Compliance Status:
✅ **WCAG 2.1 Level AA**: All criteria met
✅ **Keyboard Navigation**: Full keyboard support
✅ **Screen Readers**: Compatible with NVDA, JAWS, VoiceOver
✅ **Color Contrast**: 4.5:1 ratio achieved

This is a valuable contribution to making the component library more inclusive!`,
    commentType: 'code_review',
    status: 'approved',
    createdAt: "2024-12-11T11:45:00Z",
    updatedAt: "2024-12-11T12:30:00Z",
    author: {
      username: "community",
      avatarUrl: "https://avatars.githubusercontent.com/u/98765?v=4"
    },
    metrics: {
      helpfulness: 5,
      accuracy: 5,
      reactions: {
        thumbsUp: 22,
        thumbsDown: 0,
        heart: 11,
        eyes: 15
      }
    },
    aiModel: "GPT-4",
    processingTime: 2.3,
    codeChanges: {
      filesChanged: 3,
      additions: 67,
      deletions: 34,
      language: "Vue"
    },
    tags: ["accessibility", "a11y", "ui", "components"]
  },
  {
    id: "ai-comment-6",
    repositoryName: "react-dashboard",
    repositoryId: "1",
    pullRequestId: "pr-102",
    pullRequestNumber: 16,
    pullRequestTitle: "Add unit tests for dashboard components",
    pullRequestUrl: "https://github.com/user/react-dashboard/pull/16",
    comment: `## Test Coverage Analysis 🧪

Great initiative on adding comprehensive unit tests!

### Test Coverage Summary:
- **Components**: 85% coverage across dashboard components
- **Utilities**: 92% coverage for helper functions
- **Hooks**: 78% coverage for custom hooks
- **Integration**: Basic component integration tests added

### Test Quality:
✅ **Comprehensive**: Tests cover happy path and edge cases
✅ **Maintainable**: Well-structured test files with clear descriptions
✅ **Mocking**: Proper mocking of external dependencies
⚠️ **Performance**: Consider adding performance regression tests

### Areas for Improvement:
💡 Add visual regression tests for UI components
💡 Include accessibility testing in test suite
💡 Consider adding E2E tests for critical user flows

The test suite significantly improves code reliability and maintainability!`,
    commentType: 'code_review',
    status: 'pending',
    createdAt: "2024-12-10T15:20:00Z",
    updatedAt: "2024-12-10T15:20:00Z",
    author: {
      username: "user",
      avatarUrl: "https://avatars.githubusercontent.com/u/12345?v=4"
    },
    metrics: {
      helpfulness: 4,
      accuracy: 4,
      reactions: {
        thumbsUp: 8,
        thumbsDown: 0,
        heart: 3,
        eyes: 6
      }
    },
    aiModel: "Claude-3.5",
    processingTime: 3.5,
    codeChanges: {
      filesChanged: 12,
      additions: 567,
      deletions: 23,
      language: "TypeScript"
    },
    tags: ["testing", "unit-tests", "coverage", "quality"]
  },
  {
    id: "ai-comment-7",
    repositoryName: "legacy-project",
    repositoryId: "4",
    pullRequestId: "pr-601",
    pullRequestNumber: 3,
    pullRequestTitle: "Security patches before archiving",
    pullRequestUrl: "https://github.com/user/legacy-project/pull/3",
    comment: `## Final Security Review 🔐

Last security update before project archival - important fixes identified.

### Security Patches Applied:
- **SQL Injection**: Fixed parameterized queries in user module
- **XSS Prevention**: Added input sanitization for form submissions
- **Dependency Updates**: Updated vulnerable packages to secure versions
- **Session Security**: Improved session handling and expiration

### Critical Fixes:
1. \`includes/database.php\` - SQL injection prevention
2. \`forms/contact.php\` - XSS protection
3. \`composer.json\` - Dependency security updates

### Pre-Archive Checklist:
✅ **Security**: All known vulnerabilities patched
✅ **Dependencies**: Updated to latest secure versions
✅ **Documentation**: Added security notes for future reference
⚠️ **Monitoring**: Consider setting up security monitoring even for archived project

These patches ensure the project remains secure even in archived state.`,
    commentType: 'code_review',
    status: 'failed',
    createdAt: "2024-12-09T13:10:00Z",
    updatedAt: "2024-12-09T13:45:00Z",
    author: {
      username: "user",
      avatarUrl: "https://avatars.githubusercontent.com/u/12345?v=4"
    },
    metrics: {
      helpfulness: 3,
      accuracy: 4,
      reactions: {
        thumbsUp: 5,
        thumbsDown: 1,
        heart: 2,
        eyes: 4
      }
    },
    aiModel: "GPT-4",
    processingTime: 2.1,
    codeChanges: {
      filesChanged: 8,
      additions: 134,
      deletions: 89,
      language: "PHP"
    },
    tags: ["security", "legacy", "patches", "archive"]
  }
];

// Helper functions for filtering AI comments
export const aiCommentFilters = {
  all: (comments: AIComment[]) => comments,
  
  byStatus: (comments: AIComment[], status: AIComment['status']) => 
    comments.filter(comment => comment.status === status),
  
  byRepository: (comments: AIComment[], repositoryId: string) => 
    comments.filter(comment => comment.repositoryId === repositoryId),
  
  byType: (comments: AIComment[], type: AIComment['commentType']) => 
    comments.filter(comment => comment.commentType === type),
  
  byDateRange: (comments: AIComment[], days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return comments.filter(comment => new Date(comment.createdAt) > cutoffDate);
  },
  
  byHelpfulness: (comments: AIComment[], minRating: number) => 
    comments.filter(comment => comment.metrics.helpfulness >= minRating),
  
  search: (comments: AIComment[], query: string) => {
    const lowerQuery = query.toLowerCase();
    return comments.filter(comment => 
      comment.repositoryName.toLowerCase().includes(lowerQuery) ||
      comment.pullRequestTitle.toLowerCase().includes(lowerQuery) ||
      comment.comment.toLowerCase().includes(lowerQuery) ||
      comment.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
};

// Get AI comment statistics
export const getAICommentStats = (comments: AIComment[]) => {
  return {
    total: comments.length,
    byStatus: {
      posted: comments.filter(c => c.status === 'posted').length,
      pending: comments.filter(c => c.status === 'pending').length,
      failed: comments.filter(c => c.status === 'failed').length,
      approved: comments.filter(c => c.status === 'approved').length,
      rejected: comments.filter(c => c.status === 'rejected').length,
    },
    byType: {
      summary: comments.filter(c => c.commentType === 'summary').length,
      code_review: comments.filter(c => c.commentType === 'code_review').length,
      suggestion: comments.filter(c => c.commentType === 'suggestion').length,
      issue_analysis: comments.filter(c => c.commentType === 'issue_analysis').length,
    },
    averageHelpfulness: comments.reduce((sum, c) => sum + c.metrics.helpfulness, 0) / comments.length,
    averageAccuracy: comments.reduce((sum, c) => sum + c.metrics.accuracy, 0) / comments.length,
    totalReactions: comments.reduce((sum, c) => 
      sum + c.metrics.reactions.thumbsUp + c.metrics.reactions.heart, 0),
    averageProcessingTime: comments.reduce((sum, c) => sum + c.processingTime, 0) / comments.length,
    topLanguages: [...new Set(comments.map(c => c.codeChanges.language))],
    recentActivity: comments.filter(c => 
      new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length
  };
};

// Get filtered AI comments
export const getFilteredAIComments = (
  filterType: keyof typeof aiCommentFilters, 
  ...args: any[]
): AIComment[] => {
  const filterFn = aiCommentFilters[filterType];
  return (filterFn as any)(mockAIComments, ...args);
};