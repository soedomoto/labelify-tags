import { ComponentStoreInterface, Registry } from '../Registry';
import { ChoiceStore, choiceStore } from './model';
import { ChoiceProps } from './types';
import { Choice } from './view';

Registry.registerComponent<ChoiceStore, ChoiceProps>({
  tag: 'Choice',
  store: choiceStore as unknown as ComponentStoreInterface<ChoiceStore>,
  view: Choice,
  config: {
    isObject: false,
    autoInit: true,
  },
});

export * from './model';
export * from './types';
export * from './view';

