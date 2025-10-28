import { ComponentStore, Registry } from '../Registry';
import { choicesStore } from './model';
import { ChoicesProps } from './types';
import { Choices } from './view';

Registry.registerComponent<typeof choicesStore, ChoicesProps>({
  tag: 'Choices',
  store: choicesStore as unknown as ComponentStore<typeof choicesStore>,
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

