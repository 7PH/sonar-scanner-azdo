import { getAzdoApi, runPipeline } from "./azdo";
import { testCases } from "./cases";
import { verifyMeasures } from "./sonar";

export async function main() {
  const azdoApi = getAzdoApi();

  for (const testCase of testCases) {
    console.log(`running pipeline ${testCase.pipelineName}`);
    await runPipeline(azdoApi, testCase.pipelineName);
    await verifyMeasures(
      testCase.sonarHostUrl,
      testCase.projectKey,
      testCase.coverage,
      testCase.nloc,
    );
  }
}
