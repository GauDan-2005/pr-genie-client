import { ExtendedRepo } from "./mockData";
import { AIComment } from "./mockAIComments";

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  merged_at?: string;
  closed_at?: string;
  body: string;
  html_url: string;
  diff_url: string;
  commits_url: string;
  comments_url: string;
  additions: number;
  deletions: number;
  changed_files: number;
  mergeable: boolean | null;
  draft: boolean;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
  labels: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  assignees: Array<{
    login: string;
    avatar_url: string;
  }>;
  milestone?: {
    title: string;
    due_on?: string;
  };
  aiComments?: AIComment[];
}

export interface Commit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
}

export interface RepositoryDetails extends ExtendedRepo {
  readme: {
    content: string;
    encoding: string;
    download_url: string;
  };
  pullRequests: PullRequest[];
  recentCommits: Commit[];
  webhookStatus: {
    active: boolean;
    webhookId?: string;
    events: string[];
    config: {
      url: string;
      content_type: string;
    };
    created_at?: string;
    updated_at?: string;
  };
  activity: {
    lastCommit: string;
    lastPullRequest: string;
    commitsThisWeek: number;
    issuesThisWeek: number;
    prsThisWeek: number;
  };
  collaborators: Array<{
    login: string;
    avatar_url: string;
    role: 'admin' | 'maintain' | 'write' | 'triage' | 'read';
  }>;
  deployments: Array<{
    id: string;
    environment: string;
    state: 'success' | 'failure' | 'pending' | 'in_progress';
    created_at: string;
    updated_at: string;
    deployed_at?: string;
    creator: {
      login: string;
      avatar_url: string;
    };
  }>;
}

