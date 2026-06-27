const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';
const MESSAGE = 'KRAUZY';
const CALENDAR_WEEKS = 53;
const COMMITS_PER_PIXEL = Number(process.env.COMMITS_PER_PIXEL || 1);
const DRY_RUN = process.argv.includes('--dry-run') || process.env.DRY_RUN === '1';

const FONT = {
    K: [
        '#...#',
        '#..#.',
        '#.#..',
        '##...',
        '#.#..',
        '#..#.',
        '#...#'
    ],
    R: [
        '####.',
        '#...#',
        '#...#',
        '####.',
        '#.#..',
        '#..#.',
        '#...#'
    ],
    A: [
        '.###.',
        '#...#',
        '#...#',
        '#####',
        '#...#',
        '#...#',
        '#...#'
    ],
    U: [
        '#...#',
        '#...#',
        '#...#',
        '#...#',
        '#...#',
        '#...#',
        '.###.'
    ],
    Z: [
        '#####',
        '....#',
        '...#.',
        '..#..',
        '.#...',
        '#....',
        '#####'
    ],
    Y: [
        '#...#',
        '#...#',
        '.#.#.',
        '..#..',
        '..#..',
        '..#..',
        '..#..'
    ]
};

function buildPattern(message) {
    return message.split('').reduce((rows, letter, index) => {
        const glyph = FONT[letter];

        if (!glyph) {
            throw new Error(`Unsupported letter: ${letter}`);
        }

        return rows.map((row, rowIndex) => `${row}${index > 0 ? '.' : ''}${glyph[rowIndex]}`);
    }, Array.from({ length: 7 }, () => ''));
}

function buildCommits() {
    const pattern = buildPattern(MESSAGE);
    const patternWidth = pattern[0].length;
    const weekOffset = Math.floor((CALENDAR_WEEKS - patternWidth) / 2);
    const calendarStart = moment().subtract(1, 'year').startOf('week');
    const commits = [];

    pattern.forEach((row, day) => {
        row.split('').forEach((pixel, column) => {
            if (pixel !== '#') return;

            const date = calendarStart
                .clone()
                .add(weekOffset + column, 'weeks')
                .add(day, 'days')
                .hour(12)
                .minute(0)
                .second(0)
                .millisecond(0)
                .format();

            for (let stroke = 1; stroke <= COMMITS_PER_PIXEL; stroke += 1) {
                commits.push({
                    date,
                    day,
                    column: weekOffset + column,
                    stroke
                });
            }
        });
    });

    return {
        commits,
        pattern,
        calendarStart: calendarStart.format('YYYY-MM-DD'),
        weekOffset
    };
}

async function makeCommit(git, commit, index, total) {
    const jsonData = {
        message: MESSAGE,
        date: commit.date,
        column: commit.column,
        day: commit.day,
        stroke: commit.stroke,
        commit: `${index + 1}/${total}`
    };

    await jsonfile.writeFile(FILE_PATH, jsonData, { spaces: 2 });
    await git.add([FILE_PATH]);
    await git.commit(`${MESSAGE} ${commit.date} (${index + 1}/${total})`, { '--date': commit.date });
}

async function main() {
    const { commits, pattern, calendarStart, weekOffset } = buildCommits();

    console.log(pattern.join('\n'));
    console.log(`Calendar start: ${calendarStart}`);
    console.log(`Week offset: ${weekOffset}`);
    console.log(`Commits to create: ${commits.length}`);

    if (DRY_RUN) return;

    const git = simpleGit();

    for (const [index, commit] of commits.entries()) {
        console.log(commit.date);
        await makeCommit(git, commit, index, commits.length);
    }

    await git.push();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
