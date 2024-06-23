import * as core from "@actions/core";

export interface Inputs {
  roots: string[];
  tags?: string[];
  hierarchical_version?: string;
}

function csvToArray(csv: string): string[] {
  return csv
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");
}

export function getInputs(): Inputs {
  return {
    roots: csvToArray(core.getInput("roots")),
    tags: csvToArray(core.getInput("tags")),
    hierarchical_version: core.getInput("hierarchical_version"),
  };
}
