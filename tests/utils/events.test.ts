import { describe, it, expect } from 'vitest';
import { groupEventsByPayloadId } from '../../src/utils/events';
import type { Event } from '../../src/types';

function makeEvent(overrides: Partial<Event> & { payload: Event['payload'] }): Event {
  return {
    delivery_id: '1',
    type: 'test',
    action: 'created',
    date: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('groupEventsByPayloadId', () => {
  it('groups events by issue comment id', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { comment: { id: 1 } } }),
      makeEvent({ delivery_id: 'b', payload: { comment: { id: 1 } } }),
    ];
    events[0].type = 'issue_comment';
    events[1].type = 'issue_comment';

    const result = groupEventsByPayloadId(events);

    expect(Object.keys(result)).toEqual(['comment_1']);
    expect(result['comment_1']).toHaveLength(2);
  });

  it('groups by issue id when not an issue_comment event', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { issue: { id: 42 } } }),
    ];

    const result = groupEventsByPayloadId(events);

    expect(Object.keys(result)).toEqual(['issue_42']);
  });

  it('groups by pull_request id', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { pull_request: { id: 7 } } }),
    ];

    const result = groupEventsByPayloadId(events);

    expect(Object.keys(result)).toEqual(['pr_7']);
  });

  it('groups by comment id for non issue_comment types', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { comment: { id: 9 } } }),
    ];

    const result = groupEventsByPayloadId(events);

    expect(Object.keys(result)).toEqual(['comment_9']);
  });

  it('groups by review id', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { review: { id: 3 } } }),
    ];

    expect(Object.keys(groupEventsByPayloadId(events))).toEqual(['review_3']);
  });

  it('groups by check_run id', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { check_run: { id: 4 } } }),
    ];

    expect(Object.keys(groupEventsByPayloadId(events))).toEqual(['check_4']);
  });

  it('groups by check_suite id', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { check_suite: { id: 5 } } }),
    ];

    expect(Object.keys(groupEventsByPayloadId(events))).toEqual(['suite_5']);
  });

  it('groups by workflow_run id', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { workflow_run: { id: 6 } } }),
    ];

    expect(Object.keys(groupEventsByPayloadId(events))).toEqual([
      'workflow_6',
    ]);
  });

  it('groups by workflow_job id', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { workflow_job: { id: 8 } } }),
    ];

    expect(Object.keys(groupEventsByPayloadId(events))).toEqual(['job_8']);
  });

  it('groups by release id', () => {
    const events = [
      makeEvent({ delivery_id: 'a', payload: { release: { id: 10 } } }),
    ];

    expect(Object.keys(groupEventsByPayloadId(events))).toEqual([
      'release_10',
    ]);
  });

  it('drops events that match no known payload shape', () => {
    const events = [makeEvent({ delivery_id: 'a', payload: {} })];

    expect(groupEventsByPayloadId(events)).toEqual({});
  });

  it('sorts events within a group chronologically', () => {
    const events = [
      makeEvent({
        delivery_id: 'a',
        date: '2024-01-02T00:00:00Z',
        payload: { issue: { id: 1 } },
      }),
      makeEvent({
        delivery_id: 'b',
        date: '2024-01-01T00:00:00Z',
        payload: { issue: { id: 1 } },
      }),
    ];

    const result = groupEventsByPayloadId(events);

    expect(result['issue_1'].map(e => e.delivery_id)).toEqual(['b', 'a']);
  });
});
