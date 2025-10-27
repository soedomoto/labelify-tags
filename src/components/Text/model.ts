import { TextState } from '.';
import { SupportedTypes } from '../Base/types';
import { ComponentStore } from '../Registry';

type TextActions = {
  register(id: string, state: TextState): () => void
  unregister(id: string): void;
  getInstance(id: string): TextState | undefined;
}

export type TextStore = { type: SupportedTypes, instances?: Record<string, TextState> } & TextActions;

const createInitialState = (): TextState => ({
  type: 'Text',
  id: '',
  name: '',
  visible: true,
});

export const textStore = (new class StoreClass<TViewStore = TextState> extends ComponentStore<TViewStore> {
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
