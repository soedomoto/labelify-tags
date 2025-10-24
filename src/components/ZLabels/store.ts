/**
 * Zustand Store for Labels Tag
 * Complete replacement for MST-based Labels with pure state management
 *
 * No MST or MobX - pure Zustand for state management
 */

import { create } from 'zustand';
import { produce } from 'immer';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface LabelItem {
  id: string;
  type: 'label';
  value: string | null;
  alias?: string | null;
  hint?: string | null;
  hotkey?: string | null;
  showalias?: boolean;
  aliasstyle?: string;
  size?: string;
  background?: string;
  selectedcolor?: string;
  granularity?: 'symbol' | 'word' | 'sentence' | 'paragraph' | null;
  groupcancontain?: string | null;
  html?: string | null;
  selected?: boolean;
  visible?: boolean;
  isEmpty?: boolean;
  maxusages?: string | null;
}

export interface LabelsStoreState {
  // Identity
  id: string;
  name: string;
  pid: string;

  // Configuration
  toname: string | null;
  choice: 'single' | 'multiple';
  visible: boolean;
  showinline: boolean;
  maxusages: string | null;
  allowempty: boolean;

  // Styling & Display
  opacity: string;
  fillcolor: string;
  strokewidth: string;
  strokecolor: string;
  fillopacity: string | null;

  // Dynamic data
  value: string;
  groupdepth: string | null;

  // State
  children: LabelItem[];
  selectedLabelIds: Set<string>;

  // ====== SELECTION ACTIONS ======
  selectLabel: (labelId: string, multiSelect?: boolean) => void;
  deselectLabel: (labelId: string) => void;
  unselectAll: () => void;
  toggleLabelSelection: (labelId: string) => void;

  // ====== LABEL MANAGEMENT ======
  addLabel: (label: Omit<LabelItem, 'id' | 'type'>) => void;
  updateLabel: (labelId: string, updates: Partial<LabelItem>) => void;
  removeLabel: (labelId: string) => void;
  setLabels: (labels: LabelItem[]) => void;

  // ====== DYNAMIC LABELS ======
  loadDynamicLabels: (data: Record<string, unknown>[]) => void;

  // ====== QUERIES ======
  getSelectedLabels: () => LabelItem[];
  getSelectedValues: () => (string | null)[];
  getSelectedAliases: () => (string | null)[];
  getSelectedString: (joinStr?: string) => string;
  findLabel: (value: string | null) => LabelItem | undefined;

  // ====== INITIALIZATION ======
  initialize: (config: Partial<LabelsStoreState>) => void;
  reset: () => void;

