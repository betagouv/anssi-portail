import fs from 'node:fs';

const summaryFile = process.env.GITHUB_STEP_SUMMARY ?? 'rapport-guides.txt';

const differences =
  `## 📊 Table Diff\n\n` +
  `| Row | Status | Changed Columns |\n` +
  `|-----|--------|----------------|\n` +
  `| 1 | modifié | Documents |\n`;

fs.appendFileSync(summaryFile, differences);
