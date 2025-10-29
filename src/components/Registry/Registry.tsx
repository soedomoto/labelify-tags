import { randomId } from "@mantine/hooks";
import { atom, createStore, PrimitiveAtom } from "jotai";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import merge from "lodash/merge";
import { ComponentType, CSSProperties, JSX, useEffect, useState } from "react";
import { SupportedTypes } from "../Base/types";

export interface BaseObjectProps {
  id: string;
  parentId?: string;
  style?: string;
  children?: JSX.Element | JSX.Element[] | string;
}

export interface BaseObjectState {
  type: SupportedTypes;
  visible: boolean,
  reactStyle?: CSSProperties | undefined;
  props?: Record<string, unknown>;
}

export interface BaseControlProps extends BaseObjectProps {
  name: string;
  toName: string;
}

export interface BaseControlState extends BaseObjectState, BaseControlProps {
  formattedValue?: Record<string, any>;
  setFormattedValue: (value: Record<string, any>) => void;
  getFormattedValue: () => Record<string, any>;
}
export interface ComponentStore<TViewStore = unknown> {
  type: SupportedTypes;
  instances: PrimitiveAtom<Record<string, TViewStore>>;

  register(id: string, state: TViewStore): () => void;
  unregister(id: string): void;
  getInstance(id: string): TViewStore | undefined;
  subscribe(id: string, callback: (state: TViewStore | undefined) => void): () => void;
  getInstanceKeys(): string[];
  getInstances(): (TViewStore | undefined)[]
}
export abstract class AbstractComponentStore<TViewStore> implements ComponentStore<TViewStore> {
  public type: SupportedTypes = 'View';
  public instances = atom<Record<string, TViewStore>>({});

  get store() {
    return Registry.store;
  }

  register(id: string, state: TViewStore): () => void {
    throw new Error('Method not implemented.');
  }
  unregister(id: string): void {
    throw new Error('Method not implemented.');
  }
  subscribe(id: string, callback: (state: TViewStore | undefined) => void): () => void {
    throw new Error('Method not implemented.');
  }

  getInstance(id: string): TViewStore | undefined {
    return this.store.get(this.instances)[id];
  }

  getInstanceKeys(): string[] {
    return Object.keys(this.store.get(this.instances) || {});
  }

  getInstances(): (TViewStore | undefined)[] {
    const instances = this.store.get(this.instances) || {};
    return Object.keys(instances).map((key) => instances[key] as TViewStore);
  }
}

export interface ComponentDefinition<TViewStore = unknown, TViewProps = unknown> {
  tag: SupportedTypes;
  store: ComponentStore<TViewStore>;
  view: ComponentType<TViewProps>;

  config?: {
    isControl?: boolean;
    isObject?: boolean;
    autoInit?: boolean;
    defaultProps?: Partial<TViewProps>;
    detector?: (value: unknown) => boolean;
  };

  region?: {
    name: string;
    nodeView?: {
      name: string;
      icon?: ComponentType;
      getContent?: (node: unknown) => JSX.Element | null;
      fullContent?: (node: unknown) => JSX.Element | null;
    };
  };

  middleware?: {
    beforeRender?: (props: unknown) => void;
    afterRender?: (props: unknown) => void;
    cleanup?: () => void;
  };
}

export type RegistryEvent =
  | {
    type: 'component-registered';
    tag: string;
    timestamp: number;
  }
  | {
    type: 'component-unregistered';
    tag: string;
    timestamp: number;
  }
  | {
    type: 'tool-registered';
    name: string;
    timestamp: number;
  }
  | {
    type: 'registry-cleared';
    timestamp: number;
  };

export interface InstanceValue {
  value: Record<string, any>;
  id: string;
  from_name: string;
  to_name: string;
  type: string;
  origin: string;
}

class CRegistry {
  public store = createStore();
  private components = atom<Record<string, ComponentDefinition<unknown, unknown>>>({});
  private stores = atom<Record<string, ComponentStore<unknown>>>({});

  registerComponent<TViewStore = unknown, TViewProps = unknown>(definition: ComponentDefinition<TViewStore, TViewProps>) {
    const normalizedTag = definition.tag;

    if (normalizedTag in this.store.get(this.components)) {
      console.warn(`Component '${normalizedTag}' is already registered. Overwriting...`);
    }

    this.store.set(this.components, (components) => {
      return { ...components, [normalizedTag]: merge({ config: { isControl: false } }, definition) as ComponentDefinition<any, any> };
    });

    this.store.set(this.stores, (stores) => {
      return { ...stores, [normalizedTag]: definition.store as ComponentStore<any> };
    });
  }

