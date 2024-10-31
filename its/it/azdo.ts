import * as vm from "azure-devops-node-api";
import { Build, BuildStatus } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { AZDO_BASE_URL, AZDO_ORGANIZATION, AZDO_PROJECT } from "../constant";
import { loadEnvironmentVariables } from "./env";

export function getAzdoApi(): vm.WebApi {
  const env = loadEnvironmentVariables();
  const credentialHandler = vm.getPersonalAccessTokenHandler(env.AZURE_TOKEN);
  return new vm.WebApi(AZDO_BASE_URL + AZDO_ORGANIZATION, credentialHandler);
}

export async function runPipeline(azdoApi: vm.WebApi, pipelineName: string): Promise<Build> {
  const azdoBuildApi = await azdoApi.getBuildApi();
  const definitions = await azdoBuildApi.getDefinitions(AZDO_PROJECT, pipelineName);
  if (definitions.length === 0) {
    throw new Error(`No pipeline found with name ${pipelineName}`);
  }
  const build = await azdoBuildApi.queueBuild(
    {
      definition: { id: definitions[0].id as number },
      project: definitions[0].project,
      // TODO: Replace by dynamic current branch
      sourceBranch:
        process.env.AZURE_BRANCH ??
        `refs/tags/task/br/sonarazdo-416-setup-azdo-pipelines-to-use-new-pipeline-files`,
    },
    AZDO_PROJECT,
  );
  const buildId = build.id as number;
  const projectId = build.project?.id as string;

  console.log(`Build ${buildId} queued`);
  let buildResult = await azdoBuildApi.getBuild(projectId, buildId);
  while (buildResult.status !== BuildStatus.Completed) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    buildResult = await azdoBuildApi.getBuild(projectId, buildId);
    console.log(`Build ${buildId} status: ${buildResult.status}`);
  }

  return buildResult;
}
