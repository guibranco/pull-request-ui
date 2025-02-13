import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import fetchWithAuth from "./hooks/fetchWithAuth";
import ApiKeyModal from "./components/ApiKeyModal";
import Timeline from "./components/Timeline";
import Diagram from "./components/Diagram";

/**
 * The main application component that renders the GitHub Webhooks Viewer.
 * It manages the state for API key, repositories, selected repository,
 * pull requests, selected pull request, and events.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Usage in a React application
 * <App />
 *
 * @throws {Error} Throws an error if the API key is invalid or if there is a network issue.
 */
const App = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [selectedPR, setSelectedPR] = useState<number | null>(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (apiKey === null) {
      return;
    }
    fetchWithAuth(apiKey, "/repositories/")
      .then((res) => res.json())
      .then((data) => setRepositories(data));
  }, [apiKey]);

  /**
   * Fetches the details of pull requests and events for a specified repository.
   *
   * This function retrieves data from the API using the repository's owner and name.
   * It updates the state with the selected repository, pull requests, and events
   * once the data is successfully fetched.
   *
   * @param {Repository | null} repo - The repository object containing the owner and name,
   *                                    or null if no repository is selected.
   *
   * @returns {void} This function does not return a value.
   *
   * @throws {Error} Throws an error if the fetch operation fails or if the response is not valid.
   *
   * @example
   * const repo = { owner: 'octocat', name: 'Hello-World' };
   * fetchRepoDetails(repo);
   */
  const fetchRepoDetails = (repo: Repository | null) => {
    fetchWithAuth(apiKey, `/repositories/${repo?.owner}/${repo?.name}/pulls`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedRepo(repo);
        setPullRequests(data.pull_requests);
        setEvents(data.events);
      });
  };

  /**
   * Fetches events for a given pull request (PR) number from the repository.
   * This function utilizes an authenticated fetch call to retrieve event data
   * and updates the state with the fetched events. It also sets up a recurring
   * fetch every 5 seconds to keep the events updated.
   *
   * @param {number} prNumber - The number of the pull request for which events are to be fetched.
   * @returns {void} - This function does not return a value.
   *
   * @throws {Error} - Throws an error if the fetch operation fails or if the response is not valid JSON.
   *
   * @example
   * // Fetch events for PR number 42
   * fetchEventsForPR(42);
   */
  const fetchEventsForPR = (prNumber: number) => {
    fetchWithAuth(apiKey, `/repositories/${selectedRepo?.owner}/${selectedRepo?.name}/${prNumber}`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events);
        setTimeout(function () { fetchEventsForPR(prNumber); }, 5000);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">GitHub Webhooks Viewer</h1>

      <ApiKeyModal onApiKeySet={setApiKey} />

      {/* Repository Selector */}
      <div className="mb-4">
        <label htmlFor="repository" className="block text-sm font-medium mb-2">
          Select Repository:
        </label>
        <select
          id="repository"
          className="w-full p-2 border rounded-md"
          onChange={(e) => {
            const repo = repositories.find(
              (r) => r.full_name === e.target.value
            );
            if (typeof repo !== "undefined") {
              fetchRepoDetails(repo);
            }
          }}
        >
          <option value="">-- Select --</option>
          {repositories.map((repo) => (
            <option key={repo.id} value={repo.full_name}>
              {repo.full_name}
            </option>
          ))}
        </select>
      </div>

      {/* Pull Request Selector */}
      {selectedRepo && pullRequests.length > 0 && (
        <div className="mb-4">
          <label htmlFor="pull-request" className="block text-sm font-medium mb-2">
            Select Pull Request:
          </label>
          <select
            id="pull-request"
            className="w-full p-2 border rounded-md"
            onChange={(e) => {
              const prNumber = parseInt(e.target.value);
              setSelectedPR(prNumber);
              fetchEventsForPR(prNumber);
            }}
          >
            <option value="">-- Select --</option>
            {pullRequests.map((pr) => (
              <option key={pr.number} value={pr.number}>
                #{pr.number}: {pr.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Events Timeline and Diagram */}
      {selectedRepo && selectedPR && events && (
        <Card className="mb-4">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">
              Events for {selectedRepo.full_name} (PR #{selectedPR})
            </h2>

            {/* Timeline Component */}
            <Timeline events={events} />
            <Diagram events={events} />

          </CardContent>
        </Card>
      )}

      {!selectedRepo && (
        <p className="text-gray-600">Please select a repository to view pull requests and events.</p>
      )}
    </div>
  );
};

export default App;