  getComponent<TViewStore = unknown, TViewProps = unknown>(tag: string): ComponentDefinition<TViewStore, TViewProps> {
    const normalizedTag = tag;

    const component = this.store.get(this.components)[normalizedTag];

    if (!component) {
      const available = Object.keys(this.store.get(this.components));
      console.warn(
        `Component '${normalizedTag}' not registered.\nAvailable: ${available.join(', ') || 'none'}`,
      );
    }

    return component as ComponentDefinition<TViewStore, TViewProps>;
  }

  getComponentView<TViewProps = unknown>(tag: string) {
    return this.store.get(this.components)[tag]?.view as ComponentType<TViewProps>;
  }

  getComponentStore<TViewStore = unknown>(tag: string) {
    return this.store.get(this.components)[tag]?.store as ComponentStore<TViewStore>;
  }

  hasComponent(tag: string): boolean {
    return tag in this.store.get(this.components);
  }

  getAllComponents(): ComponentDefinition[] {
    return Object.values(this.store.get(this.components));
  }

  getAllComponentStores(): ComponentStore[] {
    return Object.values(this.store.get(this.stores));
  }

  getComponentTags(): string[] {
    return Object.keys(this.store.get(this.components));
  }

  public subscribeInstancesValuesChanges(callback: (instances: Record<string, InstanceValue>) => void): () => void {
    let allSubscriptions: (() => void)[] = [];
    const allInstancesValue: Record<string, InstanceValue> = {};

    const debFn = debounce((allInstancesValue) => {
      callback(allInstancesValue);
    }, 100);

    const instances: Record<string, unknown> = {};
    const updateInstances = (comp: ComponentDefinition<unknown, unknown>, instanceId: string, instance: unknown) => {
      if (Object.keys(instances).includes(instanceId)) return;
      instances[instanceId] = instance;

      const subscription = comp.store.subscribe(instanceId, (s) => {
        const state = s as BaseControlState;
        allInstancesValue[instanceId] = {
          "value": state.getFormattedValue(),
          "id": "",
          "from_name": state.name,
          "to_name": state.toName,
          "type": comp.tag.toLowerCase(),
          "origin": "manual"
        };

        debFn(allInstancesValue);
      });
      allSubscriptions.push(subscription);
    }

    const components = this.getAllComponents();
    for (const comp of components) {
      if (!comp?.config?.isControl) continue;

      const subscription = this.store.sub(comp.store.instances, () => {
        const instances = this.store.get(comp.store.instances);
        for (const instanceId in instances) {
          updateInstances(comp, instanceId, instances[instanceId]);
        }
      });

      allSubscriptions.push(subscription);
    }

    return () => {
      for (const unsub of allSubscriptions) unsub();
    };
  }

  public getInstancesValues() {
    let values: Record<string, InstanceValue> = {};
    const components = this.getAllComponents();
    for (const comp of components) {
      if (!comp?.config?.isControl) continue;

      for (const instance of comp?.store?.getInstances() as BaseControlState[]) {
        values[instance?.id || ''] = { "value": instance.getFormattedValue(), "id": randomId(), "from_name": instance?.name, "to_name": instance?.toName, "type": comp?.tag?.toLowerCase(), "origin": "manual" };
      }
    }

    return values;
  }
}

export const Registry = new CRegistry();
export const getInstancesValues = Registry.getInstancesValues.bind(Registry);
export const subscribeInstancesValuesChanges = Registry.subscribeInstancesValuesChanges.bind(Registry);

export function useSubscribeInstancesChanges() {
  const [values, setValues] = useState<Record<string, InstanceValue>>({});
  useEffect(() => {
    return subscribeInstancesValuesChanges(_values => {
      console.log('isEqual', isEqual(_values, values), _values, values);
      console.log('isEqual', JSON.stringify(_values) == JSON.stringify(values), _values, values);

      // if (!isEqual(_values, values)) {
      //   setValues({ ..._values });
      // }
    });
  }, [values]);
  return values;
}
