import { BaseStoreState } from "../Base/types";
import { BaseObjectProps } from "../Registry";

// display	block | inline	
// [style]	string	CSS style string
// [className]	string	Class name of the CSS style to apply. Use with the Style tag
// [idAttr]	string	Unique ID attribute to use in CSS
// [visibleWhen]	region-selected | choice-selected | no-region-selected | choice-unselected	Control visibility of the content. Can also be used with the when* parameters below to narrow visibility
// [whenTagName]	string	Use with visibleWhen. Narrow down visibility by tag name. For regions, use the name of the object tag, for choices, use the name of the choices tag
// [whenLabelValue]	string	Use with visibleWhen="region-selected". Narrow down visibility by label value. Multiple values can be separated with commas
// [whenChoiceValue]	string	Use with visibleWhen ("choice-selected" or "choice-unselected") and whenTagName, both are required. Narrow down visibility by choice value. Multiple values can be separated with commas

export interface ViewProps extends BaseObjectProps {
  display?: 'block' | 'inline';
  className?: string;
  idAttr?: string;
  visibleWhen?: 'region-selected' | 'choice-selected' | 'no-region-selected' | 'choice-unselected';
  whenTagName?: string;
  whenLabelValue?: string;
  whenChoiceValue?: string;
}

export type ViewState = BaseStoreState & ViewProps