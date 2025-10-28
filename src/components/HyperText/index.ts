import { ComponentStore, Registry } from '../Registry';
import { hyperTextStore, HyperTextStore } from './model';
import { HyperTextProps } from './types';
import { HyperText } from './view';

Registry.registerComponent<HyperTextStore, HyperTextProps>({
  tag: 'HyperText',
  store: hyperTextStore as unknown as ComponentStore<HyperTextStore>,
  view: HyperText,
  config: {
    isObject: false,
    autoInit: true,
  },
});

export * from './model';
export * from './types';
export * from './view';
