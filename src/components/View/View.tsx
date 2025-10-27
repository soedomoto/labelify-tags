import { htmlStyleToReactStyle } from '@/.';
import { randomId } from '@mantine/hooks';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ViewProps, ViewState, viewStore } from '.';

function Component({ id }: { id: string }) {
  const [state, setState] = useState<ViewState>();

  useEffect(() => {
    return viewStore.subscribe(id, (state) => setState(state))
  }, [id]);

  return <div style={state?.reactStyle} {...(state?.props || {})}>{state?.children}</div>;
}

export function View({ style, children, ...props }: PropsWithChildren<ViewProps>) {
  const id = randomId('HyperView-');
  const reactStyle = typeof style === 'string' ? htmlStyleToReactStyle(style) : style;

  useEffect(() => {
      viewStore.register(id, {
        type: 'View',
        reactStyle,
        props,
        children,
      });
    }, [id, reactStyle, props, children]);

  return <Component id={id} />;
}