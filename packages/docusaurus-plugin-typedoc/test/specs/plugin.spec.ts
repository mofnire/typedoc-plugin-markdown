import { LoadContext } from '@docusaurus/types';
import * as fs from 'fs-extra';
import * as tmp from 'tmp';

import typedocPlugin from '../../dist/plugin';
import * as watch from '../../dist/watch';

tmp.setGracefulCleanup();

async function bootstrap(tmpobj: tmp.DirResult, customOptions = {}) {
  const options = {
    id: 'default',
    logger: 'none',
    entryPoints: ['../typedoc-plugin-markdown/test/stubs/src/theme.ts'],
    tsconfig: '../typedoc-plugin-markdown/test/stubs/tsconfig.json',
  } as any;

  const plugin = typedocPlugin(
    {
      siteDir: tmpobj.name,
      generatedFilesDir: '',
      siteConfig: {},
    } as LoadContext,
    {
      ...options,
      ...customOptions,
    },
  );
  return await plugin;
}

describe(`Plugin:`, () => {
  describe(`(docs)`, () => {
    let tmpobj;
    beforeAll(async () => {
      tmpobj = tmp.dirSync();
      await bootstrap(tmpobj);
    });
    test(`should render`, () => {
      const files = fs.readdirSync(tmpobj.name + '/docs/api');
      expect(files).toMatchSnapshot();
    });

    test(`should write doc`, () => {
      const sidebar = fs.readFileSync(tmpobj.name + '/docs/api/index.md');
      expect(sidebar.toString()).toMatchSnapshot();
    });

    test(`should write sidebar`, () => {
      const sidebar = fs.readFileSync(tmpobj.name + '/typedoc-sidebar.js');
      expect(sidebar.toString()).toMatchSnapshot();
    });
  });

  describe(`(watch)`, () => {
    let tmpobj: tmp.DirResult;
    let watchSpy: jest.SpyInstance;
    beforeAll(async () => {
      watchSpy = jest.spyOn(watch, 'convertAndWatch').mockReturnValue();
      tmpobj = tmp.dirSync();
      await bootstrap(tmpobj, { id: 'watch', watch: true });
    });

    test(`should call watch`, async () => {
      expect(watchSpy).toHaveBeenCalled();
    });
  });
});
