import { ChoicesState } from '.';
import { SupportedTypes } from '../Base/types';
import { AbstractComponentStore } from '../Registry';

type ChoicesActions = {
  register(id: string, state: ChoicesState): () => void
  unregister(id: string): void;
  getInstance(id: string): ChoicesState | undefined;
}

export type ChoicesStore = { type: SupportedTypes, instances?: Record<string, ChoicesState> } & ChoicesActions;

const createInitialState = (): ChoicesState => ({
  type: 'Choices',
  id: '',
  name: '',
  visible: true,
});

export const choicesStore = (new class StoreClass<TViewStore = ChoicesState> extends AbstractComponentStore<TViewStore> {
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
      const value = this.store.get(this.instances)?.[id];
      callback(value);
    });
  }

  setValues(id: string, key: string, value: string) {
    this.store.set(this.instances, (instances: Record<string, TViewStore>) => {
      let values = [...((instances[key] as ChoicesState)?.value || []), value];
      if ((instances[key] as ChoicesState)?.choice === 'single') {
        values = [value];
      }

      return {
          ...instances,
          [id]: {
            ...instances[id],
            value: values,
          } as TViewStore,
        };
    });
  }
});
