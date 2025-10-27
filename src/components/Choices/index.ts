import { ComponentStoreInterface, Registry } from '../Registry';
import { ChoicesStore, choicesStore } from './model';
import { ChoicesProps } from './types';
import { Choices } from './view';

Registry.registerComponent<ChoicesStore, ChoicesProps>({
  tag: 'Choices',
  store: choicesStore as unknown as ComponentStoreInterface<ChoicesStore>,
  view: Choices,
  config: {
    isObject: false,
    autoInit: true,
  },
});

export * from './model';
export * from './types';
export * from './view';

