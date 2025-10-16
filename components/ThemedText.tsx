import { Text, type TextProps } from 'react-native';

type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'subtitle';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  return (
    <Text
      style={[
        type === 'default' && {
          fontSize: 16,
          lineHeight: 24,
        },
        type === 'title' && {
          fontSize: 32,
          fontWeight: 'bold',
          lineHeight: 32,
        },
        type === 'subtitle' && {
          fontSize: 20,
          fontWeight: 'bold',
        },
        style,
      ]}
      {...rest}
    />
  );
}