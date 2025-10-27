import { HyperTextState } from '.';
import { SupportedTypes } from '../Base/types';
import { ComponentStore } from '../Registry';

type HyperTextActions = {
  register(id: string, state: HyperTextState): () => void
  unregister(id: string): void;
  getInstance(id: string): HyperTextState | undefined;
}

export type HyperTextStore = { type: SupportedTypes, instances?: Record<string, HyperTextState> } & HyperTextActions;

const createInitialState = (): HyperTextState => ({
  type: 'HyperText',
  id: '',
  name: '',
  visible: true,
});

export const hyperTextStore = (new class StoreClass<TViewStore = HyperTextState> extends ComponentStore<TViewStore> {
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
