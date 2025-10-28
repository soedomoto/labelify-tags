import { htmlStyleToReactStyle } from '@/.';
import { Textarea as MTextArea } from '@mantine/core';
import { PropsWithChildren, useEffect, useState } from 'react';
import { TextAreaProps, TextAreaState, textAreaStore } from '.';

function Component({ id }: { id: string }) {
  const [state, setState] = useState<TextAreaState>();

  useEffect(() => {
    return textAreaStore.subscribe(id, (state) => setState(state))
  }, [id]);

  return <MTextArea
    {...(state?.props || {})}
    label={undefined}
    autosize
    minRows={1}
    maxRows={state?.rows}
    style={state?.reactStyle}
    value={state?.value}
    onChange={(e) => {
      if (state) state.value = e.target.value;
    }}
  />;
}

export function TextArea({ id, style, value, name, toName, editable, placeholder, maxSubmissions, rows, children, ...props }: PropsWithChildren<TextAreaProps>) {
  const reactStyle = typeof style === 'string' ? htmlStyleToReactStyle(style) : style;

  useEffect(() => {
    textAreaStore.register(id, {
      type: 'TextArea',
      id,
      value,
      name,
      toName,
      editable,
      placeholder,
      maxSubmissions,
      rows,
      reactStyle,
      props,
      children,
    });
  }, [id, value, name, reactStyle, props, children]);

  return <Component id={id} />;
}