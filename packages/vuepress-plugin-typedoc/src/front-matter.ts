import { BindOption } from 'typedoc';
import {
  getPageTitle,
  prependYAML,
} from 'typedoc-plugin-markdown/dist/utils/front-matter';
import { Component } from 'typedoc/dist/lib/converter/components';
import { RendererComponent } from 'typedoc/dist/lib/output/components';
import { PageEvent } from 'typedoc/dist/lib/output/events';

@Component({ name: 'front-matter' })
export class FrontMatterComponent extends RendererComponent {
  @BindOption('entryDocument')
  entryDocument!: string;
  initialize() {
    super.initialize();
    this.listenTo(this.application.renderer, {
      [PageEvent.END]: this.onPageEnd,
    });
  }
  onPageEnd(page: PageEvent) {
    if (page.contents) {
      page.contents = prependYAML(page.contents, {
        title: this.getTitle(page),
      });
    }
  }

  getTitle(page: PageEvent) {
    if (page.url === this.entryDocument && page.url !== page.project.url) {
      return page.project.name;
    }
    return getPageTitle(page);
  }
}
