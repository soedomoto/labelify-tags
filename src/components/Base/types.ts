import { CSSProperties, ReactNode } from "react";

export type SupportedTypes = 'View' | 'Text' | 'Header' | 'HyperText' | 'Label' | 'Choices' | 'Choice' | 'TextArea';

export type BaseStoreState = {
  type: SupportedTypes
  id?: string;
  name?: string;
  visible?: boolean;
  reactStyle?: CSSProperties | undefined;
  props?: Record<string, unknown>;
  children?: string | ReactNode | ReactNode[];
}