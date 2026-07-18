import { configV1 } from "./config-v1";
import { tasksV1 } from "./tasks-v1";
import {
  hasPublishedBenchmarkRun,
  latestBenchmarkRun,
} from "./results/latest";

export function getBenchmarkTasks() {
  return tasksV1;
}

export function getBenchmarkConfig() {
  return configV1;
}

export function getLatestBenchmarkRun() {
  return hasPublishedBenchmarkRun ? latestBenchmarkRun : null;
}

export function getBenchmarkModelTargets() {
  return configV1.models;
}
