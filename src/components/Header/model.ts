import { HeaderState } from '.';
import { SupportedTypes } from '../Base/types';
import { AbstractComponentStore } from '../Registry';

type HeaderActions = {
  register(id: string, state: HeaderState): () => void
  unregister(id: string): void;
  getInstance(id: string): HeaderState | undefined;
}

export type HeaderStore = { type: SupportedTypes, instances?: Record<string, HeaderState> } & HeaderActions;

const createInitialState = (): HeaderState => ({
  type: 'Header',
  id: '',
  name: '',
  visible: true,
});

export const headerStore = (new class StoreClass<TViewStore = HeaderState> extends AbstractComponentStore<TViewStore> {
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
