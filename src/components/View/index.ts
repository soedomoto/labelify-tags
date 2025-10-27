import { Registry, ViewStore, ViewProps, viewStore, View, ComponentStoreInterface } from '@/.';

Registry.registerComponent<ViewStore, ViewProps>({
  tag: 'View',
  store: viewStore as unknown as ComponentStoreInterface<ViewStore>,
  view: View,
  config: {
    isObject: false,
    autoInit: true,
  },
});

export * from './model';
export * from './types';
export * from './view';
