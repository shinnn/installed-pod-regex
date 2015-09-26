'use strong';

const test = require('tape');

const fixture = `
Updating local specs repositories
Analyzing dependencies
Downloading dependencies
Using colored 1.2
Installing rouge 1.10.1
Installing xcjobs 0.2.2 (was 0.1.2)
`;

function runTest(description, installedPodRegex) {
  test(description, t => {
    t.plan(7);

    t.equal(installedPodRegex.name, 'installedPodRegex', 'should have a function name.');

    const regex = installedPodRegex();

    t.deepEqual(
      Array.from(regex.exec(fixture)),
      ['Installing rouge 1.10.1', 'rouge', '1.10.1', undefined],
      'should return a regex that detects currently installing Pods from the output of installation command.'
    );

    t.deepEqual(
      Array.from(regex.exec(fixture)),
      ['Installing xcjobs 0.2.2 (was 0.1.2)', 'xcjobs', '0.2.2', '0.1.2'],
      'should return a regex that detects the previous versions of currently installing Pods.'
    );

    t.strictEqual(
      installedPodRegex().exec('Installing .rouge 1.10.1'),
      null,
      'should return a regex that doesn\'t match the line with a dot-first Pod name.'
    );

    t.strictEqual(
      installedPodRegex().exec('Installing ro/uge 1.10.1'),
      null,
      'should return a regex that doesn\'t match the line with a Pod name including `/`.'
    );

    t.strictEqual(
      installedPodRegex().exec('Installing r ouge 1.10.1'),
      null,
      'should return a regex that doesn\'t match the line with a Pod name including white spaces.'
    );

    t.strictEqual(
      installedPodRegex().exec('Installing rouge 1.1 0.4'),
      null,
      'should return a regex that doesn\'t match the line with an invalid version number.'
    );
  });
}

runTest('require(\'installed-pod-regex\')', require('.'));

global.window = {};
require(`./${require('./bower.json').main}`);

runTest('window.installedPodRegex', global.window.installedPodRegex);
