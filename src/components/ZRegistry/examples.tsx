/**
 * ZRegistry Usage Examples
 *
 * This file demonstrates practical usage patterns for the ZRegistry system.
 * These examples show how to register, discover, and use Zustand-based components.
 */

import React, { useEffect, useRef } from 'react';
import { ZRegistry, useZRegistry, defineZComponent, createRegistrationBatch } from '.';
import { useLabelsStore } from '../ZLabels/store';
import { ZLabels } from '../ZLabels/ZLabels';

/* ============================================================================
   EXAMPLE 1: Basic Registration
   ============================================================================ */

export function Example1_BasicRegistration() {
  useEffect(() => {
    // Register the ZLabels component
    ZRegistry.registerComponent({
      tag: 'zlabels',
      store: {
        name: 'LabelsStore',
        description: 'Zustand-based Labels control',
        version: '1.0.0',
        author: 'HumanSignal',
        hook: useLabelsStore,
      },
      view: ZLabels,
      config: {
        isObject: false,
        autoInit: true,
      },
    });

    // Cleanup: unregister on unmount
    return () => {
      ZRegistry.unregisterComponent('zlabels');
    };
  }, []);

  return <div>ZLabels registered!</div>;
}

/* ============================================================================
   EXAMPLE 2: Using Helper Function
   ============================================================================ */

export function Example2_HelperFunction() {
  useEffect(() => {
    // Define component using helper
    const zlabelsDefinition = defineZComponent({
      tag: 'zlabels',
      store: {
        name: 'LabelsStore',
        description: 'Zustand-based Labels control',
        version: '1.0.0',
        hook: useLabelsStore,
      },
      view: ZLabels,
    });

    // Register the defined component
    ZRegistry.registerComponent(zlabelsDefinition);

    return () => {
      ZRegistry.unregisterComponent('zlabels');
    };
  }, []);

  return <div>Using defineZComponent helper!</div>;
}

/* ============================================================================
   EXAMPLE 3: Batch Registration
   ============================================================================ */

// Define multiple components
const zlabelsDefinition = defineZComponent({
  tag: 'zlabels',
  store: {
    name: 'LabelsStore',
    description: 'Zustand-based Labels control',
    version: '1.0.0',
    hook: useLabelsStore as any,
  },
  view: ZLabels,
});

// For demonstration, define other components
const zButtonDefinition = defineZComponent({
  tag: 'zbutton',
  store: {
    name: 'ButtonStore',
    description: 'Button state management',
    version: '1.0.0',
    hook: (() => ({ disabled: false, loading: false })) as any,
  },
  view: () => <button>Test</button>,
});

const zInputDefinition = defineZComponent({
  tag: 'zinput',
  store: {
    name: 'InputStore',
    description: 'Input state management',
    version: '1.0.0',
    hook: (() => ({ value: '', error: null })) as any,
  },
  view: () => <input type="text" />,
});

export function Example3_BatchRegistration() {
  useEffect(() => {
    // Create batch with multiple components
    const batch = createRegistrationBatch(
      zlabelsDefinition as any,
      zButtonDefinition as any,
      zInputDefinition as any,
    );

    // Register all at once
    batch.register();

    return () => {
      // Cleanup
      ZRegistry.unregisterComponent('zlabels');
      ZRegistry.unregisterComponent('zbutton');
      ZRegistry.unregisterComponent('zinput');
    };
  }, []);

  return <div>Batch registered 3 components!</div>;
}

/* ============================================================================
   EXAMPLE 4: Retrieving Components
   ============================================================================ */

export function Example4_RetrievingComponents() {
  useEffect(() => {
    ZRegistry.registerComponent(zlabelsDefinition);
  }, []);

  // Get just the component view
  const Component = ZRegistry.getComponentView('zlabels');

  // Get just the store hook
  const useStore = ZRegistry.getComponentStore('zlabels');

  // Check if component exists
  if (!ZRegistry.hasComponent('zlabels')) {
    return <div>Component not found!</div>;
  }

  // Get full component definition
  const fullComponent = ZRegistry.getComponent('zlabels');

  return (
    <div>
      <h3>Component: {fullComponent.tag}</h3>
      <p>Store: {fullComponent.store.name}</p>
      <Component />
    </div>
  );
}

/* ============================================================================
   EXAMPLE 5: React Hook Integration
   ============================================================================ */

export function Example5_ReactHookIntegration() {
  // Register on mount
  useEffect(() => {
    ZRegistry.registerComponent(zlabelsDefinition);
  }, []);

  // Use the useZRegistry hook to get reactive registry
  const registry = useZRegistry();

  // This component will re-render whenever registry changes
  return (
    <div>
      <h3>Registered Components</h3>
      <ul>
        {registry.getComponentTags().map((tag) => (
          <li key={tag}>
            <strong>{tag}</strong>
          </li>
        ))}
      </ul>
      <p>Total: {registry.getComponentTags().length}</p>
    </div>
  );
}

