/* eslint-disable react-hooks/incompatible-library -- watch() de React Hook Form no puede memoizarse; el compilador omite este componente de forma segura. */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import type { AppError } from '@/domain/errors/result';
import type { Goal } from '@/domain/entities/types';
import { formatAmountInput } from '@/domain/money/money';
import { todayLocalDate } from '@/domain/time/calendar';
import { useApp } from '@/features/app/AppProvider';
import { prepareGoal, type GoalFormValues } from '@/features/goals/prepareGoal';
import { t, translateError } from '@/i18n';
import { colors, radii, spacing } from '@/theme';
import { deviceTimeZone } from '@/utils/device';

type FormField = keyof GoalFormValues;

function defaultsFor(goal: Goal | undefined, locale: string): GoalFormValues {
  return {
    title: goal?.title ?? '',
    amount: goal
      ? formatAmountInput(goal.targetAmountMinor, { currency: goal.currency, locale })
      : '',
    targetDate: goal?.targetDate ?? '',
  };
}

export interface GoalFormProps {
  goal?: Goal;
  onSaved?: () => void;
  onCancel?: () => void;
}

export function GoalForm({ goal, onSaved, onCancel }: GoalFormProps) {
  const { profile, repositories, invalidate } = useApp();
  const locale = profile?.locale ?? 'es-ES';
  const currency = goal?.currency ?? profile?.preferredCurrency ?? 'EUR';
  const startDate = goal?.startDate ?? todayLocalDate(new Date(), deviceTimeZone());
  const isEditing = goal !== undefined;

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({ defaultValues: defaultsFor(goal, locale) });

  const title = watch('title');
  const amount = watch('amount');
  const targetDate = watch('targetDate');

  useEffect(() => {
    reset(defaultsFor(goal, locale));
  }, [goal, locale, reset]);

  function applyError(error: AppError) {
    const field = error.field as FormField | undefined;
    if (field && ['title', 'amount', 'targetDate'].includes(field)) {
      setError(field, { type: 'validate', message: translateError(error) });
      return;
    }
    setError('root', { message: translateError(error) });
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!profile || !repositories) {
      setError('root', { message: t('app.notReady') });
      return;
    }

    const prepared = prepareGoal(values, {
      currency: profile.preferredCurrency,
      locale: profile.locale,
      startDate,
    });

    if (!prepared.ok) {
      applyError(prepared.error);
      return;
    }

    const result = isEditing
      ? await repositories.goals.update(goal.id, {
          title: prepared.value.title,
          targetAmountMinor: prepared.value.targetAmountMinor,
          targetDate: prepared.value.targetDate,
        })
      : await repositories.goals.create({
          title: prepared.value.title,
          targetAmountMinor: prepared.value.targetAmountMinor,
          currency: profile.preferredCurrency,
          startDate,
          targetDate: prepared.value.targetDate,
          isActive: true,
        });

    if (!result.ok) {
      applyError(result.error);
      return;
    }

    invalidate();
    if (!isEditing) {
      reset(defaultsFor(undefined, locale));
    }
    onSaved?.();
  });

  return (
    <View style={styles.container}>
      <AppText variant="label">{t('goals.name')}</AppText>
      <TextInput
        value={title}
        onChangeText={(text) => {
          setValue('title', text);
          clearErrors('title');
        }}
        placeholder={t('goals.namePlaceholder')}
        placeholderTextColor={colors.textMuted}
        maxLength={80}
        style={[styles.input, errors.title ? styles.inputError : undefined]}
        accessibilityLabel={t('goals.nameA11y')}
      />
      {errors.title ? (
        <AppText variant="caption" color={colors.danger}>
          {errors.title.message}
        </AppText>
      ) : null}

      <AppText variant="label" style={styles.label}>
        {t('goals.target')}
      </AppText>
      <View style={styles.amountRow}>
        <TextInput
          value={amount}
          onChangeText={(text) => {
            setValue('amount', text);
            clearErrors('amount');
          }}
          keyboardType="decimal-pad"
          placeholder={t('add.amountPlaceholder')}
          placeholderTextColor={colors.textMuted}
          maxLength={12}
          style={[styles.input, styles.amountInput, errors.amount ? styles.inputError : undefined]}
          accessibilityLabel={t('goals.targetA11y')}
        />
        <AppText variant="section" color={colors.textMuted}>
          {currency}
        </AppText>
      </View>
      {errors.amount ? (
        <AppText variant="caption" color={colors.danger}>
          {errors.amount.message}
        </AppText>
      ) : null}

      <AppText variant="label" style={styles.label}>
        {t('goals.targetDate')}
      </AppText>
      <TextInput
        value={targetDate}
        onChangeText={(text) => {
          setValue('targetDate', text);
          clearErrors('targetDate');
        }}
        placeholder={t('goals.targetDatePlaceholder')}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        style={[styles.input, errors.targetDate ? styles.inputError : undefined]}
        accessibilityLabel={t('goals.targetDateA11y')}
      />
      {errors.targetDate ? (
        <AppText variant="caption" color={colors.danger}>
          {errors.targetDate.message}
        </AppText>
      ) : null}

      {errors.root?.message ? (
        <AppText variant="caption" color={colors.danger} accessibilityLiveRegion="polite">
          {errors.root.message}
        </AppText>
      ) : null}

      <Button
        label={isSubmitting ? t('add.saving') : isEditing ? t('goals.save') : t('goals.create')}
        onPress={() => {
          void onSubmit();
        }}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.submit}
      />
      {onCancel ? (
        <Button
          label={t('common.cancel')}
          onPress={onCancel}
          variant="secondary"
          style={styles.cancel}
        />
      ) : null}
    </View>
  );
}

const styles = {
  container: { gap: spacing.sm },
  label: { marginTop: spacing.md },
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
  amountRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
    width: '100%' as const,
  },
  amountInput: { flex: 1, minWidth: 0 },
  inputError: { borderColor: colors.danger },
  submit: { marginTop: spacing.xl },
  cancel: { marginTop: spacing.sm },
};