// Mock README content for different repositories
const mockReadmeContent: Record<string, string> = {
  "1": `# React Dashboard

A modern, responsive dashboard built with React, TypeScript, and Tailwind CSS.

## Features

- 🌓 **Dark/Light Mode**: Toggle between themes with persistent storage
- 📊 **Interactive Charts**: Beautiful data visualizations with Chart.js
- 📱 **Responsive Design**: Works seamlessly across all device sizes
- 🔒 **Authentication**: Secure login with JWT tokens
- 🎨 **Modern UI**: Clean interface with Tailwind CSS
- ⚡ **Performance**: Optimized with React.memo and lazy loading

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Charts**: Chart.js, React-Chartjs-2
- **Routing**: React Router v6
- **State**: Redux Toolkit
- **Build**: Vite
- **Testing**: Jest, React Testing Library

## Project Structure

\`\`\`
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── store/           # Redux store configuration
├── services/        # API services
├── utils/           # Utility functions
└── types/           # TypeScript type definitions
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.`,

  "2": `# Python API

A robust RESTful API built with FastAPI and PostgreSQL for scalable web applications.

## Features

- 🚀 **FastAPI**: High-performance async API framework
- 🗄️ **PostgreSQL**: Reliable and scalable database
- 🔐 **JWT Authentication**: Secure token-based auth
- 📝 **Auto Documentation**: Interactive API docs with Swagger/OpenAPI
- 🧪 **Testing**: Comprehensive test suite with pytest
- 🐳 **Docker**: Containerized development and deployment
- 📊 **Monitoring**: Built-in health checks and metrics

## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/user/python-api.git
cd python-api

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
alembic upgrade head

# Start the server
uvicorn main:app --reload
\`\`\`

## API Endpoints

### Authentication
- \`POST /auth/login\` - User login
- \`POST /auth/register\` - User registration
- \`POST /auth/refresh\` - Refresh access token

### Users
- \`GET /users/me\` - Get current user profile
- \`PUT /users/me\` - Update user profile
- \`DELETE /users/me\` - Delete user account

### Data Management
- \`GET /items\` - List items with pagination
- \`POST /items\` - Create new item
- \`GET /items/{id}\` - Get item by ID
- \`PUT /items/{id}\` - Update item
- \`DELETE /items/{id}\` - Delete item

## Environment Variables

\`\`\`env
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
\`\`\`

## Testing

\`\`\`bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_auth.py
\`\`\`

## Deployment

### Docker

\`\`\`bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### Manual Deployment

\`\`\`bash
# Install production dependencies
pip install -r requirements.txt

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
\`\`\`

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.`,

  "5": `# Machine Learning Models

A collection of machine learning models and experiments built with TensorFlow and PyTorch.

## 🎯 Overview

This repository contains various machine learning implementations, from basic algorithms to advanced deep learning models. Perfect for learning, experimentation, and production use.

## 📚 Models Included

### Computer Vision
- **CNN Image Classifier**: Custom CNN for image classification
- **Transfer Learning**: Using pre-trained models (ResNet, VGG, etc.)
- **Object Detection**: YOLO implementation for real-time detection
- **Style Transfer**: Neural style transfer with VGG features

### Natural Language Processing
- **Sentiment Analysis**: LSTM and Transformer-based models
- **Text Generation**: GPT-style language models
- **Named Entity Recognition**: BiLSTM-CRF implementation
- **Text Summarization**: Seq2Seq with attention mechanism

### Time Series
- **Stock Prediction**: LSTM models for financial forecasting
- **Weather Forecasting**: Multi-variate time series prediction
- **Anomaly Detection**: Autoencoders for outlier detection

## 🛠️ Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/user/machine-learning-models.git
cd machine-learning-models

# Create conda environment
conda create -n ml-models python=3.9
conda activate ml-models

# Install dependencies
pip install -r requirements.txt

# For GPU support (optional)
pip install tensorflow-gpu torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
\`\`\`

## 🚀 Quick Start

### Image Classification Example

\`\`\`python
from models.vision.cnn_classifier import CNNClassifier
from utils.data_loader import load_cifar10

# Load data
train_data, test_data = load_cifar10()

# Initialize model
model = CNNClassifier(num_classes=10)

# Train model
model.fit(train_data, epochs=10, batch_size=32)

# Evaluate
accuracy = model.evaluate(test_data)
print(f"Test Accuracy: {accuracy:.2f}")
\`\`\`

### Text Sentiment Analysis

\`\`\`python
from models.nlp.sentiment_analyzer import SentimentLSTM
from utils.text_preprocessing import prepare_text_data

# Prepare data
train_texts, train_labels = prepare_text_data("data/sentiment/train.csv")

# Initialize and train model
model = SentimentLSTM(vocab_size=10000, embedding_dim=100)
model.train(train_texts, train_labels, epochs=5)

# Predict sentiment
sentiment = model.predict("This movie was absolutely amazing!")
print(f"Sentiment: {sentiment}")  # Output: Positive
\`\`\`

## 📊 Performance Benchmarks

| Model | Dataset | Accuracy | Training Time | Model Size |
|-------|---------|----------|---------------|------------|
| CNN Classifier | CIFAR-10 | 92.3% | 15 min | 2.1 MB |
| ResNet Transfer | ImageNet | 94.7% | 45 min | 25.6 MB |
| Sentiment LSTM | IMDB | 89.2% | 20 min | 5.3 MB |
| Stock Predictor | S&P 500 | 78.5% MAE | 30 min | 1.8 MB |

## 🔧 Configuration

Models can be configured using YAML files:

\`\`\`yaml
# config/cnn_config.yaml
model:
  name: "CNNClassifier"
  layers:
    - type: "conv2d"
      filters: 32
      kernel_size: 3
      activation: "relu"
    - type: "maxpool2d"
      pool_size: 2
    - type: "dropout"
      rate: 0.25

training:
  optimizer: "adam"
  learning_rate: 0.001
  batch_size: 32
  epochs: 50
\`\`\`

## 📈 Monitoring and Logging

All models include comprehensive logging and monitoring:

- **TensorBoard**: Real-time training visualization
- **MLflow**: Experiment tracking and model versioning
- **Wandb**: Advanced experiment management (optional)

\`\`\`bash
# Start TensorBoard
tensorboard --logdir=logs/

# View MLflow UI
mlflow ui
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
pytest tests/

# Run specific model tests
pytest tests/test_cnn_classifier.py

# Run with coverage
pytest --cov=models tests/
\`\`\`

## 📁 Project Structure

\`\`\`
├── models/
│   ├── vision/          # Computer vision models
│   ├── nlp/            # NLP models
│   ├── time_series/    # Time series models
│   └── common/         # Shared model components
├── data/
│   ├── raw/            # Raw datasets
│   ├── processed/      # Preprocessed data
│   └── external/       # External data sources
├── notebooks/          # Jupyter notebooks for experiments
├── scripts/            # Training and evaluation scripts
├── tests/              # Unit tests
├── config/             # Configuration files
└── utils/              # Utility functions
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

\`\`\`bash
# Install development dependencies
pip install -r requirements-dev.txt

# Install pre-commit hooks
pre-commit install

# Run code formatting
black .
isort .
flake8 .
\`\`\`

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- TensorFlow and PyTorch teams for excellent frameworks
- Open source community for datasets and pre-trained models
- Research papers that inspired these implementations

## 📞 Support

- 📧 Email: support@mlmodels.com
- 💬 Discord: [Join our community](https://discord.gg/mlmodels)
- 📖 Documentation: [docs.mlmodels.com](https://docs.mlmodels.com)
- 🐛 Issues: [GitHub Issues](https://github.com/user/machine-learning-models/issues)`
};

