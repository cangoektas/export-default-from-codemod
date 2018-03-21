const babylon = require("babylon");
const recast = require("recast");

const BABEL_PLUGINS = [
  "classProperties",
  "exportDefaultFrom",
  "exportNamespaceFrom",
  "jsx",
  "objectRestSpread"
];

function replaceExportDefaultSpecifiers(j, root) {
  let hasModifications = false;

  root.find(j.ExportDefaultSpecifier).forEach(path => {
    hasModifications = true;
    const exportedName = path.node.exported.name;

    return j(path).replaceWith(
      j.exportSpecifier(j.identifier("default"), j.identifier(exportedName))
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
  const hasModifications = replaceExportDefaultSpecifiers(j, root);

  return hasModifications ? recast.print(ast).code : null;
};
