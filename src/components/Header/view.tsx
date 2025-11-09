import { htmlStyleToReactStyle } from '@/.';
import { Title as MTitle, TitleSize } from '@mantine/core';
import { PropsWithChildren, useEffect, useState } from 'react';
import { HeaderProps, HeaderState, headerStore } from '.';

function Component({ id }: { id: string }) {
  const [state, setState] = useState<HeaderState>();

  useEffect(() => {
    return headerStore.subscribe(id, (state) => setState(state))
  }, [id]);

  return <MTitle size={`h${state?.size}` as TitleSize} style={state?.reactStyle} {...(state?.props || {})}>{state?.value || state?.children}</MTitle>;
}

export function Header({ id, style, value, size = 4, children, ...props }: PropsWithChildren<HeaderProps>) {
  const reactStyle = typeof style === 'string' ? htmlStyleToReactStyle(style) : style;

  useEffect(() => {
    headerStore.register(id, {
      type: 'Header',
      id, 
      value,
      size,
      reactStyle,
      props,
      children,
    });
  }, [id, value, size, reactStyle, props, children]);

  return <Component id={id} />;
}