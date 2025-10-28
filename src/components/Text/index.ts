import { ComponentStore, Registry } from '../Registry';
import { textStore, TextStore } from './model';
import { TextProps } from './types';
import { Text } from './view';


Registry.registerComponent<TextStore, TextProps>({
  tag: 'Text',
  store: textStore as unknown as ComponentStore<TextStore>,
  view: Text,
  config: {
    isObject: false,
    autoInit: true,
  },
});

export * from './model';
export * from './types';
export * from './view';
