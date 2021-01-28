# Writing a custom markdown theme

The Markdown theme packaged with the plugin can also be extended with a custom Markdown theme using the standard TypeDoc theming pattern as per https://typedoc.org/guides/themes/.

### Create a theme.js class

As per the theme docs create a `theme.js` file which TypeDoc will then attempt to load from a given location.

_mytheme/custom-theme.js_

```js
import MarkdownTheme from 'typedoc-plugin-markdown/dist/theme';

export default class MyCustomTheme extends MarkdownTheme {
  constructor(renderer, basePath) {
    super(renderer, basePath);
  }
}


```

### Theme resources

By default the theme will inherit the resources of the Markdown theme
(https://github.com/tgreyuk/typedoc-plugin-markdown/packages/typedoc-plugin-markdown/tree/master/src/resources).

These can be replaced and updated as required.

### Building the theme

#### CLI

```
npx typedoc ./src --plugin typedoc-plugin-markdown --theme ./mytheme/custom-theme --out docs
```

#### API

Can also be defined programatically:

```javascript
app.bootstrap({
  entryPoints: ["src/index.ts"],
  theme: path.join(__dirname, 'mytheme', 'custom-theme'),
  plugin: 'typedoc-plugin-markdown',
});
````

See [TypeDoc API](https://typedoc.org/guides/installation/#node-module)
for full example.

