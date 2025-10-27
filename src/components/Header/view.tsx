import { htmlStyleToReactStyle } from '@/.';
import { Title as MTitle, TitleOrder } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { PropsWithChildren, useEffect, useState } from 'react';
import { HeaderProps, HeaderState, headerStore } from '.';

function Component({ id }: { id: string }) {
  const [state, setState] = useState<HeaderState>();

  useEffect(() => {
    return headerStore.subscribe(id, (state) => setState(state))
  }, [id]);

  return <MTitle order={(7 - (state?.size || 1)) as TitleOrder} style={state?.reactStyle} {...(state?.props || {})}>{state?.value || state?.children}</MTitle>;
}

export function Header({ style, value, size = 1, children, ...props }: PropsWithChildren<HeaderProps>) {
  const id = randomId('HyperText-');
  const reactStyle = typeof style === 'string' ? htmlStyleToReactStyle(style) : style;

  useEffect(() => {
    headerStore.register(id, {
      type: 'Header',
      value,
      size,
      reactStyle,
      props,
      children,
    });
  }, [id, value, size, reactStyle, props, children]);

  return <Component id={id} />;
}