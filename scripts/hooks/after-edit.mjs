// Claude Code PostToolUse hook: after the agent edits a file, run the team rules on it.
// Exit code 2 sends the violations back to the agent, which has to fix them before moving on.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(0, 'utf8'));
const file = input.tool_input?.file_path ?? '';
if (!/\.(ts|mjs|js)$/.test(file)) process.exit(0);

const checks = [
  ['npx', ['eslint', file]],
  ['npx', ['prettier', '--check', file]],
  ['node', ['scripts/check-conventions.mjs', file]],
];

const failures = [];
for (const [cmd, args] of checks) {
  try {
    execFileSync(cmd, args, { stdio: 'pipe', encoding: 'utf8' });
  } catch (error) {
    failures.push(`${cmd} ${args[0]}:\n${error.stdout ?? ''}${error.stderr ?? ''}`);
  }
}

if (failures.length) {
  process.stderr.write(`Blocked: ${file} breaks the team rules.\n\n${failures.join('\n')}`);
  process.exit(2);
}
