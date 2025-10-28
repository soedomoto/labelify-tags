import { ComponentStore, Registry } from '../Registry';
import { textAreaStore, TextAreaStore } from './model';
import { TextAreaProps } from './types';
import { TextArea } from './view';


Registry.registerComponent<TextAreaStore, TextAreaProps>({
  tag: 'TextArea',
  store: textAreaStore as unknown as ComponentStore<TextAreaStore>,
  view: TextArea,
  config: {
    isControl: true,
    isObject: false,
    autoInit: true,
  },
});

export * from './model';
export * from './types';
export * from './view';
