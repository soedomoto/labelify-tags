import { ComponentStore, Registry } from '../Registry';
import { headerStore, HeaderStore } from './model';
import { HeaderProps } from './types';
import { Header } from './view';

Registry.registerComponent<HeaderStore, HeaderProps>({
  tag: 'Header',
  store: headerStore as unknown as ComponentStore<HeaderStore>,
  view: Header,
  config: {
    isObject: false,
    autoInit: true,
  },
});

export * from './model';
export * from './types';
export * from './view';

