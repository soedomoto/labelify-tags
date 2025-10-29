import { ChoicesRegistration, ChoicesState } from '.';
import { AbstractComponentStore } from '../Registry';

const createInitialState = (): ChoicesRegistration => ({
  type: 'Choices',
  id: '',
  name: '',
  toName: '',
  visible: true,
});

export const choicesStore = (new class StoreClass<TViewStore = ChoicesRegistration> extends AbstractComponentStore<TViewStore> {
  constructor() {
    super();
  }

  register(id: string, state: TViewStore): () => void {
    this.store.set(this.instances, (instances) => {
      return {
        ...instances, [id]: {
          ...createInitialState(),
          ...(instances[id] || {}),
          ...state,
          getFormattedValue: () => {
            return { 'choices': (this.store.get(this.instances)?.[id] as ChoicesState)?.value || [] };
          },
        }
      };
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
