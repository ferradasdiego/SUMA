/* eslint-disable react-hooks/incompatible-library -- watch() de React Hook Form no puede memoizarse; el compilador omite este componente de forma segura. */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { useApp } from '@/features/app/AppProvider';
import { prepareEntry, type EntryFormValues } from '@/features/entries/prepareEntry';
import type { AppError } from '@/domain/errors/result';
import { formatAmountInput } from '@/domain/money/money';
import { addDays, todayLocalDate } from '@/domain/time/calendar';
import { categoryLabel, t } from '@/i18n';
import { deviceTimeZone } from '@/utils/device';
import { categoryColors, colors, radii, spacing } from '@/theme';

const QUICK_AMOUNTS = [150, 250, 500, 1000];

type FormField = keyof EntryFormValues;

export function AddEntryForm() {
  const { profile, categories, repositories, invalidate } = useApp();
  const [success, setSuccess] = useState(false);

  const today = profile ? todayLocalDate(new Date(), deviceTimeZone()) : '2026-01-01';
  const locale = profile?.locale ?? 'es-ES';
  const currency = profile?.preferredCurrency ?? 'EUR';

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<EntryFormValues>({
    defaultValues: {
      amount: '',
      categoryId: categories[0]?.id ?? '',
      note: '',
      date: today,
    },
  });

  const amount = watch('amount');
  const categoryId = watch('categoryId');
  const note = watch('note');
  const date = watch('date');

  function applyError(error: AppError) {
    const field = error.field as FormField | undefined;
    if (field && ['amount', 'categoryId', 'note', 'date'].includes(field)) {
      setError(field, { type: 'validate', message: error.message });
      return;
    }
    setError('root', { message: error.message });
  }

  const onSubmit = handleSubmit(async (values) => {
    setSuccess(false);

    if (!profile || !repositories) {
      setError('root', { message: 'La aplicación todavía no está lista' });
      return;
    }

    const prepared = prepareEntry(values, {
      currency: profile.preferredCurrency,
      locale: profile.locale,
      timeZone: deviceTimeZone(),
      today,
      now: new Date(),
      categoryIds: categories.map((category) => category.id),
    });

    if (!prepared.ok) {
      applyError(prepared.error);
      return;
    }

    const created = await repositories.entries.create(prepared.value);
    if (!created.ok) {
      applyError(created.error);
      return;
    }

    invalidate();
    setSuccess(true);
    reset({
      amount: '',
      categoryId: categories[0]?.id ?? '',
      note: '',
      date: today,
    });
  });

  if (!profile) return null;

  return (
    <View style={styles.container}>
      {success ? (
        <Card style={styles.success}>
          <AppText variant="label" color={colors.primary} accessibilityLiveRegion="polite">
            {t('add.success')}
          </AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.successText}>
            Puedes registrar otra decisión o volver al inicio.
          </AppText>
          <Button
            label={t('add.goHome')}
            onPress={() => {
              setSuccess(false);
              router.push('/(tabs)');
            }}
            variant="secondary"
            style={styles.successAction}
          />
        </Card>
      ) : null}

      <AppText variant="label" style={styles.label}>
        {t('add.amount')}
      </AppText>
      <View style={styles.amountRow}>
        <TextInput
          value={amount}
          onChangeText={(text) => {
            setValue('amount', text);
            clearErrors('amount');
            setSuccess(false);
          }}
          keyboardType="decimal-pad"
          placeholder="0,00"
          placeholderTextColor={colors.textMuted}
          style={[styles.amountInput, errors.amount ? styles.inputError : undefined]}
          accessibilityLabel={t('add.amount')}
          maxLength={12}
        />
        <AppText variant="section" color={colors.textMuted}>
          {currency}
        </AppText>
      </View>
      {errors.amount ? (
        <AppText variant="caption" color={colors.danger} accessibilityLiveRegion="polite">
          {errors.amount.message}
        </AppText>
      ) : null}

      <AppText variant="label" style={styles.label}>
        {t('add.quickAmounts')}
      </AppText>
      <View style={styles.chips}>
        {QUICK_AMOUNTS.map((minor) => (
          <Chip
            key={minor}
            label={formatAmountInput(minor, { currency, locale })}
            selected={amount === formatAmountInput(minor, { currency, locale })}
            onPress={() => {
              setValue('amount', formatAmountInput(minor, { currency, locale }));
              clearErrors('amount');
            }}
          />
        ))}
      </View>

      <AppText variant="label" style={styles.label}>
        {t('add.category')}
      </AppText>
      <View style={styles.chips}>
        {categories.map((category) => {
          const token = category.colorToken as keyof typeof categoryColors;
          return (
            <Chip
              key={category.id}
              label={categoryLabel(category.nameKey)}
              selected={categoryId === category.id}
              onPress={() => {
                setValue('categoryId', category.id);
                clearErrors('categoryId');
              }}
              icon={
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={
                    categoryId === category.id
                      ? colors.primary
                      : (categoryColors[token] ?? colors.textMuted)
                  }
                />
              }
            />
          );
        })}
      </View>
      {errors.categoryId ? (
        <AppText variant="caption" color={colors.danger}>
          {errors.categoryId.message}
        </AppText>
      ) : null}

      <AppText variant="label" style={styles.label}>
        {t('add.date')}
      </AppText>
      <View style={styles.chips}>
        <Chip
          label={t('add.today')}
          selected={date === today}
          onPress={() => {
            setValue('date', today);
            clearErrors('date');
          }}
        />
        <Chip
          label={t('add.yesterday')}
          selected={date === addDays(today, -1)}
          onPress={() => {
            setValue('date', addDays(today, -1));
            clearErrors('date');
          }}
        />
      </View>
      <TextInput
        value={date}
        onChangeText={(text) => {
          setValue('date', text);
          clearErrors('date');
        }}
        placeholder="AAAA-MM-DD"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, errors.date ? styles.inputError : undefined]}
        accessibilityLabel="Fecha en formato año-mes-día"
        autoCapitalize="none"
      />
      {errors.date ? (
        <AppText variant="caption" color={colors.danger}>
          {errors.date.message}
        </AppText>
      ) : null}

      <AppText variant="label" style={styles.label}>
        {t('add.note')}
      </AppText>
      <TextInput
        value={note}
        onChangeText={(text) => {
          setValue('note', text);
          clearErrors('note');
        }}
        placeholder="Ej. Café preparado en casa"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, styles.note, errors.note ? styles.inputError : undefined]}
        multiline
        maxLength={280}
        accessibilityLabel={t('add.note')}
      />
      {errors.note ? (
        <AppText variant="caption" color={colors.danger}>
          {errors.note.message}
        </AppText>
      ) : null}

      {errors.root?.message ? (
        <AppText variant="caption" color={colors.danger} accessibilityLiveRegion="polite">
          {errors.root.message}
        </AppText>
      ) : null}

      <Button
        label={isSubmitting ? t('add.saving') : t('add.save')}
        onPress={() => {
          void onSubmit();
        }}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.submit}
      />

      <AppText variant="caption" color={colors.textMuted} style={styles.preview}>
        Se registrará como dinero no gastado, no como ahorro disponible.
      </AppText>
    </View>
  );
}

const styles = {
  container: { gap: spacing.sm, paddingBottom: spacing.xxxl },
  success: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  successText: { marginTop: spacing.xs },
  successAction: {
    marginTop: spacing.md,
    alignSelf: 'flex-start' as const,
    paddingHorizontal: spacing.lg,
  },
  label: { marginTop: spacing.md },
  amountRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: spacing.sm },
  amountInput: {
    flex: 1,
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    backgroundColor: colors.background,
  },
  chips: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: spacing.sm },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  note: { minHeight: 88, textAlignVertical: 'top' as const },
  inputError: { borderColor: colors.danger },
  submit: { marginTop: spacing.xl },
  preview: { marginTop: spacing.md, textAlign: 'center' as const },
};
