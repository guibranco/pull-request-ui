export function groupEventsByPayloadId(
  events: readonly Event[]
): Record<string, Event[]> {
  const grouped = events.reduce(
    (acc, event) => {
      let eventId = null;

      if (event.type === 'issue_comment' && event.payload.comment?.id) {
        eventId = `comment_${event.payload.comment.id}`;
      } else if (event.payload.issue?.id) {
        eventId = `issue_${event.payload.issue.id}`;
      } else if (event.payload.pull_request?.id) {
        eventId = `pr_${event.payload.pull_request.id}`;
      } else if (event.payload.comment?.id) {
        eventId = `comment_${event.payload.comment.id}`;
      } else if (event.payload.review?.id) {
        eventId = `review_${event.payload.review.id}`;
      } else if (event.payload.check_run?.id) {
        eventId = `check_${event.payload.check_run.id}`;
      } else if (event.payload.check_suite?.id) {
        eventId = `suite_${event.payload.check_suite.id}`;
      } else if (event.payload.workflow_run?.id) {
        eventId = `workflow_${event.payload.workflow_run.id}`;
      } else if (event.payload.workflow_job?.id) {
        eventId = `job_${event.payload.workflow_job.id}`;
      } else if (event.payload.release?.id) {
        eventId = `release_${event.payload.release.id}`;
      }

      if (eventId) {
        if (!acc[eventId]) {
          acc[eventId] = [];
        }
        acc[eventId].push(event);
      }
      return acc;
    },
    {} as Record<string, Event[]>
  );

  // Sort events within each group by date
  Object.values(grouped).forEach(group => {
    group.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  });

  return grouped;
}
