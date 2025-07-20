# PR Genie - Frontend

PR Genie is a web-based platform designed to streamline the GitHub Pull Request (PR) review process with the help of AI. This repository contains the frontend code for PR Genie, built with React and integrated with GitHub OAuth for seamless authentication and interaction with user repositories.

## Video Explanation

https://github.com/user-attachments/assets/0e06b4a4-2cda-44e6-a619-a3e55002b95f




## Features

- **GitHub OAuth Integration**: Log in with your GitHub account to manage and review pull requests.
- **AI-Powered PR Review**: Automatically generate insightful PR reviews using AI.
- **Task Management**: Organize tasks and manage the status of each PR (e.g., Backlog, In Progress, Done).
- **Collaborative Dashboard**: View and manage your repositories and pull requests in one place.

## Tech Stack

- **React**: Frontend JavaScript framework.
- **Axios**: HTTP client to interact with the backend API.
- **React Router**: Handle routing within the application.
- **Toastify**: Notification system for alerts and updates.
- **Vite**: Frontend build tool for fast development.

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) installed.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/GauDan-2005/pr-genie-frontend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd pr-genie-frontend
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create an `.env` file in the root directory and add the following environment variables:

   ```bash
   VITE_BACKEND_URL={your-server-url}
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173` to view the application.

### Building for Production

To build the project for production, run the following command:

```bash
npm run build
```

This will create a `dist/` folder containing the optimized production build.

### GitHub OAuth Configuration

The frontend uses GitHub OAuth for authentication. Ensure that the backend URL (`VITE_BACKEND_URL`) is correctly configured in the `.env` file.

### Folder Structure

```
src/
├── api/               # Axios API calls
├── assets/            # Images, logos, and static assets
├── components/        # Reusable components
├── pages/             # Main pages (Login, Dashboard, etc.)
├── styles/            # CSS and styling files
├── App.tsx            # Main entry file
├── index.tsx          # Main render file
```

### Key Endpoints

- **GitHub OAuth**: `https://{server-url}/auth/github`
- **GitHub OAuth Callback**: `https://{server-url}/auth/github/callback`
- **Fetch User Info**: `https://{server-url}/auth/user`

## Deployment

This project is set up to be deployed on platforms like [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/). Make sure to configure the correct environment variables in your deployment platform.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature-branch-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License.
