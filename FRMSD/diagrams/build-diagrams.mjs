// FRMS diagram build script
// Renders every Mermaid source in ./src to SVG (vector) and high-resolution PNG.
// Usage:  npm run build:diagrams
import { execFileSync } from 'node:child_process';
import { readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const isWin = process.platform === 'win32';
const root = path.dirname(fileURLToPath(import.meta.url));
const bin = path.join(root, 'node_modules', '.bin', isWin ? 'mmdc.cmd' : 'mmdc');
const srcDir = path.join(root, 'src');
const outDir = path.join(root, 'output');
const cfg = path.join(root, 'mermaid-config.json');
const pptr = path.join(root, 'puppeteer-config.json');

mkdirSync(outDir, { recursive: true });

const files = readdirSync(srcDir).filter((f) => f.endsWith('.mmd')).sort();

for (const file of files) {
  const base = file.replace(/\.mmd$/, '');
  const input = path.join(srcDir, file);
  const variants = [
    ['svg', []],
    ['png', ['-b', 'white', '-s', '3']],
  ];
  for (const [ext, extra] of variants) {
    const output = path.join(outDir, `${base}.${ext}`);
    console.log(`>> Rendering ${base}.${ext}`);
    execFileSync(bin, ['-i', input, '-o', output, '-c', cfg, '-p', pptr, ...extra], {
      stdio: 'inherit',
      shell: isWin,
    });
  }
}

console.log(`\nDone. ${files.length} diagram(s) rendered to: ${outDir}`);
