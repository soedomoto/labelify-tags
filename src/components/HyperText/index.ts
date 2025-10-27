import { Registry, HyperTextStore, HyperTextProps, hyperTextStore, HyperText, ComponentStoreInterface } from '@/.';

Registry.registerComponent<HyperTextStore, HyperTextProps>({
  tag: 'HyperText',
  store: hyperTextStore as unknown as ComponentStoreInterface<HyperTextStore>,
  view: HyperText,
  config: {
    isObject: false,
    autoInit: true,
  },
});

export * from './model';
export * from './types';
export * from './view';
