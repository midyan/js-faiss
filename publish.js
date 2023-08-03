/* eslint-disable */

const semver = require("semver");
const fs = require("fs");
const { execSync } = require("child_process");

const packageJson = require("./package.json");

const publish = () => {
  const type = process.argv[2];

  if (["major", "minor", "patch"].indexOf(type) === -1) {
    throw new Error("Invalid version type. Needs to be major, minor or patch");
  }

  const newVersion = semver.inc(packageJson.version, type);

  packageJson.version = newVersion;

  console.log(`Updating from ${packageJson.version} to ${newVersion}`);

  fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));

  execSync("yarn git-publish", {
    env: {
      TAG: newVersion,
    },
  });
};

publish();