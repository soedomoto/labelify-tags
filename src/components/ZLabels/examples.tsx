/**
 * ZLabels Examples & Usage Patterns
 *
 * Complete examples demonstrating how to use the ZLabels component
 * and its Zustand store in real-world scenarios.
 */

// ============================================================================
// EXAMPLE 1: Basic Single-Choice Labels
// ============================================================================

import React from 'react';
import { ZLabels } from './';

export function SentimentLabels() {
  return (
    <ZLabels
      id="sentiment-labels"
      name="sentiment"
      pid="view-sentiment"
      toname="text"
      choice="single"
      labels={[
        {
          id: 'positive',
          type: 'label',
          value: 'positive',
          alias: '👍 Positive',
          background: '#2ECC71',
          selectedcolor: '#ffffff',
        },
        {
          id: 'neutral',
          type: 'label',
          value: 'neutral',
          alias: '😐 Neutral',
          background: '#F39C12',
          selectedcolor: '#ffffff',
        },
        {
          id: 'negative',
          type: 'label',
          value: 'negative',
          alias: '👎 Negative',
          background: '#E74C3C',
          selectedcolor: '#ffffff',
        },
      ]}
    />
  );
}

// ============================================================================
// EXAMPLE 2: Multiple Choice with Callback
// ============================================================================

export function MultiTagLabels() {
  const handleTagChange = (selectedValues: (string | null)[]) => {
    console.log('Selected tags:', selectedValues);
    // Send to parent or update store
  };

  return (
    <ZLabels
      id="tags"
      name="categories"
      pid="view-tags"
      toname="content"
      choice="multiple"
      visible={true}
      showinline={true}
      labels={[
        {
          id: 'tag-1',
          type: 'label',
          value: 'bug',
          background: '#E74C3C',
        },
        {
          id: 'tag-2',
          type: 'label',
          value: 'feature',
          background: '#3498DB',
        },
        {
          id: 'tag-3',
          type: 'label',
          value: 'documentation',
          background: '#9B59B6',
        },
        {
          id: 'tag-4',
          type: 'label',
          value: 'enhancement',
          background: '#1ABC9C',
        },
      ]}
      onSelectionChange={handleTagChange}
    />
  );
}

// ============================================================================
// EXAMPLE 3: Using the Store Directly
// ============================================================================

import { useLabelsStore, useLabelsActions, useLabelsSelectors } from './';

