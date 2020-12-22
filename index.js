const clear = require('clear');
const { line } = require('cli-color/erase');
var argv = require('minimist')(process.argv.slice(2));
const [query] = argv['_'];
const { C: path, n: lineLimit = 20 } = argv;
const clc = require('cli-color');
const fs = require('fs');
const { exec } = require('child_process');

const options = {
  baseDir: path || process.cwd()
};

const git = require('simple-git')(options);

clear();

(async function () {
  const log = await git.log();

  const hashes = log.all.map(entry => entry.hash);

  const gitShow = [];

  for (const hash of hashes) {
    gitShow.push(await git.show(hash));
  }

  const processDiff = string => {
    const split = string.split('diff --git');
    const [summary, ...diffs] = split;

    if (!string.includes(query)) return [];

    return diffs.filter(diff => diff.includes(query)).map(result => {
      const isExistingFileDiff = result => {
        const [_, indexRange, ..._lines] = result.split("\n")

        return indexRange.split(' ')[0] === 'index';
      };

      const [files, indexRange, ...lines] = result.split("\n")

      const [_, fromFile, toFile] = files.split(' ');

      let indexFrom, indexTo;

      const splitIndexRange = indexRange.split(' ');

      if (isExistingFileDiff(result)) {
        const splitSplitIndexRange = splitIndexRange[1].split('..');
        indexTo = splitSplitIndexRange[0];
        indexFrom = splitSplitIndexRange[1];
      } else {
        indexFrom = null;
        indexTo = splitIndexRange[splitIndexRange.length - 1];
      }

      return {
        fromFile: fromFile.replace('a/', ''),
        toFile: toFile.replace('b/', ''),
        indexFrom,
        indexTo,
        summary,
        lines: lines.map(line => ({
          line,
          isMatch: line.includes(query)
        }))
      };
    });
  }

  const results = [];

  for (const show of gitShow) {
    results.push(...processDiff(show));
  }

  console.log('writing results')
  fs.writeFileSync(
    'results.json',
    JSON.stringify({
      query,
      results: results.filter(ele => ele)
    })
  );

  console.log('building webpack')

  exec('npm run build-static');
})();
