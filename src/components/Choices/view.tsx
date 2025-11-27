import { htmlStyleToReactStyle } from '@/.';
import { Group, Stack } from '@mantine/core';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ChoicesProps, ChoicesRegistration, choicesStore } from '.';

function Component({ id }: { id: string }) {
  const [state, setState] = useState<ChoicesRegistration>();

  useEffect(() => {
    setState(choicesStore.getInstance(id));
    return choicesStore.subscribe(id, (newState) => setState(newState));
  }, [id]);

  if (state?.showInLine !== 'true') return <Stack style={state?.reactStyle} {...(state?.props || {})}>{state?.children}</Stack>
  else return <Group mt="xs" style={state?.reactStyle} {...(state?.props || {})}>{state?.children}</Group>;
}

export function Choices({ id, parentId, style, name, toName, choice, showInLine, children, ...props }: PropsWithChildren<ChoicesProps>) {
  const reactStyle = typeof style === 'string' ? htmlStyleToReactStyle(style) : style;
  const { formattedValue } = (props || {}) as any;

  let value = undefined;
  if (Array.isArray(formattedValue?.value?.choices)) {
    value = formattedValue.value.choices;
  }

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
      children,
      props,
      value,
      visible: true,
    });
    return () => choicesStore.unregister(id);
  }, [id, parentId, name, toName, choice, showInLine, reactStyle, props, children]);

  return <Component id={id} />;
}