// Mock pull requests data
export const mockPullRequests: Record<string, PullRequest[]> = {
  "1": [
    {
      id: "pr-15",
      number: 15,
      title: "Add dark mode toggle functionality",
      state: "merged",
      user: {
        login: "user",
        avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
      },
      created_at: "2024-12-14T10:30:00Z",
      updated_at: "2024-12-15T16:45:00Z",
      merged_at: "2024-12-15T16:45:00Z",
      body: "This PR adds a comprehensive dark mode toggle feature to the dashboard. Includes theme persistence, smooth transitions, and proper contrast ratios.",
      html_url: "https://github.com/user/react-dashboard/pull/15",
      diff_url: "https://github.com/user/react-dashboard/pull/15.diff",
      commits_url: "https://github.com/user/react-dashboard/pull/15/commits",
      comments_url: "https://github.com/user/react-dashboard/pull/15/comments",
      additions: 156,
      deletions: 23,
      changed_files: 4,
      mergeable: null,
      draft: false,
      head: {
        ref: "feature/dark-mode",
        sha: "abc123def"
      },
      base: {
        ref: "main",
        sha: "def456ghi"
      },
      labels: [
        { id: 1, name: "enhancement", color: "a2eeef" },
        { id: 2, name: "ui", color: "0075ca" }
      ],
      assignees: [
        {
          login: "user",
          avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
        }
      ]
    },
    {
      id: "pr-14",
      number: 14,
      title: "Fix responsive layout issues on mobile",
      state: "closed",
      user: {
        login: "contributor1",
        avatar_url: "https://avatars.githubusercontent.com/u/67890?v=4"
      },
      created_at: "2024-12-10T14:20:00Z",
      updated_at: "2024-12-12T09:15:00Z",
      closed_at: "2024-12-12T09:15:00Z",
      body: "Addresses mobile layout issues reported in #23. Improves responsive breakpoints and fixes sidebar navigation on small screens.",
      html_url: "https://github.com/user/react-dashboard/pull/14",
      diff_url: "https://github.com/user/react-dashboard/pull/14.diff",
      commits_url: "https://github.com/user/react-dashboard/pull/14/commits",
      comments_url: "https://github.com/user/react-dashboard/pull/14/comments",
      additions: 89,
      deletions: 45,
      changed_files: 6,
      mergeable: true,
      draft: false,
      head: {
        ref: "fix/mobile-layout",
        sha: "ghi789jkl"
      },
      base: {
        ref: "main",
        sha: "def456ghi"
      },
      labels: [
        { id: 3, name: "bug", color: "d73a4a" },
        { id: 4, name: "mobile", color: "f9c23c" }
      ],
      assignees: []
    }
  ],
  "2": [
    {
      id: "pr-8",
      number: 8,
      title: "Fix authentication middleware security vulnerability",
      state: "merged",
      user: {
        login: "security-team",
        avatar_url: "https://avatars.githubusercontent.com/u/11111?v=4"
      },
      created_at: "2024-12-13T16:45:00Z",
      updated_at: "2024-12-14T17:30:00Z",
      merged_at: "2024-12-14T17:30:00Z",
      body: "**SECURITY FIX**: Addresses critical JWT verification vulnerability. This fix prevents token signature bypass attacks and implements proper rate limiting.",
      html_url: "https://github.com/user/python-api/pull/8",
      diff_url: "https://github.com/user/python-api/pull/8.diff",
      commits_url: "https://github.com/user/python-api/pull/8/commits",
      comments_url: "https://github.com/user/python-api/pull/8/comments",
      additions: 89,
      deletions: 67,
      changed_files: 3,
      mergeable: null,
      draft: false,
      head: {
        ref: "security/fix-jwt-validation",
        sha: "sec123abc"
      },
      base: {
        ref: "main",
        sha: "main456def"
      },
      labels: [
        { id: 5, name: "security", color: "b60205" },
        { id: 6, name: "critical", color: "d73a4a" }
      ],
      assignees: [
        {
          login: "security-team",
          avatar_url: "https://avatars.githubusercontent.com/u/11111?v=4"
        }
      ],
      milestone: {
        title: "Security Patch v1.2.1",
        due_on: "2024-12-15T00:00:00Z"
      }
    }
  ]
};

