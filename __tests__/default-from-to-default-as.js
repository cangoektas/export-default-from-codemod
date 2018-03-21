const transform = require("../transforms/default-from-to-default-as");
const jscodeshift = require("jscodeshift");

const api = { jscodeshift };

test("doesn't transform named exports", () => {
  const source = "export { foo, bar };";
  expect(transform({ source }, api)).toBeNull();
});

test("doesn't transform named exports with aliases", () => {
  const source = "export { foo as bar, hello as world };";
  expect(transform({ source }, api)).toBeNull();
});

test("doesn't transform variable declarations", () => {
  const source = "export var a;\nexport let b, c;\nexport const d = null;";
  expect(transform({ source }, api)).toBeNull();
});

test("doesn't transform named functions", () => {
  const source = "export function foo() {}";
  expect(transform({ source }, api)).toBeNull();
});

test("doesn't transform named classes", () => {
  const source = "export class Foo {}";
  expect(transform({ source }, api)).toBeNull();
});

test("doesn't transform default exports", () => {
  const source = "export default 'hello';";
  expect(transform({ source }, api)).toBeNull();
});

test("doesn't transform a named default export", () => {
  const source = "export { foo as default };";
  expect(transform({ source }, api)).toBeNull();
});

test("doesn't transform source exports with *", () => {
  const source = "export * from 'foo'";
  expect(transform({ source }, api)).toBeNull();
});

test("doesn't transform named source exports", () => {
  const source = "export { hello, world } from 'foo';";
  expect(transform({ source }, api)).toBeNull();
});

test("doesn't transform named source exports with aliases", () => {
  const source = "export { hello as h, world as w } from 'foo';";
  expect(transform({ source }, api)).toBeNull();
});

test("doesn't transform default source exports", () => {
  const source = "export { default } from 'foo';";
  expect(transform({ source }, api)).toBeNull();
});

test("transforms the export-default-from syntax for a single export", () => {
  const source = "export foo from 'foo';";
  const transformedSource = "export { default as foo } from 'foo';";
  expect(transform({ source }, api)).toEqual(transformedSource);
});

test("transforms the export-default-from syntax for multiple exports", () => {
  const source = "export foo, { bar } from 'foo';";
  const transformedSource = "export { default as foo, bar } from 'foo';";
  expect(transform({ source }, api)).toEqual(transformedSource);
});

test("preserves quotes when transforming", () => {
  const source = "export foo from 'foo';\nexport bar from \"bar\";";
  const transformedSource =
    "export { default as foo } from 'foo';\nexport { default as bar } from \"bar\";";
  expect(transform({ source }, api)).toEqual(transformedSource);
});
