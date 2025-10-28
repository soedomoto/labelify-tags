import { ComponentStore, Registry } from '../Registry';
import { choiceStore } from './model';
import { ChoiceProps } from './types';
import { Choice } from './view';

Registry.registerComponent<typeof choiceStore, ChoiceProps>({
  tag: 'Choice',
  store: choiceStore as unknown as ComponentStore<typeof choiceStore>,
  view: Choice,
  config: {
    isObject: false,
    autoInit: true,
  },
});

export * from './model';
export * from './types';
export * from './view';

