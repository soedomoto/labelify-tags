import { ViewState } from '.';
import { SupportedTypes } from '../Base/types';
import { AbstractComponentStore } from '../Registry';

type ViewActions = {
  register(id: string, state: ViewState): () => void
  unregister(id: string): void;
  getInstance(id: string): ViewState | undefined;
}

export type ViewStore = { type: SupportedTypes, instances?: Record<string, ViewState> } & ViewActions;

const createInitialState = (): ViewState => ({
  type: 'View',
  id: '',
  name: '',
  visible: true,
});

export const viewStore = (new class StoreClass<TViewStore = ViewState> extends AbstractComponentStore<TViewStore> {
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
