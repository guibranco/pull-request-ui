# 🏗️ GitHub Webhooks UI

A sleek and interactive UI to visualize GitHub webhook events for pull requests! 🚀

## 🎯 Features

✅ Fetch and display **GitHub webhook events** in a structured table 📊  
✅ Store API key, repository, and PR selection **locally** to persist data 💾  
✅ Beautiful UI with TailwindCSS for an intuitive experience 🎨  
✅ Modular React components for better maintainability 🛠️

## 📸 Preview

(Include a screenshot or GIF of the app in action!)

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/your-username/github-webhooks-ui.git
cd github-webhooks-ui
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Start the Development Server

```sh
npm run dev
```

## 🛠️ Configuration

Before using the app, ensure you have the **GitHub API URL** set up. The API URL, repository, and pull request number are stored in `localStorage` for convenience. 🎯

## 🏗️ Project Structure

```
📂 src
 ├── 📄 App.tsx
 ├── 📄 index.css
 ├── 📄 main.tsx
 ├── 📄 tree.txt
 ├── 📄 types.ts
 ├── 📄 vite-env.d.ts
 │
 ├── 📂 components
 │   ├── 📂 layout
 │   │   ├── 📄 Footer.tsx
 │   │   ├── 📄 Header.tsx
 │   │
 │   ├── 📂 select-data
 │   │   ├── 📄 PullRequestSelect.tsx
 │   │   ├── 📄 RepositorySelect.tsx
 │   │
 │   ├── 📂 timeline
 │   │   ├── 📄 EventList.tsx
 │   │   ├── 📄 MermaidDiagram.tsx
 │   │   ├── 📄 PayloadModal.tsx
 │   │   ├── 📄 RefreshButton.tsx
 │
 ├── 📂 services
 │   ├── 📄 api.ts
 │
 ├── 📂 steps
 │   ├── 📄 ApiKeyStep.tsx
 │   ├── 📄 SelectDataStep.tsx
 │   ├── 📄 TimelineViewStep.tsx

```

## 📡 API Usage

This UI fetches GitHub PR events from:

```bash
GET {API_URL}/repos/{owner}/{repo}/pulls/{pr_number}/events
```

Ensure your API endpoint supports CORS if you're running locally. 🌐

## 🤝 Contributing

Feel free to fork, create a PR, or open issues! Your contributions are welcome. 💙

## 📜 License

This project is licensed under the MIT License. 📄