// Mock recent commits
export const mockRecentCommits: Record<string, Commit[]> = {
  "1": [
    {
      sha: "abc123def456",
      commit: {
        author: {
          name: "John Doe",
          email: "john@example.com",
          date: "2024-12-15T16:45:00Z"
        },
        committer: {
          name: "John Doe",
          email: "john@example.com",
          date: "2024-12-15T16:45:00Z"
        },
        message: "feat: add dark mode toggle with theme persistence\n\n- Implement ThemeContext for global theme state\n- Add toggle component with smooth transitions\n- Store theme preference in localStorage\n- Update Tailwind config for dark mode variants"
      },
      author: {
        login: "user",
        avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
      },
      html_url: "https://github.com/user/react-dashboard/commit/abc123def456",
      stats: {
        additions: 156,
        deletions: 23,
        total: 179
      }
    },
    {
      sha: "def456ghi789",
      commit: {
        author: {
          name: "Jane Smith",
          email: "jane@example.com",
          date: "2024-12-14T14:20:00Z"
        },
        committer: {
          name: "Jane Smith",
          email: "jane@example.com",
          date: "2024-12-14T14:20:00Z"
        },
        message: "fix: resolve mobile responsiveness issues\n\n- Fix sidebar navigation on small screens\n- Improve responsive breakpoints\n- Update grid layouts for mobile"
      },
      author: {
        login: "contributor1",
        avatar_url: "https://avatars.githubusercontent.com/u/67890?v=4"
      },
      html_url: "https://github.com/user/react-dashboard/commit/def456ghi789",
      stats: {
        additions: 89,
        deletions: 45,
        total: 134
      }
    }
  ]
};

// Get repository details by ID
export const getRepositoryDetails = (repoId: string): RepositoryDetails | null => {
  // This would normally fetch from an API, but for mock data we'll construct it
  const baseRepo = {
    id: repoId,
    name: repoId === "1" ? "react-dashboard" : repoId === "2" ? "python-api" : "machine-learning-models",
    // Add other required fields based on the repo ID
  } as ExtendedRepo;

  return {
    ...baseRepo,
    readme: {
      content: mockReadmeContent[repoId] || "# Repository\n\nNo README available.",
      encoding: "base64",
      download_url: `https://api.github.com/repos/user/${baseRepo.name}/contents/README.md`
    },
    pullRequests: mockPullRequests[repoId] || [],
    recentCommits: mockRecentCommits[repoId] || [],
    webhookStatus: {
      active: Math.random() > 0.5,
      webhookId: `webhook-${repoId}`,
      events: ["pull_request", "pull_request_review_comment"],
      config: {
        url: "https://api.prgenie.com/webhooks/pull-request",
        content_type: "json"
      },
      created_at: "2024-12-01T10:00:00Z",
      updated_at: "2024-12-10T15:30:00Z"
    },
    activity: {
      lastCommit: "2024-12-15T16:45:00Z",
      lastPullRequest: "2024-12-14T10:30:00Z",
      commitsThisWeek: Math.floor(Math.random() * 20) + 5,
      issuesThisWeek: Math.floor(Math.random() * 5),
      prsThisWeek: Math.floor(Math.random() * 3) + 1
    },
    collaborators: [
      {
        login: "user",
        avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4",
        role: "admin"
      },
      {
        login: "contributor1",
        avatar_url: "https://avatars.githubusercontent.com/u/67890?v=4",
        role: "write"
      }
    ],
    deployments: [
      {
        id: "deploy-1",
        environment: "production",
        state: "success",
        created_at: "2024-12-15T18:00:00Z",
        updated_at: "2024-12-15T18:15:00Z",
        deployed_at: "2024-12-15T18:15:00Z",
        creator: {
          login: "user",
          avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
        }
      }
    ]
  } as RepositoryDetails;
};