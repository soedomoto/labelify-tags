import { htmlStyleToReactStyle } from '@/.';
import { randomId } from '@mantine/hooks';
import { PropsWithChildren, useEffect, useState } from 'react';
import { HyperTextProps, HyperTextState, hyperTextStore } from '.';

function Component({ id }: { id: string }) {
  const [state, setState] = useState<HyperTextState>();

  useEffect(() => {
    return hyperTextStore.subscribe(id, (state) => setState(state))
  }, [id]);

  return <div style={state?.reactStyle} {...(state?.props || {})}>{state?.children}</div>;
}

export function HyperText({ style, value, name, children, ...props }: PropsWithChildren<HyperTextProps>) {
  const id = randomId('HyperText-');
  const reactStyle = typeof style === 'string' ? htmlStyleToReactStyle(style) : style;

  useEffect(() => {
    hyperTextStore.register(id, {
      type: 'HyperText',
      value,
      name,
      reactStyle,
      props,
      children,
    });
  }, [id, value, name, reactStyle, props, children]);

  return <Component id={id} />;
}