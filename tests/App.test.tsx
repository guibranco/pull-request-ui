import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/steps/ApiKeyStep', () => ({
  ApiKeyStep: ({ onSubmit }: { onSubmit: (key: string) => void }) => (
    <div>
      <span>ApiKeyStepStub</span>
      <button onClick={() => onSubmit('new-key')}>submit-api-key</button>
    </div>
  ),
}));

vi.mock('../src/steps/SelectDataStep', () => ({
  SelectDataStep: ({
    onSelect,
    preselectedRepo,
  }: {
    onSelect: (repo: string, pr: string) => void;
    preselectedRepo?: string;
  }) => (
    <div>
      <span>SelectDataStepStub:{preselectedRepo}</span>
      <button onClick={() => onSelect('owner/repo', '42')}>
        select-data
      </button>
    </div>
  ),
}));

vi.mock('../src/steps/TimelineViewStep', () => ({
  TimelineViewStep: ({
    onBack,
    repo,
    pr,
  }: {
    onBack: () => void;
    repo: string;
    pr: string;
  }) => (
    <div>
      <span>
        TimelineViewStepStub:{repo}:{pr}
      </span>
      <button onClick={onBack}>go-back</button>
    </div>
  ),
}));

import App from '../src/App';

const localStorageMock = window.localStorage as unknown as {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
};

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '';
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('shows the API key step by default when no key is stored', () => {
    render(<App />);

    expect(screen.getByText('ApiKeyStepStub')).toBeInTheDocument();
  });

  it('stores the key and moves to select-data on submit', () => {
    render(<App />);

    fireEvent.click(screen.getByText('submit-api-key'));

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'apiKey',
      'new-key'
    );
    expect(screen.getByText(/SelectDataStepStub/)).toBeInTheDocument();
    expect(window.location.hash).toBe('');
  });

  it('goes straight to select-data when a key is stored and there is no hash', () => {
    localStorageMock.getItem.mockReturnValue('stored-key');

    render(<App />);

    expect(screen.getByText(/SelectDataStepStub/)).toBeInTheDocument();
  });

  it('stays on the API key step when the hash explicitly requests it', () => {
    localStorageMock.getItem.mockReturnValue('stored-key');
    window.location.hash = '#/api-key';

    render(<App />);

    expect(screen.getByText('ApiKeyStepStub')).toBeInTheDocument();
  });

  it('preselects the repository from the hash', () => {
    localStorageMock.getItem.mockReturnValue('stored-key');
    window.location.hash = '#owner/repo';

    render(<App />);

    expect(screen.getByText('SelectDataStepStub:owner/repo')).toBeInTheDocument();
  });

  it('restores the timeline step from a full hash', () => {
    localStorageMock.getItem.mockReturnValue('stored-key');
    window.location.hash = '#owner/repo/5';

    render(<App />);

    expect(
      screen.getByText('TimelineViewStepStub:owner/repo:5')
    ).toBeInTheDocument();
  });

  it('falls back to select-data when the hash has no repo segment', () => {
    localStorageMock.getItem.mockReturnValue('stored-key');
    window.location.hash = '#owner';

    render(<App />);

    expect(screen.getByText(/SelectDataStepStub/)).toBeInTheDocument();
  });

  it('moves to the timeline step and updates the hash on data selection', () => {
    render(<App />);

    fireEvent.click(screen.getByText('submit-api-key'));
    fireEvent.click(screen.getByText('select-data'));

    expect(
      screen.getByText('TimelineViewStepStub:owner/repo:42')
    ).toBeInTheDocument();
    expect(window.location.hash).toBe('#owner/repo/42');
  });

  it('goes back to select-data and trims the hash to the repo', () => {
    render(<App />);

    fireEvent.click(screen.getByText('submit-api-key'));
    fireEvent.click(screen.getByText('select-data'));
    fireEvent.click(screen.getByText('go-back'));

    expect(screen.getByText(/SelectDataStepStub/)).toBeInTheDocument();
    expect(window.location.hash).toBe('#owner/repo');
  });

  it('reacts to hashchange events after mount', async () => {
    localStorageMock.getItem.mockReturnValue('stored-key');

    render(<App />);

    expect(screen.getByText(/SelectDataStepStub/)).toBeInTheDocument();

    window.location.hash = '#owner2/repo2/9';
    fireEvent(window, new Event('hashchange'));

    await waitFor(() => {
      expect(
        screen.getByText('TimelineViewStepStub:owner2/repo2:9')
      ).toBeInTheDocument();
    });
  });

  it('returns to the API key step on hashchange to #/api-key', async () => {
    localStorageMock.getItem.mockReturnValue('stored-key');

    render(<App />);

    window.location.hash = '#/api-key';
    fireEvent(window, new Event('hashchange'));

    await waitFor(() => {
      expect(screen.getByText('ApiKeyStepStub')).toBeInTheDocument();
    });
  });
});
