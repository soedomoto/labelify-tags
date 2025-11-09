import { BaseControlState, Registry } from "@/.";
import { MantineProvider } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { parseDocument } from "htmlparser2";
import { createElement, Key, ReactNode } from "react";

export type HtxElement = {
  type: string;
  props: Record<string, any>;
  children: HtxElement[] | string;
}

export function parseHtxString(htxString: string = "<View>\n <View style=\"box-shadow: 2px 2px 5px #999; padding: 20px; margin-top: 2em; border-radius: 5px;\">\n <Header value=\"Caption:\" size=\"6\"/>\n <Text name=\"video_description\" value=\"$video_description\"/>\n </View>\n <View style=\"box-shadow: 2px 2px 5px #999; padding: 20px; margin-top: 2em; border-radius: 5px;\">\n <Header value=\"Voice to text:\" size=\"6\"/>\n <Text name=\"voice_to_text\" value=\"$voice_to_text\"/>\n </View>\n <HyperText name=\"tiktok_video\" value=\"$tiktok_embed_url\">\n \t<iframe\n width=\"100%\"\n height=\"500\"\n frameborder=\"0\"\n src=\"$tiktok_embed_url\"\n allow=\"fullscreen\" \n title=\"test\"\n ></iframe>\n </HyperText>\n <HyperText name=\"tiktok_url\" value=\"$tiktok_embed_url\">\n <a href=\"$tiktok_embed_url\" target=\"_blank\">See post on TikTok</a>\n </HyperText>\n <View style=\"box-shadow: 2px 2px 5px #999; padding: 20px; margin-top: 2em; border-radius: 5px;\">\n <View>\n \t\t<HyperText name=\"instructions\" value=\"Is this post about MSME business activities (as defined in this research) in the fashion, culinary, or craft industries? See the definition &lt;a href='YOUR_URL_HERE' target='_blank'&gt;here&lt;/a&gt;\"/>\n </View>\n <Choices name=\"sentiment\" toName=\"video_description\" choice=\"single\" showInLine=\"true\">\n <Choice value=\"Yes\"/>\n <Choice value=\"No\"/>\n <Choice value=\"Not Sure\"/>\n </Choices>\n <TextArea \n name=\"justification\" \n toName=\"video_description\" \n editable=\"true\"\n placeholder=\"Please provide the justification for your choice\"\n maxSubmissions=\"1\"\n rows=\"3\"\n />\n </View>\n</View>"): HtxElement[] {
  const document = parseDocument(htxString, { xmlMode: true });

  function transformNode(node: any): HtxElement | string | null {
    if (node.type === "text") {
      return node.data.trim();
    }

    if (node.type === "comment") {
      // Handle comments here. For now, we exclude them.
      return null;
    }

    const children = node.children ? node.children.map(transformNode).filter(Boolean) : [];

    return {
      type: node.name, // tagNameMapping[node.name] || toKebabCase(node.name), // Use mapping or fallback to kebab-case
      props: node.attribs || {},
      children,
    };
  }

  return document.children
    .map(transformNode)
    .filter((node): node is HtxElement => node !== null);
}

function renderHtxElement(element: HtxElement, context: Record<string, any>, defaultValues: Record<string, Record<string, any>>, key?: Key, parentId?: string): React.ReactNode {
  let { type, props = {}, children } = element;
  const id = props?.name || randomId(`${type}-`);

  props.id = id;
  props.parentId = parentId;
  for (const prop in props) {
    if (typeof props[prop] === 'string' && props[prop].startsWith('$')) {
      const valueKey = props[prop].slice(1);
      props[prop] = context[valueKey] || '';
    }
  }

  for (const instanceId in defaultValues) {
    if (instanceId == id) {
      props = { ...props, ...defaultValues[instanceId] };
    }
  }

  let reactChildren: string | ReactNode[];
  if (Array.isArray(children)) {
    reactChildren = children.map((child, idx) => (typeof child === "string" ? child : renderHtxElement(child, context, defaultValues, idx, id)))
  } else {
    reactChildren = children;
  }

  const comp = Registry.getComponent(type);
  const view = comp?.view || type;

  return createElement(view, { key, ...props }, reactChildren);
}

export function renderHtxString(htxString: string, context: Record<string, any>, defaultValues: Record<string, Record<string, any>> = {}): React.ReactNode {
  // console.log("Rendering HTX string:", htxString);
  const elements = parseHtxString(htxString);
  // console.log("Parsed HTX elements:", elements);
  return (
    <MantineProvider>
      {elements.map((e, idx) => renderHtxElement(e, context, defaultValues, idx))}
    </MantineProvider>
  );
}