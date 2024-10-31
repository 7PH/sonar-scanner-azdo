type TestCase = {
  sonarHostUrl: string;
  projectKey: string;
  pipelineName: string;
  nloc: number;
  coverage: number;
};

export const testCases: TestCase[] = [
  {
    sonarHostUrl: "https://sonarcloud.io",
    projectKey: "dummy-project-cli",
    pipelineName: "SonarSource.sonar-scanner-azdo (debug pipeline)",
    nloc: 2907,
    coverage: 0.5,
  },
];
