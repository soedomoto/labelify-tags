export function htmlStyleToReactStyle(styleString: string | undefined): React.CSSProperties {
  if (!styleString) return {};

  const styleObject: React.CSSProperties = {};

  styleString.split(';').forEach((style) => {
    const [property, value] = style.split(':').map((s) => s.trim());
    if (property && value) {
      const camelCasedProperty = property.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
      styleObject[camelCasedProperty as keyof React.CSSProperties] = value as any;
    }
  });

  return styleObject;
}