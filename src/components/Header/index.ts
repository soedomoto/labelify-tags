import { ComponentStoreInterface, Registry } from '../Registry';
import { headerStore, HeaderStore } from './model';
import { HeaderProps } from './types';
import { Header } from './view';

Registry.registerComponent<HeaderStore, HeaderProps>({
  tag: 'Header',
  store: headerStore as unknown as ComponentStoreInterface<HeaderStore>,
  view: Header,
  config: {
    isObject: false,
    autoInit: true,
  },
});

export * from './model';
export * from './types';
export * from './view';

