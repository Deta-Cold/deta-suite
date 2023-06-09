/* eslint-disable camelcase */

const child_process = require('child_process');
const path = require('path');
const fs = require('fs');

const { checkPackageDependencies } = require('./npm-dependencies-helper');

const args = process.argv.slice(2);

if (args.length < 1) throw new Error('Check npm dependencies requires 1 parameter: semver');
const [semver] = args;

const allowedSemvers = ['patch', 'minor'];
if (!allowedSemvers.includes(semver)) {
    throw new Error(`provided semver: ${semver} must be one of ${allowedSemvers.join(', ')}`);
}

const ROOT = path.join(__dirname, '..', '..');

const exec = (cmd, params) => {
    console.log(cmd, ...params);

    const res = child_process.spawnSync(cmd, params, {
        encoding: 'utf-8',
        cwd: ROOT,
    });
    if (res.status !== 0) {
        console.log(cmd, ...params);
        console.log(res);
    }
    return res;
};

const commit = ({ path, message }) => {
    exec('git', ['add', path]);
    exec('git', ['commit', '-m', `${message}`]);
};

const comment = ({ prNumber, body }) => {
    exec('gh', ['pr', 'comment', `${prNumber}`, '--body', body]);
};

const getGitCommitByPackageName = (packageName, maxCount = 10) =>
    exec('git', [
        'log',
        '--oneline',
        '--max-count',
        `${maxCount}`,
        '--pretty=tformat:"-   %s (%h)"',
        '--',
        `./packages/${packageName}`,
    ]);

const splitByNewlines = input => input.split('\n');

const findIndexByCommit = (commitArr, searchString) =>
    commitArr.findIndex(commit => commit.includes(searchString));

const formArrayToText = arr => arr.join('\n');

const initConnectRelease = () => {
    const checkResult = checkPackageDependencies('connect');

    const update = checkResult.update.map(package => package.replace('@detahard/', ''));
    const errors = checkResult.errors.map(package => package.replace('@detahard/', ''));

    if (update) {
        update.forEach(packageName => {
            const PACKAGE_PATH = path.join(ROOT, 'packages', packageName);
            const PACKAGE_JSON_PATH = path.join(PACKAGE_PATH, 'package.json');

            exec('yarn', ['bump', semver, `./packages/${packageName}/package.json`]);

            const rawPackageJSON = fs.readFileSync(PACKAGE_JSON_PATH);
            const packageJSON = JSON.parse(rawPackageJSON);
            const { version } = packageJSON;

            const packageGitLog = getGitCommitByPackageName(packageName, 1000);

            const commitsArr = packageGitLog.stdout.split('\n');

            const CHANGELOG_PATH = path.join(PACKAGE_PATH, 'CHANGELOG.md');

            const newCommits = [];
            commitsArr.forEach(commit => {
                if (commit.includes(`npm-release: @detahard/${packageName}`)) {
                    return;
                }
                newCommits.push(commit.replaceAll('"', ''));
            });

            if (newCommits.length) {
                if (!fs.existsSync(CHANGELOG_PATH)) {
                    fs.writeFileSync(CHANGELOG_PATH, '');
                }

                let changelog = fs.readFileSync(CHANGELOG_PATH, 'utf-8');

                changelog = `# ${version}\n\n${newCommits.join('')}\n\n${changelog}`;
                fs.writeFileSync(CHANGELOG_PATH, changelog, 'utf-8');

                exec('yarn', ['prettier', '--write', CHANGELOG_PATH]);
            }

            commit({
                path: PACKAGE_PATH,
                message: `npm-release: @detahard/${packageName} ${version}`,
            });
        });
    }

    exec('yarn', ['workspace', '@detahard/connect', 'version:patch']);

    const PACKAGE_PATH = path.join(ROOT, 'packages', 'connect');
    const PACKAGE_JSON_PATH = path.join(PACKAGE_PATH, 'package.json');
    const rawPackageJSON = fs.readFileSync(PACKAGE_JSON_PATH);
    const packageJSON = JSON.parse(rawPackageJSON);
    const { version } = packageJSON;

    const commitMessage = `npm-release: @detahard/connect ${version}`;
    const branchName = `npm-release/connect-${version}`;

    exec('git', ['checkout', '-b', branchName]);

    commit({
        path: ROOT,
        message: commitMessage,
    });

    exec('git', ['push', 'origin', branchName]);

    const ghPrCreateResult = exec('gh', [
        'pr',
        'create',
        '--repo',
        'detahard/detahard-suite',
        '--title',
        `${commitMessage}`,
        '--body-file',
        'docs/releases/connect-release.md',
        '--base',
        'develop',
        '--head',
        branchName,
    ]);

    const prNumber = ghPrCreateResult.stdout
        .replaceAll('\n', '')
        .replace('https://github.com/detahard/detahard-suite/pull/', '');

    if (errors.length) {
        comment({
            prNumber,
            body: `Deps error. one of the dependencies likely needs to be published for the first time: ${errors.join(
                ', ',
            )}`,
        });
    }

    const depsChecklist = update.reduce(
        (acc, packageName) =>
            `${acc}\n- [ ] [![NPM](https://img.shields.io/npm/v/@detahard/${packageName}.svg)](https://www.npmjs.org/package/@detahard/${packageName}) @detahard/${packageName}`,
        '',
    );

    if (depsChecklist) {
        comment({
            prNumber,
            body: depsChecklist,
        });
    }

    // Adding list of commits form the connect* packages to help creating and checking connect CHANGELOG.
    const connectGitLog = getGitCommitByPackageName('connect*', 1000);
    const connectGitLogArr = splitByNewlines(connectGitLog.stdout);
    const connectGitLogIndex = findIndexByCommit(connectGitLogArr, 'npm-release: @detahard/connect');

    // Creating a comment only if there are commits to add since last connect release.
    if (connectGitLogIndex !== -1) {
        connectGitLogArr.splice(connectGitLogIndex, connectGitLogArr.length - connectGitLogIndex);
        const connectGitLogText = formArrayToText(connectGitLogArr);
        comment({
            prNumber,
            body: connectGitLogText,
        });
    }
};

initConnectRelease();
