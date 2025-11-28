import { htmlStyleToReactStyle } from '@/.';
import { Textarea as MTextArea } from '@mantine/core';
import { PropsWithChildren, useEffect, useState } from 'react';
import { TextAreaProps, TextAreaRegistration, textAreaStore } from '.';

function Component({ id }: { id: string }) {
  const [state, setState] = useState<TextAreaRegistration>();

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
      textAreaStore.setValues(id, e.target.value);
    }}
  />;
}

export function TextArea(allProps: PropsWithChildren<TextAreaProps>) {
  const { id, style, name, toName, editable, placeholder, maxSubmissions, rows, children, ...props } = allProps;
  const reactStyle = typeof style === 'string' ? htmlStyleToReactStyle(style) : style;
  const { formattedValue } = (props || {}) as any;

  let value = undefined;
  if (Array.isArray(formattedValue?.value?.text)) {
    const [_value] = formattedValue.value.text;
    value = _value || '';
  } else {
    value = formattedValue?.value?.text || '';
  }

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
      formattedValue,
      visible: true,
    });
    return () => textAreaStore.unregister(id);
  }, [id, value, name, reactStyle, props, children]);

  return <Component id={id} />;
}