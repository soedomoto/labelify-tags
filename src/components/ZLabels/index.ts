/**
 * ZLabels - Zustand-based Labels Control Tag
 *
 * Pure React implementation with NO MST or MobX dependencies
 */

export { ZLabels, type ZLabelsProps } from './ZLabels';
export {
  useLabelsStore,
  useLabelsActions,
  useLabelsSelectors,
  type LabelItem,
  type LabelsStoreState,
} from './store';
