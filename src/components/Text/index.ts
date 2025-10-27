import { Registry, TextStore, TextProps, textStore, Text, ComponentStoreInterface } from '@/.';

Registry.registerComponent<TextStore, TextProps>({
  tag: 'Text',
  store: textStore as unknown as ComponentStoreInterface<TextStore>,
  view: Text,
  config: {
    isObject: false,
    autoInit: true,
  },
});

export * from './model';
export * from './types';
export * from './view';
