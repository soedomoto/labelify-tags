import { htmlStyleToReactStyle } from '@/.';
import { Text as MText } from '@mantine/core';
import { PropsWithChildren, useEffect, useState } from 'react';
import { TextProps, TextState, textStore } from '.';

function Component({ id }: { id: string }) {
  const [state, setState] = useState<TextState>();

  useEffect(() => {
    return textStore.subscribe(id, (state) => setState(state))
  }, [id]);

  return <MText style={state?.reactStyle} {...(state?.props || {})}>{state?.value || state?.children}</MText>;
}

export function Text({ id, style, value, name, children, ...props }: PropsWithChildren<TextProps>) {
  const reactStyle = typeof style === 'string' ? htmlStyleToReactStyle(style) : style;

  useEffect(() => {
      textStore.register(id, {
        type: 'Text',
        id,
        value,
        name,
        reactStyle,
        props,
        children,
      });
    }, [id, value, name, reactStyle, props, children]);

  return <Component id={id} />;
}