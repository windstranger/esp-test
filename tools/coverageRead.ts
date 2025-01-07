import * as fs from 'fs';

function readCoverage(filePath: string) {
    const coverageData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    coverageData.forEach((entry: any) => {
        const totalLength = entry.text.length;
        const coveredLength = entry.ranges.reduce(
            (acc: number, range: any) => acc + (range.end - range.start),
            0
        );

        console.log(`File: ${entry.url}`);
        console.log(`Coverage: ${(coveredLength / totalLength) * 100}%`);
        console.log();
    });
}

// Read JS Coverage
readCoverage('../coverage/js-coverage.json');

// Read CSS Coverage
readCoverage('../coverage/css-coverage.json');
