import { useEffect, useState } from 'react';
import CodeLab from '@/components/playground/CodeLab';
import GitSandbox from '@/components/playground/GitSandbox';
import PhpPlayground from '@/components/playground/PhpPlayground';
import Playground from '@/components/playground/Playground';
import PythonPlayground from '@/components/playground/PythonPlayground';
import ReactPlayground from '@/components/playground/ReactPlayground';
import SqlPlayground from '@/components/playground/SqlPlayground';

type RuntimeId =
  | 'web'
  | 'react'
  | 'python'
  | 'sql'
  | 'php'
  | 'ts'
  | 'node'
  | 'c'
  | 'cpp'
  | 'java'
  | 'csharp'
  | 'bash'
  | 'git';

const RUNTIMES: Array<{ id: RuntimeId; label: string; group: string }> = [
  { id: 'web', label: 'HTML / CSS / JS', group: 'Web' },
  { id: 'react', label: 'React JSX', group: 'Web' },
  { id: 'python', label: 'Python 3', group: 'WASM' },
  { id: 'sql', label: 'SQL (SQLite)', group: 'WASM' },
  { id: 'php', label: 'PHP 8', group: 'WASM' },
  { id: 'ts', label: 'TypeScript', group: 'Live API' },
  { id: 'node', label: 'Node.js 20', group: 'Live API' },
  { id: 'c', label: 'C11', group: 'Live API' },
  { id: 'cpp', label: 'C++20', group: 'Live API' },
  { id: 'java', label: 'Java 21', group: 'Live API' },
  { id: 'csharp', label: 'C# 12', group: 'Live API' },
  { id: 'bash', label: 'Linux Bash', group: 'Live API' },
  { id: 'git', label: 'Git Terminal', group: 'Sandbox' },
];

