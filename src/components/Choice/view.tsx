import { ChoicesRegistration, choicesStore, htmlStyleToReactStyle } from '@/.';
import { Checkbox } from '@mantine/core';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ChoiceProps, ChoiceRegistration, choiceStore } from '.';

function Component({ id }: { id: string }) {
  const [state, setState] = useState<ChoiceRegistration>();
  const [pState, setPState] = useState<ChoicesRegistration>();

  useEffect(() => {
    return choiceStore.subscribe(id, (state) => setState(state))
  }, [id]);

  useEffect(() => {
    if (state?.parentId) {
      setPState(choicesStore.getInstance(state?.parentId));
      return choicesStore.subscribe(state?.parentId || '', (pState) => setPState(pState));
    }
  }, [state?.parentId]);

  const [value] = pState?.value || [];

  return (
    <Checkbox
      mt="xs"
      ml={33}
      label={state?.value || state?.children}
      key={state?.value}
      checked={pState?.choice === 'single' ? value == state?.value : (pState?.value || []).includes(state?.value || '')}
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
      visible: true,
    });
    return () => choiceStore.unregister(id);
  }, [id, parentId, value, reactStyle, props, children]);

  return <Component id={id} />;
}