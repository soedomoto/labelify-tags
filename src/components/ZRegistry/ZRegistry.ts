/**
 * ZRegistry - Zustand Component Registry System
 *
 * A modern registry system for managing Zustand-based components,
 * replacing the MST-based Registry for new component implementations.
 * Provides a unified way to register, discover, and manage Zustand stores
 * and their corresponding React components.
 */

import { JSX, useEffect, useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Metadata about a Zustand store
 */
export interface ZustandStoreMetadata {
  /** Unique identifier for the store */
  name: string;

  /** Human-readable description */
  description?: string;

  /** Version of the store implementation */
  version?: string;

  /** Author or maintainer */
  author?: string;

  /** Tags for categorization */
  tags?: string[];

  /** Custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Configuration for a Zustand-based component
 */
export interface ZComponentDefinition<TStore = Record<string, unknown>, TViewProps = unknown> {
  /** Component tag name (e.g., 'zlabels', 'zbutton') */
  tag: string;

  /** Store metadata and information */
  store: ZustandStoreMetadata & {
    /** The Zustand hook/store creator */
    hook: () => TStore;
  };

  /** React component that uses the store */
  view: React.ComponentType<TViewProps>;

  /** Configuration and initialization */
  config?: {
    /** Whether this is an object type */
    isObject?: boolean;

    /** Auto-initialize on mount */
    autoInit?: boolean;

    /** Default props to apply */
    defaultProps?: Partial<TViewProps>;

    /** Custom detector function for type detection */
    detector?: (value: unknown) => boolean;
  };

  /** Region configuration (for annotation areas) */
  region?: {
    name: string;
    nodeView?: {
      name: string;
      icon?: React.ComponentType;
      getContent?: (node: unknown) => JSX.Element | null;
      fullContent?: (node: unknown) => JSX.Element | null;
    };
  };

  /** Custom hooks or middleware */
  middleware?: {
    /** Pre-render hook */
    beforeRender?: (props: unknown) => void;

    /** Post-render hook */
    afterRender?: (props: unknown) => void;

    /** Cleanup hook */
    cleanup?: () => void;
  };
}

/**
 * Registered component with resolved information
 */
export interface RegisteredZComponent<TStore = Record<string, unknown>, TViewProps = unknown> {
  tag: string;
  store: ZustandStoreMetadata & { hook: () => TStore };
  view: React.ComponentType<TViewProps>;
  config?: ZComponentDefinition['config'];
  region?: ZComponentDefinition['region'];
  middleware?: ZComponentDefinition['middleware'];
}

/**
 * Registry statistics and information
 */
export interface RegistryStats {
  totalComponents: number;
  totalStores: number;
  components: string[];
  storesInfo: Array<{
    name: string;
    tag: string;
    description?: string;
  }>;
}

// ============================================================================
// REGISTRY CLASS
// ============================================================================

/**
 * ZRegistry - Zustand Component Registry
 *
 * Manages registration and discovery of Zustand-based components.
 * Provides a centralized registry for all modern (non-MST) components.
 */
export class _ZRegistry {
  private components = new Map<string, RegisteredZComponent<any, any>>();
  private stores = new Map<string, ZustandStoreMetadata & { hook: () => any }>();
  private regions: any[] = [];
  private objects: any[] = [];
  private areas = new Map<string, any[]>();
  private perRegionViews = new Map<string, Map<string, React.ComponentType>>();
  private tools = new Map<string, any>();

  // Hooks for lifecycle events
  private listeners = new Set<(event: RegistryEvent) => void>();

  /**
   * Register a Zustand-based component
   */
  registerComponent<TStore = Record<string, unknown>, TViewProps = unknown>(
    definition: ZComponentDefinition<TStore, TViewProps>,
  ): void {
    const normalizedTag = definition.tag.toLowerCase();

    // Validate
    if (this.components.has(normalizedTag)) {
      console.warn(`Component '${normalizedTag}' is already registered. Overwriting...`);
    }

    // Register component
    const registeredComponent: RegisteredZComponent<TStore, TViewProps> = {
      tag: normalizedTag,
      store: definition.store,
      view: definition.view,
      config: definition.config,
      region: definition.region,
      middleware: definition.middleware as any,
    };

    this.components.set(normalizedTag, registeredComponent as RegisteredZComponent<any, any>);

    // Register store separately
    this.stores.set(definition.store.name, definition.store);

    // Register object type if specified
    if (definition.config?.isObject) {
      this.objects.push(definition.store);
    }

    // Register region if specified
    if (definition.region) {
      this.addRegionType(definition.region, definition.store.name, definition.config?.detector);
    }

    // Emit event
    this.emit({
      type: 'component-registered',
      tag: normalizedTag,
      timestamp: Date.now(),
    });
  }

  /**
   * Register multiple components at once
   */
  registerComponents<T extends readonly ZComponentDefinition[]>(...definitions: T): void {
    for (const definition of definitions) {
      this.registerComponent(definition);
    }
  }

  /**
   * Unregister a component
   */
  unregisterComponent(tag: string): boolean {
    const normalizedTag = tag.toLowerCase();
    const removed = this.components.delete(normalizedTag);

    if (removed) {
      this.emit({
        type: 'component-unregistered',
        tag: normalizedTag,
        timestamp: Date.now(),
      });
    }

    return removed;
  }

  /**
   * Get a registered component by tag
   */
  getComponent<TStore = Record<string, unknown>, TViewProps = unknown>(
    tag: string,
  ): RegisteredZComponent<TStore, TViewProps> {
    const normalizedTag = tag.toLowerCase();
    const component = this.components.get(normalizedTag);

    if (!component) {
      const available = Array.from(this.components.keys());
      throw new Error(
        `Component '${normalizedTag}' not registered.\nAvailable: ${available.join(', ') || 'none'}`,
      );
    }

    return component as RegisteredZComponent<TStore, TViewProps>;
  }

  /**
   * Get component's React view
   */
  getComponentView(tag: string): React.ComponentType {
    return this.getComponent(tag).view;
  }

  /**
   * Get component's store hook
   */
  getComponentStore(tag: string): () => any {
    return this.getComponent(tag).store.hook;
  }

  /**
   * Check if component is registered
   */
  hasComponent(tag: string): boolean {
    return this.components.has(tag.toLowerCase());
  }

  /**
   * Get all registered components
   */
  getAllComponents(): RegisteredZComponent[] {
    return Array.from(this.components.values());
  }

  /**
   * Get component tags
   */
  getComponentTags(): string[] {
    return Array.from(this.components.keys());
  }

  /**
   * Get a store by name
   */
  getStore(name: string): ZustandStoreMetadata & { hook: () => any } {
    const store = this.stores.get(name);

    if (!store) {
      const available = Array.from(this.stores.keys());
      throw new Error(
        `Store '${name}' not registered.\nAvailable: ${available.join(', ') || 'none'}`,
      );
    }

    return store;
  }

  /**
   * Get all registered stores
   */
  getAllStores(): Array<ZustandStoreMetadata & { hook: () => any }> {
    return Array.from(this.stores.values());
  }

  /**
   * Add a region type
   */
  private addRegionType(type: any, object: string, detector?: (value: unknown) => boolean): void {
    if (detector) {
      type.detectByValue = detector;
    }

    this.regions.push(type);

    const areas = this.areas.get(object);
    if (areas) {
      areas.push(type);
    } else {
      this.areas.set(object, [type]);
    }
  }

  /**
   * Get all region types
   */
  getRegionTypes(): any[] {
    return [...this.regions];
  }

  /**
   * Get available areas for an object
   */
  getAvailableAreas(objectName: string, value?: unknown): any[] {
    const available = this.areas.get(objectName);

    if (!available) return [];

    if (value) {
      for (const model of available) {
        if (model.detectByValue && model.detectByValue(value)) {
          return [model];
        }
      }
    }

    return available.filter((a) => !a.detectByValue);
  }

  /**
   * Get all object types
   */
  getObjectTypes(): any[] {
    return [...this.objects];
  }

  /**
   * Add a per-region view
   */
  addPerRegionView(tag: string, mode: string, view: React.ComponentType): void {
    const normalizedTag = tag.toLowerCase();
    let tagViews = this.perRegionViews.get(normalizedTag);

    if (!tagViews) {
      tagViews = new Map();
      this.perRegionViews.set(normalizedTag, tagViews);
    }

    tagViews.set(mode, view);
  }

  /**
   * Get per-region view
   */
  getPerRegionView(tag: string, mode: string): React.ComponentType | undefined {
    const normalizedTag = tag.toLowerCase();
    return this.perRegionViews.get(normalizedTag)?.get(mode);
  }

  /**
   * Register a tool
   */
  registerTool(name: string, model: any): void {
    this.tools.set(name, model);
    this.emit({
      type: 'tool-registered',
      name,
      timestamp: Date.now(),
    });
  }

  /**
   * Get a tool
   */
  getTool(name: string): any {
    const tool = this.tools.get(name);

    if (!tool) {
      const available = Array.from(this.tools.keys());
      throw new Error(
        `Tool '${name}' not registered.\nAvailable: ${available.join(', ') || 'none'}`,
      );
    }

    return tool;
  }

  /**
   * Get all tools
   */
  getAllTools(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [name, tool] of this.tools) {
      result[name] = tool;
    }
    return result;
  }

  /**
   * Get registry statistics
   */
  getStats(): RegistryStats {
    return {
      totalComponents: this.components.size,
      totalStores: this.stores.size,
      components: this.getComponentTags(),
      storesInfo: Array.from(this.stores.values()).map((store) => ({
        name: store.name,
        tag: this.components.get(store.name)?.tag || 'N/A',
        description: store.description,
      })),
    };
  }

  /**
   * Clear the registry
   */
  clear(): void {
    this.components.clear();
    this.stores.clear();
    this.regions = [];
    this.objects = [];
    this.areas.clear();
    this.perRegionViews.clear();
    this.tools.clear();
    this.emit({
      type: 'registry-cleared',
      timestamp: Date.now(),
    });
  }

  /**
   * Export registry state for debugging
   */
  export(): {
    components: Array<{
      tag: string;
      store: { name: string; description?: string; version?: string };
      config?: ZComponentDefinition['config'];
      region?: ZComponentDefinition['region'];
    }>;
    stats: RegistryStats;
  } {
    return {
      components: Array.from(this.components.values()).map((c) => ({
        tag: c.tag,
        store: { name: c.store.name, description: c.store.description, version: c.store.version },
        config: c.config,
        region: c.region,
      })),
      stats: this.getStats(),
    };
  }

  // ====== EVENT SYSTEM ======

  /**
   * Subscribe to registry events
   */
  subscribe(listener: (event: RegistryEvent) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Emit a registry event
   */
  private emit(event: RegistryEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in registry listener:', error);
      }
    }
  }
}

/**
 * Registry event types
 */
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

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const ZRegistry = new _ZRegistry();

// ============================================================================
// HOOKS FOR REACT COMPONENTS
// ============================================================================

/**
 * Hook to access registry and trigger re-renders on changes
 */
export function useZRegistry(): _ZRegistry {
  const [, setTrigger] = useState({});

  useEffect(() => {
    const listener = () => setTrigger({});
    const unsubscribe = ZRegistry.subscribe(() => {
      listener();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return ZRegistry;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a batch registration helper
 */
export function createRegistrationBatch<T extends readonly ZComponentDefinition[]>(
  ...definitions: T
): { register: () => void; components: T } {
  return {
    components: definitions,
    register: () => {
      ZRegistry.registerComponents(...definitions);
    },
  };
}

/**
 * Helper to create a component definition
 */
export function defineZComponent<TStore = Record<string, unknown>, TViewProps = unknown>(
  config: ZComponentDefinition<TStore, TViewProps>,
): ZComponentDefinition<TStore, TViewProps> {
  return config;
}

export default ZRegistry;
