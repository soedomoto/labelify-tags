import { ChoiceRegistration } from '.';
import { SupportedTypes } from '../Base/types';
import { AbstractComponentStore } from '../Registry';

const createInitialState = (): ChoiceRegistration => ({
  type: 'Choice',
  id: '',
  visible: true,
});

export const choiceStore = (new class StoreClass<TViewStore = ChoiceRegistration> extends AbstractComponentStore<TViewStore> {
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
