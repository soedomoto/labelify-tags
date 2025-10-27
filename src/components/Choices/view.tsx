import { htmlStyleToReactStyle } from '@/.';
import { Group, Stack } from '@mantine/core';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ChoicesProps, ChoicesState, choicesStore } from '.';

function Component({ id }: { id: string }) {
  const [state, setState] = useState<ChoicesState>();

  useEffect(() => {
    setState(choicesStore.getInstance(id));
    return choicesStore.subscribe(id, (newState) => setState(newState));
  }, [id]);

  if (state?.showInLine !== 'true') return <Stack style={state?.reactStyle} {...(state?.props || {})}>{state?.children}</Stack>
  else return <Group mt="xs" style={state?.reactStyle} {...(state?.props || {})}>{state?.children}</Group>;
}

export function Choices({ id, parentId, style, name, toName, choice, showInLine, children, ...props }: PropsWithChildren<ChoicesProps>) {
  const reactStyle = typeof style === 'string' ? htmlStyleToReactStyle(style) : style;

  useEffect(() => {
    choicesStore.register(id, {
      type: 'Choices',
      id,
      parentId,
      name,
      toName,
      choice,
      showInLine,
      reactStyle,
      props,
      children,
    });
  }, [id, parentId, name, toName, choice, showInLine, reactStyle, props, children]);

  return <Component id={id} />;
}