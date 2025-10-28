import { ComponentStore, Registry } from '../Registry';
import { ChoicesStore, choicesStore } from './model';
import { ChoicesProps } from './types';
import { Choices } from './view';

Registry.registerComponent<ChoicesStore, ChoicesProps>({
  tag: 'Choices',
  store: choicesStore as unknown as ComponentStore<ChoicesStore>,
  view: Choices,
  config: {
    isControl: true,
    isObject: false,
    autoInit: true,
  },
});

export * from './model';
export * from './types';
export * from './view';