/* ============================================================================
   EXAMPLE 6: Query and Statistics
   ============================================================================ */

export function Example6_QueryAndStats() {
  useEffect(() => {
    // Register multiple components
    ZRegistry.registerComponents(
      zlabelsDefinition as any,
      zButtonDefinition as any,
      zInputDefinition as any,
    );
  }, []);

  const handlePrintStats = () => {
    // Get statistics
    const stats = ZRegistry.getStats();

    console.log('=== Registry Statistics ===');
    console.log(`Total Components: ${stats.totalComponents}`);
    console.log(`Total Stores: ${stats.totalStores}`);
    console.log('Components:', stats.components);
    console.log('Stores Info:');
    stats.storesInfo.forEach((store) => {
      console.log(`  - ${store.name}`);
    });
  };

  const handleListComponents = () => {
    // Get all registered components
    const allComponents = ZRegistry.getAllComponents();

    console.log('All registered components:');
    allComponents.forEach((component) => {
      console.log(`  Tag: ${component.tag}`);
      console.log(`  Store: ${component.store.name}`);
    });
  };

  const handleListTags = () => {
    // Get just the tags
    const tags = ZRegistry.getComponentTags();
    console.log('Component tags:', tags);
  };

  return (
    <div>
      <h3>Registry Query Examples</h3>
      <button onClick={handlePrintStats}>Print Statistics</button>
      <button onClick={handleListComponents}>List All Components</button>
      <button onClick={handleListTags}>List Tags Only</button>
    </div>
  );
}

/* ============================================================================
   EXAMPLE 7: Event Subscription
   ============================================================================ */

export function Example7_EventSubscription() {
  const [events, setEvents] = React.useState<Array<{ type: string; timestamp: number }>>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Subscribe to registry events
    unsubscribeRef.current = ZRegistry.subscribe((event) => {
      console.log('[ZRegistry Event]', event);
      setEvents((prev) => [{ type: event.type, timestamp: event.timestamp }, ...prev]);
    });

    // Register a component to trigger events
    ZRegistry.registerComponent(zlabelsDefinition);

    // Cleanup
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      ZRegistry.unregisterComponent('zlabels');
    };
  }, []);

  return (
    <div>
      <h3>Registry Events</h3>
      <ul>
        {events.slice(0, 10).map((event, idx) => (
          <li key={idx}>
            <strong>{event.type}</strong> - {new Date(event.timestamp).toISOString()}
          </li>
        ))}
      </ul>
      <p>Total events: {events.length}</p>
    </div>
  );
}

/* ============================================================================
   EXAMPLE 8: Debugging Registry State
   ============================================================================ */

export function Example8_DebuggingRegistry() {
  useEffect(() => {
    // Register some components
    ZRegistry.registerComponents(zlabelsDefinition as any, zButtonDefinition as any);
  }, []);

  const handleExportState = () => {
    // Export registry state for debugging
    const exported = ZRegistry.export();

    console.log('=== Registry State Export ===');
    console.log(JSON.stringify(exported, null, 2));

    // Print to page as well
    alert(`Registry export:\n${JSON.stringify(exported.stats, null, 2)}`);
  };

  const handleClearRegistry = () => {
    // Clear all registrations
    ZRegistry.clear();
    console.log('Registry cleared!');
  };

  return (
    <div>
      <h3>Registry Debugging</h3>
      <button onClick={handleExportState}>Export Registry State</button>
      <button onClick={handleClearRegistry}>Clear Registry</button>
      <p>Check console for detailed output</p>
    </div>
  );
}

/* ============================================================================
   EXAMPLE 9: Store Access and Management
   ============================================================================ */

export function Example9_StoreAccess() {
  useEffect(() => {
    ZRegistry.registerComponent(zlabelsDefinition);
  }, []);

  const handleGetStore = () => {
    // Get store by name
    const store = ZRegistry.getStore('LabelsStore');
    console.log('Store metadata:', store);

    // Get the Zustand hook
    if (store && 'hook' in store) {
      const useStore = store.hook;
      const state = useStore();
      console.log('Current store state:', state);
    }
  };

  const handleListAllStores = () => {
    // Get all stores
    const allStores = ZRegistry.getAllStores();
    console.log('All stores:', allStores);
  };

  return (
    <div>
      <h3>Store Management</h3>
      <button onClick={handleGetStore}>Get Single Store</button>
      <button onClick={handleListAllStores}>List All Stores</button>
      <p>Check console for store information</p>
    </div>
  );
}

