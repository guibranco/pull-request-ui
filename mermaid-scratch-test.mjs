import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>', {
  pretendToBeVisual: true,
});
global.window = dom.window;
global.document = dom.window.document;
global.SVGElement = dom.window.SVGElement;
Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
});

const mermaid = (await import('mermaid')).default;

const diagram = `sequenceDiagram
    participant GH as GitHub
    participant PR as Pull Request
    participant Actor0 as alice
    participant Actor1 as bob
    participant Actor2 as carol

    Note over GH,PR: Issue #1
    Actor0->>PR: issues:opened

    Note over GH,PR: PR #2
    Actor1->>PR: pull_request:opened

    Note over GH,PR: Check: CI
    Actor2->>PR: check_run:completed
    Note right of PR: success

    Note over GH,PR: Workflow: Build
    GH->>PR: workflow_run:completed
    Note right of PR: failure

    Note over GH,PR: Job: Job1
    GH->>PR: workflow_job:completed
`;

async function render(mirrorActors) {
  await mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    sequence: {
      showSequenceNumbers: false,
      actorMargin: 80,
      messageMargin: 40,
      mirrorActors,
      bottomMarginAdj: 10,
      useMaxWidth: true,
      rightAngles: true,
      boxMargin: 10,
      boxTextMargin: 5,
      noteMargin: 10,
      messageAlign: 'center',
      actorFontSize: 14,
      noteFontSize: 13,
      messageFontSize: 13,
      wrap: true,
      maxMessageWidth: 150,
    },
  });

  const { svg } = await mermaid.render('mermaid-diagram-' + mirrorActors, diagram);
  return svg;
}

for (const mirrorActors of [false, true]) {
  const svg = await render(mirrorActors);
  const lineMatches = [...svg.matchAll(/<line[^>]*class="actor-line"[^>]*>/g)];
  console.log(`\n--- mirrorActors: ${mirrorActors} ---`);
  for (const m of lineMatches) {
    console.log(m[0]);
  }
}
