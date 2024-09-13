// ©2024 - BestCode.js - BestMat, Inc. - All rights reserved.
import inspector from "inspector/promises";
import { program } from "commander";
import figlet from "figlet";
import chalk from "chalk";
import { fileURLToPath } from "node:url";
import { isAbsolute } from "node:path";
import { readFile } from "node:fs/promises";

program.version("1.0.0").description("BestCode.js: JavaScript Code Coverage Tool.");
console.log(chalk.bgBlack(chalk.bold(chalk.hex("#FFFF00")(figlet.textSync("BestCode.js", { horizontalLayout: "full" })))));

/**
 * ? Type Definations:
 * @typedef {import("./types/types").Coverage} Coverage
 */

var ENTRYPOINT = process.argv[2];

/**
 * BestCode.js: BestCodeError Class inherits Node::Error.
 * @param {Error} error 
 */

class BestCodeError extends Error {
    constructor(error) {
        super(chalk.bold(chalk.redBright(`\nBestCode.js Error: ${error}.\n`)));
    }
}

if (ENTRYPOINT == undefined) {
    throw new BestCodeError("Undefined Entrypoint")
}

const session = new inspector.Session();
const currentFileName = fileURLToPath(import.meta.url);

session.connect();

await session.post("Profiler.enable");
await session.post("Profiler.startPreciseCoverage", {
    callCount: true,
    detailed: true
});

await import(ENTRYPOINT);

const preciseCoverage = await session.post("Profiler.takePreciseCoverage");
await session.post("Profiler.stopPreciseCoverage");

/**
 * BestCode.js: Coverage Object Filter Function.
 * @param {Coverage} coverage
 */

function filterResults(coverage) {
    return coverage.result.filter(({ url }) => {
        const finalURL = url.replaceAll("file://", "");

        // 1. Ignore Node.js Modules:
        return isAbsolute(finalURL) && finalURL !== currentFileName
    });
}

/**
 * 
 * @param {string} filename 
 * @param {string} sourceCode 
 * @param {*} functions 
 */

function generateCoverageReport(filename, sourceCode, functions) {
    const uncoveredLines = [];
    for (const cov of functions) {
        for (const range of cov.ranges) {
            if (range.count !== 0) {
                continue;
            }

            const startLine = sourceCode.substring(0, range.startOffset).split("\n").length;
            const endLine = sourceCode.substring(0, range.endOffset).split("\n").length;

            for (let charIndex = startLine; charIndex <= endLine; charIndex++) {
                uncoveredLines.push(charIndex);
            }
        }
    }

    console.log("\n", chalk.cyanBright(chalk.bold("\rFile:")), chalk.bold(chalk.greenBright(filename)));
    console.log();
    sourceCode.split("\n").forEach((line, lineIndex) => {
        if (uncoveredLines.includes(lineIndex + 1) && !line.startsWith("}")) {
            console.log(chalk.redBright(chalk.bold(line)));
        } else {
            console.log(chalk.green(line));
        }
    });
}

const results = filterResults(preciseCoverage);

for (const coverage of results) {
    const fileName = fileURLToPath(coverage.url);
    const sourceCode = await readFile(fileName, "utf8");

    generateCoverageReport(fileName, sourceCode, coverage.functions);
};