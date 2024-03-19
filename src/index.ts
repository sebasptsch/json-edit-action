import * as core from "@actions/core";
import fs from "node:fs";

type UnknownJson = Record<string, unknown>

try {
  const path = core.getInput("path", {
    required: true,
    trimWhitespace: true,
  });

  // Read the file
  const file = fs.readFileSync(path, "utf-8");

  const key = core.getInput("key", {
    required: true,
    trimWhitespace: true,
  });

  const value = core.getInput("value", {
    required: true,
    trimWhitespace: true,
  });

  const parsedToml = JSON.parse(file);

  // If the key is a string, we can just set it directly
  // split the key by '.' and iterate through the keys to set the value

  const keys = key.split(".");
  let currentObject = parsedToml as UnknownJson
  for (let i = 0; i < keys.length - 1; i++) {
    if (currentObject[keys[i]] === undefined) {
      currentObject[keys[i]] = {};
    }
    currentObject = currentObject[keys[i]] as UnknownJson;
  }
  currentObject[keys[keys.length - 1]] = value;

  const newFile = JSON.stringify(parsedToml, null, 2);



  // Write the file
  fs.writeFileSync(path, newFile);

  core.setOutput("result", newFile);

} catch (error) {
  if (error instanceof Error) {
    core.setFailed(error.message);
  } else {
    core.setFailed("Unknown error");
  }
}