export default function MultiPlayground() {
  const [active, setActive] = useState<RuntimeId>('web');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const param = new URLSearchParams(window.location.search).get('lang') as RuntimeId | null;
    if (param && RUNTIMES.some((r) => r.id === param)) {
      setActive(param);
    }
  }, []);

  const selectRuntime = (id: RuntimeId) => {
    setActive(id);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', id);
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <div className="space-y-6">
      {/* Runtime Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 rounded-3xl bg-[var(--bg-elevated)] p-3">
        {RUNTIMES.map((rt) => {
          const isAct = rt.id === active;
          return (
            <button
              key={rt.id}
              type="button"
              onClick={() => selectRuntime(rt.id)}
              className={`min-h-10 rounded-2xl px-4 py-2 text-xs font-semibold transition ${
                isAct
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {rt.label}
            </button>
          );
        })}
      </div>

      {/* Active Sandbox */}
      {active === 'web' && (
        <Playground
          title="HTML / CSS / JS Sandbox"
          height={420}
          showConsole={true}
          html={`<main class="demo">
  <h1>Build Something Cool</h1>
  <p>Edit the HTML, CSS, or JS tabs and see instant results.</p>
  <div class="row">
    <input id="nameInput" type="text" placeholder="Enter your name" value="Learner" />
    <button id="greetBtn">Greet</button>
  </div>
  <p id="output" class="output"></p>
</main>`}
          css={`.demo { max-width: 480px; margin: 24px auto; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #f8fafc; }
h1 { margin: 0 0 8px; font-size: 24px; }
p { color: #475569; margin: 0 0 16px; }
.row { display: flex; gap: 8px; }
input { flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; }
button { background: #2563eb; color: white; border: none; border-radius: 8px; padding: 8px 16px; font-weight: 600; cursor: pointer; }
.output { margin-top: 16px; font-weight: 600; color: #15803d; }`}
          js={`const input = document.getElementById('nameInput');
const btn = document.getElementById('greetBtn');
const output = document.getElementById('output');

function greet() {
  const name = input.value.trim() || 'World';
  output.textContent = 'Welcome to DevPath, ' + name + '!';
  console.log('Greeted:', name);
}

btn.addEventListener('click', greet);
greet();`}
        />
      )}

      {active === 'react' && (
        <ReactPlayground
          title="React JSX Sandbox"
          height={420}
          code={`function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: 16, borderRadius: 14, background: '#f8fafc', maxWidth: 420 }}>
      <h2 style={{ margin: '0 0 8px' }}>Live React JSX</h2>
      <p style={{ color: '#475569', margin: '0 0 14px' }}>
        Edit this JSX component and click Run JSX to see instant updates.
      </p>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{ padding: '8px 16px', borderRadius: 10, border: 0, background: '#0891b2', color: '#fff', fontWeight: 700 }}
      >
        Clicked {count} {count === 1 ? 'time' : 'times'}
      </button>
    </div>
  );
}`}
        />
      )}

      {active === 'python' && (
        <PythonPlayground
          title="Python 3 (WebAssembly / Pyodide)"
          height={360}
          code={`tracks = ["Python", "TypeScript", "React", "Docker", "DSA"]
for i, track in enumerate(tracks, 1):
    print(f"{i}. Learning {track} on DevPath!")`}
        />
      )}

      {active === 'sql' && (
        <SqlPlayground
          title="SQLite 3 (In-Browser SQL)"
          height={260}
          schemaSql={`CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT, category TEXT, hours INTEGER);
INSERT INTO courses VALUES
  (1, 'HTML Fundamentals', 'Web', 5),
  (2, 'JavaScript Essentials', 'Web', 8),
  (3, 'SQL Essentials', 'Backend', 6),
  (4, 'Python 3 Fundamentals', 'Backend', 6),
  (5, 'Modern C++ Essentials', 'Systems', 6),
  (6, 'Docker & Containers', 'DevOps', 4),
  (7, 'Data Structures & Algorithms', 'CS', 6);`}
          query={`SELECT title, category, hours
FROM courses
ORDER BY hours DESC
LIMIT 6;`}
        />
      )}

      {active === 'php' && (
        <PhpPlayground
          title="PHP 8 (WebAssembly)"
          height={360}
          code={`<?php
declare(strict_types=1);

$tracks = ["PHP 8", "SQL", "Docker"];
foreach ($tracks as $idx => $name) {
    echo ($idx + 1) . ". Building with $name\\n";
}`}
        />
      )}

      {active === 'ts' && (
        <CodeLab
          title="playground.ts"
          language="ts"
          height={340}
          code={`interface Learner {
  name: string;
  tracks: number;
}

const user: Learner = { name: "Builder", tracks: 18 };
console.log(\`Hello \${user.name}! Exploring \${user.tracks} DevPath tracks.\`);`}
          expectedOutput={`Hello Builder! Exploring 18 DevPath tracks.`}
        />
      )}

      {active === 'node' && (
        <CodeLab
          title="playground.js (Node.js 20)"
          language="node"
          height={340}
          code={`const os = require("node:os");
console.log("Node.js:", process.version, "| Platform:", os.platform());`}
          expectedOutput={`Node.js: v20.17.0 | Platform: linux`}
        />
      )}

      {active === 'c' && (
        <CodeLab
          title="main.c (GCC 13 C11)"
          language="c"
          height={340}
          code={`#include <stdio.h>

int main(void) {
    int tracks = 18;
    printf("Hello from live C11! DevPath has %d tracks.\\n", tracks);
    return 0;
}`}
          expectedOutput={`Hello from live C11! DevPath has 18 tracks.`}
        />
      )}

      {active === 'cpp' && (
        <CodeLab
          title="main.cpp (GCC 13 C++20)"
          language="cpp"
          height={340}
          code={`#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {92, 88, 95};
    int sum = 0;
    for (int s : scores) sum += s;
    std::cout << "Average: " << (sum / 3.0) << "\\n";
    return 0;
}`}
          expectedOutput={`Average: 91.6667`}
        />
      )}

      {active === 'java' && (
        <CodeLab
          title="Main.java (OpenJDK 21)"
          language="java"
          height={340}
          code={`import java.util.List;

public class Main {
    public static void main(String[] args) {
        var tracks = List.of("Java 21", "OOP", "DSA");
        System.out.println("Live on OpenJDK 21: " + String.join(" -> ", tracks));
    }
}`}
          expectedOutput={`Live on OpenJDK 21: Java 21 -> OOP -> DSA`}
        />
      )}

      {active === 'csharp' && (
        <CodeLab
          title="Program.cs (.NET 8 / C# 12)"
          language="csharp"
          height={340}
          code={`using System.Linq;

int[] scores = [82, 95, 88, 91];
var top = scores.Where(s => s >= 90).ToList();
Console.WriteLine($"Scores >= 90: {string.Join(", ", top)}");`}
          expectedOutput={`Scores >= 90: 95, 91`}
        />
      )}

      {active === 'bash' && (
        <CodeLab
          title="script.sh (GNU Bash)"
          language="bash"
          height={340}
          code={`#!/usr/bin/env bash
set -euo pipefail

for lang in Linux Docker Git; do
  echo "Ready: $lang"
done`}
          expectedOutput={`Ready: Linux
Ready: Docker
Ready: Git`}
        />
      )}

      {active === 'git' && (
        <GitSandbox
          title="Interactive Git Terminal"
          starterHint={'Practice git status, git add ., git commit -m "msg", git checkout -b feat, git merge, and git log --oneline.'}
        />
      )}
    </div>
  );
}
