const Twig = require('twig');
const fs = require('fs');
const glob = require('child_process')
  .execSync("find src/views -name '*.twig'")
  .toString()
  .trim()
  .split('\n');

/**
 * Validates standard Twig syntax (balanced {% %} blocks, valid
 * expressions, correct filter chains) across every template. Salla's
 * two custom tags (hook, component) are stripped to harmless comments
 * before parsing, since they're the only genuinely non-standard Twig
 * syntax used anywhere in the theme — everything else (extends, block,
 * if/for/set, include-with, filter chains) is standard Twig, which
 * twig.js parses natively.
 */
function stripSallaCustomTags(src) {
  return src
    .replace(/\{%\s*hook\s+'[^']*'\s*%\}/g, '{# hook #}')
    .replace(/\{%\s*component\s+[^%]+%\}/g, '{# component #}');
}

// Register no-op stand-ins for Salla's custom filters so filter-chain
// syntax (e.g. `value | trans | upper`) validates without erroring on
// an unrecognized filter name.
['asset', 'trans', 'money', 'striptags', 'link'].forEach((name) => {
  try {
    Twig.extendFilter(name, (value) => value);
  } catch (e) {
    // ignore if already defined
  }
});

let errorCount = 0;
let okCount = 0;

for (const file of glob) {
  const src = stripSallaCustomTags(fs.readFileSync(file, 'utf8'));
  try {
    Twig.twig({ data: src, allowInlineIncludes: true, rethrow: true });
    okCount++;
  } catch (err) {
    errorCount++;
    console.log(`FAIL: ${file}`);
    console.log(`  ${err.message}`);
  }
}

console.log(`\n${okCount} OK, ${errorCount} failed (of ${glob.length} total .twig files)`);
process.exit(errorCount > 0 ? 1 : 0);
