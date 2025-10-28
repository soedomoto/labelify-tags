import { BaseControlProps, BaseControlState } from "../Registry";

// name	string		Name of the group of choices
// toName	string		Name of the data item that you want to label
// [choice]	single | single-radio | multiple	single	Single or multi-class classification
// [showInline]	boolean	false	Show choices in the same visual line
// [required]	boolean	false	Validate whether a choice has been selected
// [requiredMessage]	string		Show a message if validation fails
// [visibleWhen]	region-selected | no-region-selected | choice-selected | choice-unselected		Control visibility of the choices. Can also be used with the when* parameters below to narrow down visibility
// [whenTagName]	string		Use with visibleWhen. Narrow down visibility by name of the tag. For regions, use the name of the object tag, for choices, use the name of the choices tag
// [whenLabelValue]	string		Use with visibleWhen="region-selected". Narrow down visibility by label value. Multiple values can be separated with commas
// [whenChoiceValue]	string		Use with visibleWhen ("choice-selected" or "choice-unselected") and whenTagName, both are required. Narrow down visibility by choice value. Multiple values can be separated with commas
// [perRegion]	boolean		Use this tag to select a choice for a specific region instead of the entire task
// [perItem]	boolean		Use this tag to select a choice for a specific item inside the object instead of the whole object
// [value]	string		Task data field containing a list of dynamically loaded choices (see example below)
// [allowNested]	boolean		Allow to use children field in dynamic choices to nest them. Submitted result will contain array of arrays, every item is a list of values from topmost parent choice down to selected one.
// [layout]	select | inline | vertical		Layout of the choices: select for dropdown/select box format, inline for horizontal single row display, vertical for vertically stacked display (default)

export interface ChoicesProps extends BaseControlProps {
  choice?: 'single' | 'multiple';
  showInLine?: 'true' | 'false';
  required?: 'true' | 'false';
  requiredMessage?: string;
  visibleWhen?: 'region-selected' | 'no-region-selected' | 'choice-selected' | 'choice-unselected';
  whenTagName?: string;
  whenLabelValue?: string;
  whenChoiceValue?: string;
  perRegion?: 'true' | 'false';
  perItem?: 'true' | 'false';
  allowNested?: 'true' | 'false';
  layout?: 'select' | 'inline' | 'vertical';
}

export interface ChoicesState extends ChoicesProps, BaseControlState {
  value?: string[];
  getFormattedValue: () => { 'choices': string[] };
}

export interface ChoicesRegistration extends Omit<ChoicesState, 'getFormattedValue'> {}