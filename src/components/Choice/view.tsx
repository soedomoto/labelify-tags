import { ChoicesState, choicesStore, htmlStyleToReactStyle } from '@/.';
import { Checkbox } from '@mantine/core';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ChoiceProps, ChoiceState, choiceStore } from '.';

function Component({ id }: { id: string }) {
  const [state, setState] = useState<ChoiceState>();
  const [pState, setPState] = useState<ChoicesState>();

  useEffect(() => {
    return choiceStore.subscribe(id, (state) => setState(state))
  }, [id]);

  useEffect(() => {
    if (state?.parentId) {
      setPState(choicesStore.getInstance(state?.parentId));
      return choicesStore.subscribe(state?.parentId || '', (pState) => setPState(pState));
    }
  }, [state?.parentId]);

  const [value] = pState?.values || [];

  return (
    <Checkbox
      mt="xs"
      ml={33}
      label={state?.value || state?.children}
      key={state?.value}
      checked={pState?.choice === 'single' ? value == state?.value : (pState?.values || []).includes(state?.value || '')}
      onChange={(event) => {
        if (state?.parentId && state?.value) {
          choicesStore.setValues(state?.parentId, state?.value, event.currentTarget.checked ? state?.value || '' : '');
        }
      }}
    />
  )
}

export function Choice({ id, parentId, style, value, children, ...props }: PropsWithChildren<ChoiceProps>) {
  const reactStyle = typeof style === 'string' ? htmlStyleToReactStyle(style) : style;

  useEffect(() => {
    choiceStore.register(id, {
      type: 'Choice',
      id,
      parentId,
      value,
      reactStyle,
      props,
      children,
    });
  }, [id, parentId, value, reactStyle, props, children]);

  return <Component id={id} />;
}