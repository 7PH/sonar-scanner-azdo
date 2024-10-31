import axios from "axios";
import { loadEnvironmentVariables } from "./env";

export async function getMeasures(
  sonarHostUrl: string,
  componentKey: string,
): Promise<{ nloc: number; coverage: number }> {
  const env = loadEnvironmentVariables();

  const response = await axios.get(
    `${sonarHostUrl}/api/measures/component?component=${componentKey}&metricKeys=coverage,ncloc`,
    {
      headers: {
        Authorization: `Bearer ${env.SONARCLOUD_TOKEN}`,
      },
    },
  );
  const { measures } = response.data.component;
  return {
    nloc: parseInt(measures.find((m: any) => m.metric === "ncloc").value, 10),
    coverage: parseFloat(measures.find((m: any) => m.metric === "coverage").value),
  };
}

export async function verifyMeasures(
  sonarHostUrl: string,
  componentKey: string,
  expectedCoverage: number,
  expectedNloc: number,
): Promise<void> {
  const { coverage, nloc } = await getMeasures(sonarHostUrl, componentKey);
  if (coverage !== expectedCoverage) {
    throw new Error(`Coverage is not as expected: ${coverage} !== ${expectedCoverage}`);
  }
  if (nloc !== expectedNloc) {
    throw new Error(`NLOC is not as expected: ${nloc} !== ${expectedNloc}`);
  }
}
