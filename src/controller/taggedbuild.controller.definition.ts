/*
 * This set maps dependant github system variables in the TeamCity project.
 * Most of the projects in TeamCity have dependencies on other git repos
 * (system.GitDefaultBranch-Q4Foundation) for example. The key of this set
 * matches everything after system.GitDefaultBranch to a valid github repository
 * which is the value of each entry
 */
export const DependantRepos: Map<string, string> = new Map<string, string>();
DependantRepos.set("Q4Foundation", "Q4Web-Q4Foundation");
DependantRepos.set("Q4Analytics", "Q4Web-Q4Analytics");
DependantRepos.set("Q4Proxy", "Q4Web-Q4Proxy");
DependantRepos.set("Q4Setup", "Q4Web-Q4Setup");

DependantRepos.set("Q4Orion-Go", "Q4Web-Q4Orion-Go");
DependantRepos.set("Q4CustomerAccount", "Q4Web-Q4Orion-CustomerAccount");
DependantRepos.set("Q4Orion-Cloud", "Q4Web-Q4Orion-Cloud");
DependantRepos.set("Q4Orion-NServiceBus", "Q4Web-Q4Orion-NServiceBus");
DependantRepos.set("Q4Orion-SerialService", "Q4Web-Q4Orion-SerialService");
DependantRepos.set("Q4Orion-Air", "Q4Web-Q4Orion-Air");
