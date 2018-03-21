const babylon = require("babylon");
const recast = require("recast");
const types = require("@babel/types");
const generate = require("@babel/generator").default;

const BABEL_PLUGINS = [
  "classProperties",
  "exportDefaultFrom",
  "exportNamespaceFrom",
  "jsx",
  "objectRestSpread"
];

function isExportSpecifierWithDefaultLocal(path) {
  return path.node.local.name === "default";
}

function replaceExportSpecifiers(j, root) {
  let hasModifications = false;

  root
    .find(j.ExportSpecifier)
    .filter(isExportSpecifierWithDefaultLocal)
    .forEach(path => {
      hasModifications = true;
      const exportedName = path.node.exported.name;

      return j(path).replaceWith(
        j.exportDefaultSpecifier(j.identifier(exportedName))
      );
    });

  return hasModifications;
}

module.exports = function transform(fileInfo, api) {
  const j = api.jscodeshift;
  const ast = recast.parse(fileInfo.source, {
    parser: {
      parse(source) {
        return babylon.parse(source, {
          sourceType: "module",
          plugins: BABEL_PLUGINS
        });
      }
    }
  });
  const root = j(ast);
  const hasModifications = replaceExportSpecifiers(j, root);

  return hasModifications ? recast.print(ast).code : null;
};
