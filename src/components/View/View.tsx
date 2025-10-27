import { htmlStyleToReactStyle } from '@/.';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ViewProps, ViewState, viewStore } from '.';

function Component({ id }: { id: string }) {
  const [state, setState] = useState<ViewState>();

  useEffect(() => {
    return viewStore.subscribe(id, (state) => setState(state))
  }, [id]);

  return <div style={state?.reactStyle} {...(state?.props || {})}>{state?.children}</div>;
}

export function View({ id, style, children, ...props }: PropsWithChildren<ViewProps>) {
  const reactStyle = typeof style === 'string' ? htmlStyleToReactStyle(style) : style;

  useEffect(() => {
      viewStore.register(id, {
        type: 'View',
        id,
        reactStyle,
        props,
        children,
      });
    }, [id, reactStyle, props, children]);

  return <Component id={id} />;
}