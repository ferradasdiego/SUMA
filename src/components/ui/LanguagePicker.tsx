import { View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Flag } from '@/components/ui/Flag';
import { LANGUAGES, languageFromLocale } from '@/i18n';
import { spacing } from '@/theme';

export interface LanguagePickerProps {
  readonly locale: string;
  onSelect(locale: string): void;
}

export function LanguagePicker({ locale, onSelect }: LanguagePickerProps) {
  const current = languageFromLocale(locale);

  return (
    <View style={styles.row}>
      {LANGUAGES.map((language) => (
        <Chip
          key={language.code}
          label={language.label}
          icon={<Flag code={language.code} />}
          selected={current === language.code}
          onPress={() => onSelect(language.locale)}
        />
      ))}
    </View>
  );
}

const styles = {
  row: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
  },
};
