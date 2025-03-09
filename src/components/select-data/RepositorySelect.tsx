import { Repository } from '../../types';

interface RepositorySelectProps {
  repositories: Repository[];
  selectedRepo: string;
  onChange: (repo: string) => void;
  disabled: boolean;
}

export function RepositorySelect({ repositories, selectedRepo, onChange, disabled }: RepositorySelectProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor="repository"
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        Repository
      </label>
      <select
        id="repository"
        value={selectedRepo}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
        required
        disabled={disabled}
      >
        <option value="">Select a repository</option>
        {repositories.map((repo) => (
          <option key={repo.id} value={repo.full_name}>
            {repo.full_name}
          </option>
        ))}
      </select>
    </div>
  );
}