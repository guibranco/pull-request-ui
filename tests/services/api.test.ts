import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiService } from '../../src/services/api';

describe('ApiService', () => {
  let apiService: ApiService;
  
  beforeEach(() => {
    apiService = new ApiService('test-key');
    // Reset fetch mock
    vi.restoreAllMocks();
  });

  describe('getRepositories', () => {
    it('validates repository response format', async () => {
      const mockResponse = [
        {
          id: 'test-owner/test-repo',
          owner: 'test-owner',
          name: 'test-repo',
          full_name: 'test-owner/test-repo'
        }
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await apiService.getRepositories();
      expect(result).toEqual(mockResponse);
    });

    it('throws error for invalid repository format', async () => {
      const mockResponse = [{ invalid: 'data' }];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await expect(apiService.getRepositories()).rejects.toThrow('Invalid response format');
    });
  });

  describe('getPullRequests', () => {
    it('validates pull requests response format', async () => {
      const mockResponse = {
        owner: 'test-owner',
        repo: 'test-repo',
        pull_requests: [
          {
            number: 1,
            title: 'Test PR',
            date: '2024-03-14T12:00:00Z'
          }
        ]
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await apiService.getPullRequests('test-owner', 'test-repo');
      expect(result).toEqual(mockResponse);
    });

    it('throws error for invalid pull requests format', async () => {
      const mockResponse = {
        owner: 'test-owner',
        repo: 'test-repo',
        pull_requests: 'invalid'
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await expect(apiService.getPullRequests('test-owner', 'test-repo'))
        .rejects.toThrow('Invalid response format: pull_requests must be an array');
    });
  });

  describe('getEvents', () => {
    it('validates events response format', async () => {
      const mockResponse = {
        owner: 'test-owner',
        repo: 'test-repo',
        pull_request: 1,
        events: [
          {
            delivery_id: '123',
            type: 'test',
            action: 'created',
            date: '2024-03-14T12:00:00Z',
            payload: {}
          }
        ]
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await apiService.getEvents('test-owner', 'test-repo', '1');
      expect(result).toEqual(mockResponse);
    });

    it('throws error for invalid events format', async () => {
      const mockResponse = {
        owner: 'test-owner',
        repo: 'test-repo',
        pull_request: 1,
        events: 'invalid'
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await expect(apiService.getEvents('test-owner', 'test-repo', '1'))
        .rejects.toThrow('Invalid response format: events must be an array');
    });
  });

  describe('error handling', () => {
    it('handles API errors with error text', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: () => Promise.resolve('Resource not found')
      });

      await expect(apiService.getRepositories())
        .rejects.toThrow('API Error: 404 Not Found - Resource not found');
    });

    it('handles API errors without error text', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('')
      });

      await expect(apiService.getRepositories())
        .rejects.toThrow('API Error: 500 Internal Server Error');
    });

    it('handles non-object responses', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve('invalid')
      });

      await expect(apiService.getRepositories())
        .rejects.toThrow('Invalid response format: response must be an object');
    });

    it('handles null responses', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(null)
      });

      await expect(apiService.getRepositories())
        .rejects.toThrow('Invalid response format: response must be an object');
    });
  });
});