/**
 * Tipografías de las skins. Se cargan siempre al arrancar para que la vista
 * previa de Ajustes pueda mostrarlas antes de activar la skin.
 */
export const skinFonts = {
  Mali_400Regular: require('../../assets/fonts/Mali-Regular.ttf'),
  Mali_600SemiBold: require('../../assets/fonts/Mali-SemiBold.ttf'),
  Mali_700Bold: require('../../assets/fonts/Mali-Bold.ttf'),
} as const;

export type SkinFontFamily = keyof typeof skinFonts;
