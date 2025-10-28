import { randomId } from "@mantine/hooks";
import { atom, createStore, PrimitiveAtom } from "jotai";
import merge from "lodash/merge";
import { ComponentType, CSSProperties, JSX } from "react";
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

  public getInstancesValues() {
    let values: Record<string, {
      value: Record<string, any>;
      id: string;
      from_name: string;
      to_name: string;
      type: string;
      origin: string;
    }> = {};
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

// export function useRegistry(): _Registry {
//   const [, setTrigger] = useState({});

//   useEffect(() => {
//     const listener = () => setTrigger({});
//     const unsubscribe = Registry.subscribe(() => {
//       listener();
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   return Registry;
// }