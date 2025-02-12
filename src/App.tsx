import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Timeline } from "./Timeline";
import fetchWithAuth from "./hooks/fetchWithAuth";

/**
 * Main application component that displays a GitHub Webhooks Viewer.
 * This component fetches repositories, pull requests, and events related to selected pull requests.
 * It manages the state for repositories, selected repository, pull requests, selected pull request, and events.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Usage in a React application
 * <App />
 */
const App = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [selectedPR, setSelectedPR] = useState<number | null>(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchWithAuth("/repositories/")
      .then((res) => res.json())
      .then((data) => setRepositories(data));
  }, []);

  /**
   * Fetches the details of pull requests and events for a given repository.
   *
   * This function retrieves the pull requests and events associated with the specified
   * repository by making an authenticated fetch request to the server. It updates the
   * state with the selected repository, pull requests, and events upon successful retrieval
   * of the data.
   *
   * @param {Repository | null} repo - The repository object containing the owner and name,
   *                                    or null if no repository is provided.
   *
   * @returns {Promise<void>} A promise that resolves when the data has been successfully
   *                          fetched and the state has been updated.
   *
   * @throws {Error} Throws an error if the fetch request fails or if the response cannot
   *                 be parsed as JSON.
   *
   * @example
   * const repo = { owner: 'user', name: 'repository' };
   * fetchRepoDetails(repo)
   *   .then(() => console.log('Repository details fetched successfully'))
   *   .catch((error) => console.error('Error fetching repository details:', error));
   */
  const fetchRepoDetails = (repo: Repository | null) => {
    fetchWithAuth(`/repositories/${repo?.owner}/${repo?.name}/pulls`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedRepo(repo);
        setPullRequests(data.pull_requests);
        setEvents(data.events);
      });
  };

  /**
   * Fetches events for a given pull request (PR) number from the repository.
   * This function makes an authenticated fetch request to retrieve event data
   * associated with the specified PR number and updates the state with the
   * fetched events. It also sets up a recurring fetch every 5 seconds to
   * keep the events updated.
   *
   * @param {number} prNumber - The number of the pull request for which to fetch events.
   * @throws {Error} Throws an error if the fetch operation fails or if the response is not valid JSON.
   *
   * @example
   * // Fetch events for PR number 42
   * fetchEventsForPR(42);
   */
  const fetchEventsForPR = (prNumber: number) => {
    fetchWithAuth(`/repositories/${selectedRepo?.owner}/${selectedRepo?.name}/${prNumber}`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events);
        setTimeout(function () { fetchEventsForPR(prNumber); }, 5000);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">GitHub Webhooks Viewer</h1>

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