export function StoreDirectUsageExample() {
  // Access the full store
  const fullStore = useLabelsStore();

  // Or get just the actions and selectors you need
  const actions = useLabelsActions();
  const selectors = useLabelsSelectors();

  const handleSelectClick = (labelId: string) => {
    actions.selectLabel(labelId, false); // single choice
  };

  const handleMultiSelectClick = (labelId: string) => {
    if (fullStore.selectedLabelIds.has(labelId)) {
      actions.deselectLabel(labelId);
    } else {
      actions.selectLabel(labelId, true); // allow multiple
    }
  };

  const handleUnselectAll = () => {
    actions.unselectAll();
  };

  const getSelectedSummary = () => {
    const selected = selectors.getSelectedLabels();
    const values = selectors.getSelectedValues();
    const string = selectors.getSelectedString(', ');

    return {
      count: selected.length,
      values,
      string,
    };
  };

  return (
    <div>
      <button onClick={() => handleSelectClick('label-1')}>Select Label 1</button>
      <button onClick={() => handleMultiSelectClick('label-2')}>
        Toggle Label 2
      </button>
      <button onClick={handleUnselectAll}>Clear All</button>

      <div>
        <h3>Summary</h3>
        <pre>{JSON.stringify(getSelectedSummary(), null, 2)}</pre>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Dynamic Labels from Data
// ============================================================================

interface TaskData {
  text: string;
  possibleLabels?: Array<{
    id: string;
    value: string;
    alias?: string;
  }>;
}

export function DynamicLabelsExample({ task }: { task: TaskData }) {
  const store = useLabelsStore();

  React.useEffect(() => {
    // Load dynamic labels from task data
    if (task.possibleLabels) {
      const dynamicLabels = task.possibleLabels.map((label, idx) => ({
        id: label.id || `label-${idx}`,
        type: 'label' as const,
        value: label.value,
        alias: label.alias,
        background: '#3498DB',
        selectedcolor: '#ffffff',
        selected: false,
        visible: true,
      }));

      store.loadDynamicLabels(dynamicLabels);
    }
  }, [task.possibleLabels, store]);

  return (
    <ZLabels
      id="dynamic-labels"
      name="labels"
      pid="view-1"
      toname="text"
      choice="multiple"
      visible={true}
    />
  );
}

// ============================================================================
// EXAMPLE 5: Controlled Component with External State
// ============================================================================

export function ControlledLabelsComponent() {
  const [externalSelection, setExternalSelection] = React.useState<string[]>([]);
  const store = useLabelsStore();

  // Initialize store
  React.useEffect(() => {
    store.initialize({
      id: 'controlled-labels',
      name: 'labels',
      pid: 'p1',
      toname: 'text',
      choice: 'multiple',
    });

    store.setLabels([
      {
        id: 'l1',
        type: 'label',
        value: 'option-a',
        alias: 'Option A',
        background: '#3498DB',
        selected: false,
        visible: true,
      },
      {
        id: 'l2',
        type: 'label',
        value: 'option-b',
        alias: 'Option B',
        background: '#E74C3C',
        selected: false,
        visible: true,
      },
    ]);
  }, [store]);

  const handleSelection = (values: (string | null)[]) => {
    setExternalSelection(values as string[]);
  };

  return (
    <div>
      <ZLabels
        id="controlled-labels"
        name="labels"
        pid="p1"
        toname="text"
        choice="multiple"
        onSelectionChange={handleSelection}
      />
      <p>External state: {JSON.stringify(externalSelection)}</p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: With Form Integration
// ============================================================================

export interface LabelFormData {
  sentiment: string | null;
  tags: string[];
  confidence?: number;
}

export function LabelForm() {
  const [formData, setFormData] = React.useState<LabelFormData>({
    sentiment: null,
    tags: [],
  });

  const sentimentStore = useLabelsStore();
  const tagsStore = useLabelsStore();

  // Separate stores for different label groups
  const handleSentimentChange = (values: (string | null)[]) => {
    setFormData((prev) => ({
      ...prev,
      sentiment: values[0] || null,
    }));
  };

  const handleTagsChange = (values: (string | null)[]) => {
    setFormData((prev) => ({
      ...prev,
      tags: values as string[],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Send to backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Sentiment (Single Choice)</legend>
        <ZLabels
          id="sentiment"
          name="sentiment"
          pid="form-p1"
          toname="text"
          choice="single"
          onSelectionChange={handleSentimentChange}
          labels={[
            {
              id: 'pos',
              type: 'label',
              value: 'positive',
              background: '#2ECC71',
            },
            {
              id: 'neg',
              type: 'label',
              value: 'negative',
              background: '#E74C3C',
            },
          ]}
        />
      </fieldset>

      <fieldset>
        <legend>Tags (Multiple Choice)</legend>
        <ZLabels
          id="tags"
          name="tags"
          pid="form-p2"
          toname="text"
          choice="multiple"
          onSelectionChange={handleTagsChange}
          labels={[
            {
              id: 'tag-1',
              type: 'label',
              value: 'urgent',
              background: '#E74C3C',
            },
            {
              id: 'tag-2',
              type: 'label',
              value: 'important',
              background: '#F39C12',
            },
          ]}
        />
      </fieldset>

      <button type="submit">Submit</button>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </form>
  );
}

// ============================================================================
// EXAMPLE 7: Styling Customization
// ============================================================================

export function StyledLabels() {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#f5f5f5' }}>
      <ZLabels
        id="styled"
        name="styled"
        pid="p1"
        toname="text"
        choice="multiple"
        className="my-custom-labels"
        opacity="0.5"
        fillcolor="#9B59B6"
        strokecolor="#8E44AD"
        strokewidth="2"
        labels={[
          {
            id: 'l1',
            type: 'label',
            value: 'high-priority',
            alias: '🔴 High',
            background: '#C0392B',
            selectedcolor: '#ECF0F1',
          },
          {
            id: 'l2',
            type: 'label',
            value: 'medium-priority',
            alias: '🟡 Medium',
            background: '#E67E22',
            selectedcolor: '#ECF0F1',
          },
          {
            id: 'l3',
            type: 'label',
            value: 'low-priority',
            alias: '🟢 Low',
            background: '#27AE60',
            selectedcolor: '#ECF0F1',
          },
        ]}
      />
      <style>{`
        .my-custom-labels {
          border: 2px dashed #9B59B6;
          border-radius: 8px;
          padding: 1rem;
          background: white;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// EXAMPLE 8: Advanced Store Operations
// ============================================================================

export function AdvancedStoreOps() {
  const store = useLabelsStore();
  const actions = useLabelsActions();
  const selectors = useLabelsSelectors();

  // Add a new label dynamically
  const addLabelDynamically = () => {
    actions.addLabel({
      value: `label-${Date.now()}`,
      alias: 'New Label',
      background: '#3498DB',
      selectedcolor: '#ffffff',
      visible: true,
    });
  };

  // Update an existing label
  const updateLabelColor = (labelId: string, newColor: string) => {
    actions.updateLabel(labelId, {
      background: newColor,
    });
  };

  // Remove a label
  const removeLabel = (labelId: string) => {
    actions.removeLabel(labelId);
  };

  // Find a label by value
  const findByValue = (value: string) => {
    const found = selectors.findLabel(value);
    console.log('Found:', found);
  };

  // Get selection info
  const getInfo = () => {
    return {
      labels: store.children,
      selected: selectors.getSelectedLabels(),
      values: selectors.getSelectedValues(),
      string: selectors.getSelectedString('; '),
      isSelected: store.isSelected(),
      selectedColor: store.selectedColor(),
    };
  };

  return (
    <div>
      <button onClick={addLabelDynamically}>Add Label</button>
      <button onClick={() => actions.unselectAll()}>Clear Selection</button>
      <button onClick={() => console.log(getInfo())}>Log Info</button>
    </div>
  );
}
