/* eslint-disable @typescript-eslint/no-require-imports */
// Los iconos cargan fuentes nativas que no existen en el entorno de pruebas.
jest.mock('@expo/vector-icons/Ionicons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ name }: { name: string }) => React.createElement(Text, null, name),
  };
});
