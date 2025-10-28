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
}

export type TextAreaState = BaseStoreState & TextAreaProps