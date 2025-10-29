import { TextAreaRegistration } from '.';
import { AbstractComponentStore } from '../Registry';

const createInitialState = (): TextAreaRegistration => ({
  type: 'TextArea',
  id: '',
  name: '',
  toName: '',
  visible: true,
  value: '',
});

export const textAreaStore = (new class StoreClass<TViewStore = TextAreaRegistration> extends AbstractComponentStore<TViewStore> {
  constructor() {
    super();
  }

  register(id: string, state: TViewStore): () => void {
    this.store.set(this.instances, (instances) => {
      return {
        ...instances, [id]: {
          ...createInitialState(),
          ...state,
          getFormattedValue: () => {
            return { 'text': (this.store.get(this.instances)?.[id] as TextAreaRegistration)?.value || [] };
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
      callback(this.store.get(this.instances)?.[id]);
    });
  }
});
