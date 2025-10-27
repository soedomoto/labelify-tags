import { HTMLAttributes } from "react";
import { BaseStoreState } from "../Base/types";

export type TextAreaProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  name?: string;
  toName?: string;
  editable?: 'true' | 'false';
  placeholder?: string;
  maxSubmissions?: number;
  rows?: number;
  value?: string;
  style?: string;

  // name="justification" 
  // toName="video_description" 
  // editable="true"
  // placeholder="Please provide the justification for your choice"
  // maxSubmissions="1"
  // rows="3"
}

export type TextAreaState = BaseStoreState & TextAreaProps