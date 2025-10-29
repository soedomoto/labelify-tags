import { BaseControlProps, BaseControlState } from "../Registry";

// name	string		Name of the element
// toName	string		Name of the element that you want to label
// value	string		Pre-filled value
// [label]	string		Label text
// [placeholder]	string		Placeholder text
// [maxSubmissions]	string		Maximum number of submissions
// [editable]	boolean	false	Whether to display an editable textarea
// [skipDuplicates]	boolean	false	Prevent duplicates in textarea inputs
// [transcription]	boolean	false	If false, always show editor
// [displayMode]	tag | region-list	tag	Display mode for the textarea; region-list shows it for every region in regions list
// [rows]	number		Number of rows in the textarea
// [required]	boolean	false	Validate whether content in textarea is required
// [requiredMessage]	string		Message to show if validation fails
// [showSubmitButton]	boolean		Whether to show or hide the submit button. By default it shows when there are more than one rows of text, such as in textarea mode.
// [perRegion]	boolean		Use this tag to label regions instead of whole objects
// [perItem]	boolean		Use this tag to label items inside objects instead of whole objects

export interface TextAreaProps extends BaseControlProps {
  value: string;
  label?: string;
  placeholder?: string;
  maxSubmissions?: number;
  editable?: 'true' | 'false';
  skipDuplicates?: 'true' | 'false';
  transcription?: 'true' | 'false';
  displayMode?: 'tag' | 'region-list';
  rows?: number;
  required?: 'true' | 'false';
  requiredMessage?: string;
  showSubmitButton?: 'true' | 'false';
  perRegion?: 'true' | 'false';
  perItem?: 'true' | 'false';
}

export interface TextAreaState extends TextAreaProps, BaseControlState {
  formattedValue?: { 'text': string[] };
  getFormattedValue: () => { 'text': string[] };
}

export interface TextAreaRegistration extends Omit<TextAreaState, 'getFormattedValue' | 'setFormattedValue'> {}