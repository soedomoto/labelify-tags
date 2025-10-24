/**
 * Pure React Component for Labels Tag
 * No MST, MobX, or observer - just plain React with Zustand hooks
 */

import React, { useEffect, useCallback } from 'react';
import { useLabelsStore, type LabelItem } from './store';

/**
 * Props for the ZLabels component
 */
export interface ZLabelsProps {
  /** Unique identifier for this labels instance */
  id: string;

  /** Name of the tag */
  name: string;

  /** Parent identifier */
  pid: string;

  /** Name of the target to annotate */
  toname: string | null;

  /** Selection mode: single or multiple choices allowed */
  choice?: 'single' | 'multiple';

  /** Visibility flag */
  visible?: boolean;

  /** Show inline flag */
  showinline?: boolean;

  /** Maximum usages per label */
  maxusages?: string | null;

  /** Allow empty selection */
  allowempty?: boolean;

  /** Opacity for rendering */
  opacity?: string;

  /** Fill color */
  fillcolor?: string;

  /** Stroke width */
  strokewidth?: string;

  /** Stroke color */
  strokecolor?: string;

  /** Fill opacity */
  fillopacity?: string | null;

  /** Path to dynamic labels in task data */
  value?: string;

  /** Group depth for nested labels */
  groupdepth?: string | null;

  /** Static label items */
  labels?: LabelItem[];

  /** Callback when selection changes */
  onSelectionChange?: (selectedValues: (string | null)[]) => void;

  /** CSS class name */
  className?: string;
}

/**
 * ZLabels Component
 *
 * Pure React implementation of the Labels control tag.
 * Manages label selection state using Zustand store and Immer for mutations.
 *
 * @example
 * ```tsx
 * <ZLabels
 *   id="labels-1"
 *   name="sentiment"
 *   pid="view-1"
 *   toname="text"
 *   choice="single"
 *   labels={[
 *     { id: 'l1', type: 'label', value: 'positive', background: '#2ECC71' },
 *     { id: 'l2', type: 'label', value: 'negative', background: '#E74C3C' },
 *   ]}
 * />
 * ```
 */
export const ZLabels = React.memo<ZLabelsProps>(
  ({
    id,
    name,
    pid,
    toname,
    choice = 'single',
    visible = true,
    showinline = true,
    maxusages = null,
    allowempty = false,
    opacity = '0.2',
    fillcolor = '#f48a42',
    strokewidth = '1',
    strokecolor = '#f48a42',
    fillopacity = null,
    value = '',
    groupdepth = null,
    labels = [],
    onSelectionChange,
    className = '',
  }) => {
    const { store, selectedLabelIds, children } = useLabelsStore((state) => ({
      store: state,
      selectedLabelIds: state.selectedLabelIds,
      children: state.children,
    }));

    // Initialize store on mount with provided config
    useEffect(() => {
      store.initialize({
        id,
        name,
        pid,
        toname,
        choice,
        visible,
        showinline,
        maxusages,
        allowempty,
        opacity,
        fillcolor,
        strokewidth,
        strokecolor,
        fillopacity,
        value,
        groupdepth,
      });
    }, [
      store,
      id,
      name,
      pid,
      toname,
      choice,
      visible,
      showinline,
      maxusages,
      allowempty,
      opacity,
      fillcolor,
      strokewidth,
      strokecolor,
      fillopacity,
      value,
      groupdepth,
    ]);

    // Load static or dynamic labels
    useEffect(() => {
      if (labels && labels.length > 0) {
        store.setLabels(labels);
      }
    }, [store, labels]);

    // Notify parent when selection changes
    useEffect(() => {
      if (onSelectionChange) {
        const selectedValues = store.getSelectedValues();
        onSelectionChange(selectedValues);
      }
    }, [onSelectionChange, selectedLabelIds, store]);

    // Handle label selection
    const handleSelectLabel = useCallback(
      (labelId: string, e?: React.MouseEvent) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        if (choice === 'single') {
          store.selectLabel(labelId, false);
        } else {
          store.toggleLabelSelection(labelId);
        }
      },
      [choice, store],
    );

    if (!visible) {
      return null;
    }

    const selectedValues = store.getSelectedValues();

    return (
      <div
        className={`zlabels-container ${className} ${showinline ? 'zlabels--inline' : ''}`}
        data-id={id}
        data-name={name}
      >
        <div className="zlabels-content">
          {children.map((label) => {
            const isSelected = selectedLabelIds.has(label.id);
            return (
              <button
                key={label.id}
                className={`zlabels-label ${isSelected ? 'zlabels-label--selected' : ''}`}
                onClick={(e) => handleSelectLabel(label.id, e)}
                style={{
                  backgroundColor: isSelected ? label.background : 'transparent',
                  borderColor: label.background,
                  color: isSelected ? 'white' : label.background,
                  borderWidth: `${strokewidth}px`,
                  opacity: isSelected ? '1' : opacity,
                }}
                title={label.hint || label.value || ''}
                disabled={label.isEmpty}
              >
                {label.alias || label.value || 'Label'}
              </button>
            );
          })}
        </div>

        {selectedValues.length > 0 && (
          <div className="zlabels-selected">
            <small>Selected: {selectedValues.join(', ')}</small>
          </div>
        )}
      </div>
    );
  },
);

ZLabels.displayName = 'ZLabels';
