const fs = require('fs');
const path = require('path');
const { spawnSync, spawn } = require('child_process');

const cwd = process.cwd();
const entry = path.join(cwd, 'dist', 'index.js');

const build = spawnSync('pnpm', ['run', 'build'], {
  cwd,
  stdio: 'inherit',
  shell: false,
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

if (!fs.existsSync(entry)) {
  console.error(`Expected build output at ${entry}`);
  process.exit(1);
}

const child = spawn(process.execPath, [entry], {
  cwd,
  stdio: 'inherit',
  env: process.env,
  shell: false,
});

child.on('exit', (code, signal) => {
  process.exit(code ?? (signal ? 1 : 0));
});

child.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
