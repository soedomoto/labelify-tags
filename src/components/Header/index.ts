import { HeaderProps, Registry, HeaderStore, headerStore, Header, ComponentStoreInterface } from '@/.';

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

