import { ChoicesRegistration, choicesStore, htmlStyleToReactStyle } from '@/.';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ViewProps, ViewState, viewStore } from '.';
import { Flex, Stack } from '@mantine/core';

function Component({ id }: { id: string }) {
  const [state, setState] = useState<ViewState>();
  const [choicesState, setChoicesState] = useState<ChoicesRegistration>();

  useEffect(() => {
    return viewStore.subscribe(id, (state) => setState(state))
  }, [id]);

  useEffect(() => {
    if (state?.visibleWhen == 'choice-selected' && state?.whenTagName) {
      setChoicesState(choicesStore.getInstance(state?.whenTagName));
      return choicesStore.subscribe(state?.whenTagName || '', (pState) => setChoicesState(pState));
    }
  }, [state?.visibleWhen, state?.whenTagName]);

  let visible = true;
  const whenChoiceValues = (state?.whenChoiceValue || '').split(',').map(v => v.trim() || '--missing--');
  if (state?.visibleWhen == 'choice-selected') {
    // visible = (choicesState?.value || []).includes(state?.whenChoiceValue || '--missing--');
    visible = (choicesState?.value || []).some(v => whenChoiceValues.includes(v));
  } else if (state?.visibleWhen == 'choice-unselected') {
    // visible = !(choicesState?.value || []).includes(state?.whenChoiceValue || '--missing--');
    visible = !(choicesState?.value || []).some(v => whenChoiceValues.includes(v));
  }

  // useEffect(() => {
  //   console.log(id, state?.whenTagName, state?.visible, visible);
  //   viewStore.setPropValue(id, 'visible', visible);
  // }, [id, state?.visible, visible]);

  if (state?.display == 'inline') return visible && (
    <div style={{display: 'inline-block'}}>{state?.children}</div>
  );

  return visible && (
    <Flex
      gap="sm"
      justify="center"
      align="flex-start"
      direction="column"
      wrap="wrap"
      style={state?.reactStyle}
      {...(state?.props || {})}
    >{state?.children}</Flex>
  );
}

export function View({ id, style, display, idAttr, visibleWhen, whenChoiceValue, whenLabelValue, whenTagName, children, ...props }: PropsWithChildren<ViewProps>) {
  const reactStyle = typeof style === 'string' ? htmlStyleToReactStyle(style) : style;

  useEffect(() => {
    viewStore.register(id, {
      type: 'View',
      id,
      reactStyle,
      display,
      idAttr,
      visibleWhen,
      whenChoiceValue,
      whenLabelValue,
      whenTagName,
      props,
      children,
    });
  }, [id, reactStyle, display, idAttr, visibleWhen, whenChoiceValue, whenLabelValue, whenTagName, props, children]);

  return <Component id={id} />;
}