/* ============================================================================
   EXAMPLE 10: Tool Registration
   ============================================================================ */

// Define some tools/utilities
const annotationTool = {
  name: 'AnnotationTool',
  version: '1.0.0',
  annotate: (data: any) => {
    console.log('Annotating:', data);
  },
};

const validationTool = {
  name: 'ValidationTool',
  version: '1.0.0',
  validate: (data: any) => {
    console.log('Validating:', data);
    return true;
  },
};

export function Example10_ToolRegistration() {
  useEffect(() => {
    // Register tools
    ZRegistry.registerTool('annotation', annotationTool);
    ZRegistry.registerTool('validation', validationTool);

    return () => {
      // Tools can be unregistered if needed
    };
  }, []);

  const handleUseTool = (toolName: string) => {
    // Get a tool
    const tool = ZRegistry.getTool(toolName);
    console.log(`Using tool: ${toolName}`, tool);

    if (toolName === 'annotation') {
      tool.annotate({ text: 'Sample annotation' });
    } else if (toolName === 'validation') {
      tool.validate({ text: 'Sample validation' });
    }
  };

  const handleListTools = () => {
    // Get all tools
    const allTools = ZRegistry.getAllTools();
    console.log('All registered tools:', allTools);
  };

  return (
    <div>
      <h3>Tool Management</h3>
      <button onClick={() => handleUseTool('annotation')}>Use Annotation Tool</button>
      <button onClick={() => handleUseTool('validation')}>Use Validation Tool</button>
      <button onClick={handleListTools}>List All Tools</button>
      <p>Check console for tool output</p>
    </div>
  );
}

/* ============================================================================
   EXAMPLE 11: Per-Region Views
   ============================================================================ */

// Define different views for different regions
const RegionAView = () => <div>Region A View</div>;
const RegionBView = () => <div>Region B View</div>;
const RegionCView = () => <div>Region C View</div>;

export function Example11_PerRegionViews() {
  useEffect(() => {
    // Register component
    ZRegistry.registerComponent(zlabelsDefinition);

    // Add per-region views
    ZRegistry.addPerRegionView('zlabels', 'region-a', RegionAView);
    ZRegistry.addPerRegionView('zlabels', 'region-b', RegionBView);
    ZRegistry.addPerRegionView('zlabels', 'region-c', RegionCView);
  }, []);

  const [selectedRegion, setSelectedRegion] = React.useState<string>('region-a');

  const view = ZRegistry.getPerRegionView('zlabels', selectedRegion);

  return (
    <div>
      <h3>Per-Region Views</h3>
      <div>
        <button onClick={() => setSelectedRegion('region-a')}>Region A</button>
        <button onClick={() => setSelectedRegion('region-b')}>Region B</button>
        <button onClick={() => setSelectedRegion('region-c')}>Region C</button>
      </div>
      {view ? <div>{React.createElement(view)}</div> : <p>No view for region</p>}
    </div>
  );
}

/* ============================================================================
   EXAMPLE 12: Complete Application Example
   ============================================================================ */

export function Example12_CompleteApplication() {
  const registry = useZRegistry();
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);

  // Initialize registry on mount
  useEffect(() => {
    ZRegistry.registerComponents(
      zlabelsDefinition as any,
      zButtonDefinition as any,
      zInputDefinition as any,
    );

    // Subscribe to events
    const unsubscribe = ZRegistry.subscribe((event) => {
      console.log('[App] Registry updated:', event.type);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const stats = registry.getStats();

  return (
    <div style={{ padding: '20px' }}>
      <h1>ZRegistry Application</h1>

      <section>
        <h2>Statistics</h2>
        <p>Total Components: {stats.totalComponents}</p>
        <p>Total Stores: {stats.totalStores}</p>
      </section>

      <section>
        <h2>Available Components</h2>
        <ul>
          {registry.getComponentTags().map((tag) => (
            <li key={tag}>
              <button
                onClick={() => setSelectedComponent(tag)}
                style={{
                  fontWeight: selectedComponent === tag ? 'bold' : 'normal',
                  backgroundColor: selectedComponent === tag ? '#007bff' : '#f0f0f0',
                  color: selectedComponent === tag ? 'white' : 'black',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {selectedComponent && (
        <section>
          <h2>Component Details: {selectedComponent}</h2>
          <div
            style={{
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
            }}
          >
            <pre>
              {JSON.stringify(
                {
                  tag: selectedComponent,
                  store: registry.getComponent(selectedComponent).store.name,
                  hasView: !!registry.getComponentView(selectedComponent),
                },
                null,
                2,
              )}
            </pre>
          </div>
        </section>
      )}
    </div>
  );
}
