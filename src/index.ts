import * as core from "@actions/core";
import { getInputs } from "./context";

function run() {
  const inputs = getInputs();
  if (!(inputs.tags || inputs.hierarchical_version)) {
    core.error("Either `tags` or `hierarchical_version` input is required");
    return;
  }

  let targetTags: string[] = [];

  if (inputs.tags) {
    targetTags.push(...inputs.tags);
  }

  if (inputs.hierarchical_version) {
    let version_parts = inputs.hierarchical_version.toLowerCase().trim().replace(/^v/, "").split(".");

    for (let parts = 1; parts <= version_parts.length; parts++) {
      targetTags.push(version_parts.slice(0, parts).join("."));
    }
  }

  const finalTags = inputs.roots.map((root) => targetTags.map((tag) => `${root}:${tag}`)).flat();

  core.info("Generated tags:");
  finalTags.map(core.info);

  core.setOutput("tags", finalTags.join(","));
}

run();
