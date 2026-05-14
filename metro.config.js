const { getDefaultConfig } = require("@expo/metro-config");
const path = require("path");
const fs = require("fs");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, "..");
const workspaceNodeModules = path.resolve(workspaceRoot, "node_modules");

// No EAS o workspace root não existe — detecta o ambiente
const isMonorepo = fs.existsSync(workspaceNodeModules) &&
  fs.existsSync(path.resolve(workspaceRoot, "pnpm-workspace.yaml"));

const config = getDefaultConfig(projectRoot);

if (isMonorepo) {
  config.watchFolders = [
    ...(config.watchFolders || []),
    workspaceRoot,
  ];
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    workspaceNodeModules,
  ];
  config.resolver.extraNodeModules = {
    react: path.resolve(workspaceNodeModules, "react"),
    "react-dom": path.resolve(workspaceNodeModules, "react-dom"),
    "react-native": path.resolve(workspaceNodeModules, "react-native"),
  };
} else {
  // EAS standalone: usa só o node_modules local
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
  ];
}

module.exports = config;
