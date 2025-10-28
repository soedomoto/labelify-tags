import { BaseObjectProps, BaseObjectState } from "../Registry";

// value	string	Choice value
// [selected]	boolean	Specify whether to preselect this choice on the labeling interface
// [alias]	string	Alias for the choice. If used, the alias replaces the choice value in the annotation results. Alias does not display in the interface.
// [style]	style	CSS style of the checkbox element
// [hotkey]	string	Hotkey for the selection
// [html]	string	Can be used to show enriched content, it has higher priority than value, however value will be used in the exported result (should be properly escaped)
// [hint]	string	Hint for choice on hover
// [color]	string	Color for Taxonomy item

export interface ChoiceProps extends BaseObjectProps {
  value?: string;
  selected?: 'true' | 'false';
  alias?: string;
  style?: string;
  hotkey?: string;
  html?: string;
  hint?: string;
  color?: string;
}

export interface ChoiceState extends BaseObjectState, ChoiceProps {}

export interface ChoiceRegistration extends ChoiceState {}