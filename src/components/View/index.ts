import { ComponentStoreInterface, Registry } from '../Registry';
import { viewStore, ViewStore } from './model';
import { ViewProps } from './types';
import { View } from './view';

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
