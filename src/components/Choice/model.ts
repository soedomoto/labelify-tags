import { ChoiceState } from '.';
import { SupportedTypes } from '../Base/types';
import { AbstractComponentStore } from '../Registry';

type ChoiceActions = {
  register(id: string, state: ChoiceState): () => void
  unregister(id: string): void;
  getInstance(id: string): ChoiceState | undefined;
}

export type ChoiceStore = { type: SupportedTypes, instances?: Record<string, ChoiceState> } & ChoiceActions;

const createInitialState = (): ChoiceState => ({
  type: 'Choice',
  id: '',
  name: '',
  visible: true,
});

export const choiceStore = (new class StoreClass<TViewStore = ChoiceState> extends AbstractComponentStore<TViewStore> {
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

  subscribe(id: string, callback: (state: TViewStore | undefined) => void) {
    return this.store.sub(this.instances, () => {
      callback(this.store.get(this.instances)?.[id]);
    });
  }
});
