// Team rules that a linter cannot express. Runs in `npm run check`, in CI and in the Claude Code hook after every edit.
// Usage: node scripts/check-conventions.mjs [files...]   (no arguments = whole repo)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const SCANNED = ['src', 'tests'];

const RULES = [
  {
    id: 'no-hard-wait',
    applies: () => true,
    test: (line) => /waitForTimeout\s*\(/.test(line),
    message: 'Hard waits hide timing problems: wait for a state (web-first assertion, waitFor, waitForResponse).',
  },
  {
    id: 'no-css-or-xpath',
    applies: () => true,
    test: (line) => /\.locator\(\s*['"`](\.|\/\/|xpath=)/.test(line),
    message: 'Locate by role, label, text or test id. CSS classes and XPath break with every redesign.',
  },
  {
    id: 'no-expect-in-pages',
    applies: (file) => file.startsWith(`src${sep}pages`),
    test: (line) => /\bexpect\(/.test(line),
    message: 'Page objects describe the screen; assertions belong in the test.',
  },
  {
    id: 'test-has-tc-id',
    applies: (file) => file.endsWith('.spec.ts'),
    test: (line) => /^\s*test\(\s*['"`]/.test(line) && !/^\s*test\(\s*['"`]TC-[A-Z]+-\d{2}: /.test(line),
    message: 'Every test is one test case: title "TC-AREA-NN: <Verify|Validate> ...".',
  },
  {
    id: 'no-only',
    applies: (file) => file.endsWith('.spec.ts'),
    test: (line) => /\b(test|describe)\.only\(/.test(line),
    message: '.only would silently skip the rest of the suite in CI.',
  },
];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const args = process.argv.slice(2);
const files = (args.length ? args : SCANNED.flatMap((d) => walk(join(ROOT, d))))
  .map((f) => relative(ROOT, f))
  .filter((f) => f.endsWith('.ts') && SCANNED.some((d) => f.startsWith(d + sep)));

const violations = [];
for (const file of files) {
  readFileSync(join(ROOT, file), 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const rule of RULES) {
        if (rule.applies(file) && rule.test(line)) violations.push(`${file}:${i + 1} [${rule.id}] ${rule.message}`);
      }
    });
}

if (violations.length) {
  console.error(`Convention check failed (${violations.length}):\n` + violations.join('\n'));
  process.exit(1);
}
console.log(`Conventions OK (${files.length} files)`);
