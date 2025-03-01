import * as fs from 'fs';

import { DeclarationReflection, NavigationItem } from 'typedoc';
import MarkdownTheme from 'typedoc-plugin-markdown/dist/theme';
import { GroupPlugin } from 'typedoc/dist/lib/converter/plugins';
import { RendererEvent } from 'typedoc/dist/lib/output/events';
import { Renderer } from 'typedoc/dist/lib/output/renderer';
import { TemplateMapping } from 'typedoc/dist/lib/output/themes/DefaultTheme';

import { UtilsComponent } from './utils';

export default class GitlabTheme extends MarkdownTheme {
  constructor(renderer: Renderer, basePath: string) {
    super(renderer, basePath);
    renderer.application.options.setValue('entryDocument', 'home.md');
    renderer.application.options.setValue('hideBreadcrumbs', true);
    renderer.application.options.setValue('hidePageTitle', true);
    renderer.addComponent('utils', new UtilsComponent(renderer));
    this.listenTo(renderer, RendererEvent.END, this.onGitLabRendererEnd);
  }

  toUrl(mapping: TemplateMapping, reflection: DeclarationReflection) {
    return `${mapping.directory}/${GroupPlugin.getKindSingular(
      reflection.kind,
    )}:-${reflection.name}.md`;
  }

  onGitLabRendererEnd(renderer: RendererEvent) {
    const parseUrl = (url: string) => url.replace(/(.*).md/, '$1');
    const navigation: NavigationItem = this.getNavigation(renderer.project);
    const navJson: string[] = [
      `## [${renderer.project.name}](${parseUrl(this.entryDocument)})\n`,
    ];
    if (navigation.children) {
      navigation.children.forEach((navItem) => {
        if (navItem.isLabel) {
          navJson.push(`\n### ${navItem.title}\n`);
          navItem.children?.forEach((navItemChild) => {
            const longTitle = navItemChild.title.split('.');
            const shortTitle = longTitle[longTitle.length - 1];
            navJson.push(`- [${shortTitle}](${parseUrl(navItemChild.url)})`);
          });
        }
      });
    }
    fs.writeFileSync(
      renderer.outputDirectory + '/_sidebar.md',
      navJson.join('\n'),
    );
  }
}
