# export-default-from-codemod

> Codemods to transform from or to the export-default-from syntax

## Usage

1.  `git clone https://github.com/cangoektas/export-default-from-codemod.git` or download a zip file from `https://github.com/cangoektas/export-default-from-codemod/archive/master.zip`
2.  Run `yarn install` or `npm install` from inside the directory
3.  `jscodeshift -t <codemod-script> <path>`

    * `codemod-script` - path to the transform file, see available scripts below;
    * `path` - files or directory to transform
    * use the `-d` option for a dry-run and use `-p` to print the output for comparison;

    * use the `--extensions` option if your files have different extensions than `.js` (for example, `--extensions js,jsx`);
    * see all available [jscodeshift options](https://github.com/facebook/jscodeshift#usage-cli).

## Caveats

* Setting the `parser` option for `jscodeshift` does not have any effect because the transform script always uses `babylon`
* If you need additional Babel plugins enabled, you can update the `BABEL_PLUGINS` array in the transform script

## Included Scripts

#### `default-as-to-default-from`

Transforms this:

```js
export { default as hello } from "world";
export { default as foo, bar } from "foo";
```

into this:

```js
export hello from "world";
export foo, { bar } from "foo";
```

```sh
jscodeshift -t export-default-from-codemod/transforms/default-as-to-default-from.js <path>
```

#### `default-from-to-default-as`

_COMING SOON_

## License

MIT
