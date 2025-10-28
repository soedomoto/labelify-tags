import { TextAreaState } from '.';
import { SupportedTypes } from '../Base/types';
import { AbstractComponentStore } from '../Registry';

type TextAreaActions = {
  register(id: string, state: TextAreaState): () => void
  unregister(id: string): void;
  getInstance(id: string): TextAreaState | undefined;
}

export type TextAreaStore = { type: SupportedTypes, instances?: Record<string, TextAreaState> } & TextAreaActions;

const createInitialState = (): TextAreaState => ({
  type: 'TextArea',
  id: '',
  name: '',
  visible: true,
});

export const textAreaStore = (new class StoreClass<TViewStore = TextAreaState> extends AbstractComponentStore<TViewStore> {
  constructor() {
    super();
  }

  register(id: string, state: TViewStore): () => void {
    this.store.set(this.instances, (instances) => {
      return { ...instances, [id]: { ...createInitialState(), ...state } };
    });

    return () => this.unregister(id);
  }

  unregister(id: string): void {
    this.store.set(this.instances, (instances) => {
      const newInstances = { ...instances };
      delete newInstances[id];
      return newInstances;
    });
  }

  getInstance(id: string): TViewStore | undefined {
    return this.store.get(this.instances)[id];
  }

  subscribe(id: string, callback: (state: TViewStore | undefined) => void) {
    return this.store.sub(this.instances, () => {
      callback(this.store.get(this.instances)?.[id]);
    });
  }
});