  // ====== COMPUTED (as functions) ======
  isSelected: () => boolean;
  selectedColor: () => string | undefined;
  shouldBeUnselected: () => boolean;
  holdsState: () => boolean;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const createInitialState = (): Omit<
  LabelsStoreState,
  | 'selectLabel'
  | 'deselectLabel'
  | 'unselectAll'
  | 'toggleLabelSelection'
  | 'addLabel'
  | 'updateLabel'
  | 'removeLabel'
  | 'setLabels'
  | 'loadDynamicLabels'
  | 'getSelectedLabels'
  | 'getSelectedValues'
  | 'getSelectedAliases'
  | 'getSelectedString'
  | 'findLabel'
  | 'initialize'
  | 'reset'
  | 'isSelected'
  | 'selectedColor'
  | 'shouldBeUnselected'
  | 'holdsState'
> => ({
  id: '',
  name: '',
  pid: '',
  toname: null,
  choice: 'single',
  visible: true,
  showinline: true,
  maxusages: null,
  allowempty: false,
  opacity: '0.2',
  fillcolor: '#f48a42',
  strokewidth: '1',
  strokecolor: '#f48a42',
  fillopacity: null,
  value: '',
  groupdepth: null,
  children: [],
  selectedLabelIds: new Set<string>(),
});

// ============================================================================
// STORE CREATION
// ============================================================================

export const useLabelsStore = create<LabelsStoreState>((set, get) => ({
  ...createInitialState(),

  // ====== SELECTION ACTIONS ======

  selectLabel: (labelId: string, multiSelect = false) => {
    set((state) =>
      produce(state, (draft) => {
        if (draft.choice === 'single' && !multiSelect) {
          draft.selectedLabelIds.clear();
          draft.selectedLabelIds.add(labelId);
        } else {
          draft.selectedLabelIds.add(labelId);
        }

        const label = draft.children.find((l) => l.id === labelId);
        if (label) {
          label.selected = true;
        }
      }),
    );
  },

  deselectLabel: (labelId: string) => {
    set((state) =>
      produce(state, (draft) => {
        draft.selectedLabelIds.delete(labelId);

        const label = draft.children.find((l) => l.id === labelId);
        if (label) {
          label.selected = false;
        }
      }),
    );
  },

  unselectAll: () => {
    set((state) =>
      produce(state, (draft) => {
        draft.selectedLabelIds.clear();
        draft.children.forEach((label) => {
          label.selected = false;
        });
      }),
    );
  },

  toggleLabelSelection: (labelId: string) => {
    const state = get();
    if (state.selectedLabelIds.has(labelId)) {
      state.deselectLabel(labelId);
    } else {
      state.selectLabel(labelId, state.choice === 'multiple');
    }
  },

  // ====== LABEL MANAGEMENT ======

  addLabel: (label: Omit<LabelItem, 'id' | 'type'>) => {
    set((state) =>
      produce(state, (draft) => {
        const id = `label-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        draft.children.push({
          ...label,
          id,
          type: 'label',
          selected: false,
          visible: label.visible ?? true,
        } as LabelItem);
      }),
    );
  },

  updateLabel: (labelId: string, updates: Partial<LabelItem>) => {
    set((state) =>
      produce(state, (draft) => {
        const label = draft.children.find((l) => l.id === labelId);
        if (label) {
          Object.assign(label, updates);
        }
      }),
    );
  },

  removeLabel: (labelId: string) => {
    set((state) =>
      produce(state, (draft) => {
        draft.children = draft.children.filter((l) => l.id !== labelId);
        draft.selectedLabelIds.delete(labelId);
      }),
    );
  },

  setLabels: (labels: LabelItem[]) => {
    set((state) =>
      produce(state, (draft) => {
        draft.children = labels;
      }),
    );
  },

  // ====== DYNAMIC LABELS ======

  loadDynamicLabels: (data: Record<string, unknown>[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      return;
    }

    set((state) =>
      produce(state, (draft) => {
        draft.children = data.map((obj, idx) => ({
          id: (obj.id as string | undefined) ?? `label-${idx}`,
          type: 'label' as const,
          value: (obj.value as string | null | undefined) ?? null,
          alias: (obj.alias as string | null | undefined) ?? null,
          hint: (obj.hint as string | null | undefined) ?? null,
          hotkey: (obj.hotkey as string | null | undefined) ?? null,
          showalias: (obj.showalias as boolean | undefined) ?? false,
          aliasstyle: (obj.aliasstyle as string | undefined) ?? 'opacity: 0.6',
          size: (obj.size as string | undefined) ?? 'medium',
          background: (obj.background as string | undefined) ?? '#36B37E',
          selectedcolor: (obj.selectedcolor as string | undefined) ?? '#ffffff',
          granularity: (obj.granularity as 'symbol' | 'word' | 'sentence' | 'paragraph' | null | undefined) ?? null,
          groupcancontain: (obj.groupcancontain as string | null | undefined) ?? null,
          html: (obj.html as string | null | undefined) ?? null,
          selected: (obj.selected as boolean | undefined) ?? false,
          visible: (obj.visible as boolean | undefined) ?? true,
          isEmpty: (obj.isEmpty as boolean | undefined) ?? false,
          maxusages: (obj.maxusages as string | null | undefined) ?? null,
        }));
      }),
    );
  },

  // ====== QUERIES ======

  getSelectedLabels: () => {
    const state = get();
    return state.children.filter((label) => state.selectedLabelIds.has(label.id));
  },

  getSelectedValues: () => {
    const state = get();
    return state
      .getSelectedLabels()
      .map((label) => {
        if (label.alias) {
          return label.alias;
        }
        return label.value;
      })
      .filter((val): val is string | null => val !== undefined);
  },

  getSelectedAliases: () => {
    const state = get();
    return state
      .getSelectedLabels()
      .filter((label) => label.alias)
      .map((label) => label.alias as string | null);
  },

  getSelectedString: (joinStr = ' ') => {
    const state = get();
    return state.getSelectedValues().join(joinStr);
  },

  findLabel: (value: string | null) => {
    const state = get();
    return state.children.find(
      (label) =>
        (label.alias === value && value !== null && value !== undefined) ||
        label.value === value ||
        (label.value === null && value === null),
    );
  },

  // ====== INITIALIZATION ======

  initialize: (config: Partial<LabelsStoreState>) => {
    set(
      produce((draft) => {
        Object.assign(draft, {
          ...createInitialState(),
          selectedLabelIds: new Set<string>(),
          ...config,
        });
      }),
    );
  },

  reset: () => {
    set(() => ({
      ...createInitialState(),
      selectedLabelIds: new Set<string>(),
    }));
  },

  // ====== COMPUTED (as functions) ======

  isSelected: () => {
    return get().selectedLabelIds.size > 0;
  },

  selectedColor: () => {
    const state = get();
    const selected = state.children.find((label) => state.selectedLabelIds.has(label.id));
    return selected?.background;
  },

  shouldBeUnselected: () => {
    return get().choice === 'single';
  },

  holdsState: () => {
    return get().selectedLabelIds.size > 0;
  },
}));

// ============================================================================
// EXPORT HELPERS
// ============================================================================

export const useLabelsActions = () => {
  const store = useLabelsStore();
  return {
    selectLabel: store.selectLabel,
    deselectLabel: store.deselectLabel,
    unselectAll: store.unselectAll,
    toggleLabelSelection: store.toggleLabelSelection,
    addLabel: store.addLabel,
    updateLabel: store.updateLabel,
    removeLabel: store.removeLabel,
    setLabels: store.setLabels,
    loadDynamicLabels: store.loadDynamicLabels,
    initialize: store.initialize,
    reset: store.reset,
  };
};

export const useLabelsSelectors = () => {
  const store = useLabelsStore();
  return {
    getSelectedLabels: store.getSelectedLabels,
    getSelectedValues: store.getSelectedValues,
    getSelectedAliases: store.getSelectedAliases,
    getSelectedString: store.getSelectedString,
    findLabel: store.findLabel,
  };
};
