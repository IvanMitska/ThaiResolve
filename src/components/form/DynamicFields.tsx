import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Input } from './fields/Input';
import { Select } from './fields/Select';
import { Toggle } from './fields/Toggle';
import { fraudTypes, currencies } from '../../config/services';
import type { ServiceType } from '../../types';

interface DynamicFieldsProps {
  serviceType: ServiceType | '';
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.125rem',
        fontWeight: 500,
        letterSpacing: '-0.02em',
        color: 'var(--ink)',
      }}
    >
      {children}
    </h4>
  );
}

export const DynamicFields = memo(function DynamicFields({
  serviceType,
  register,
  watch,
  setValue,
  errors,
}: DynamicFieldsProps) {
  const { t } = useTranslation();

  if (!serviceType) return null;

  const extraErrors = errors.extra_fields as Record<string, any> | undefined;
  const col2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

  const renderFields = () => {
    switch (serviceType) {
      case 'fraud':
        return (
          <>
            <GroupTitle>{t('form.fraud.title')}</GroupTitle>
            <Select
              label={t('form.fraud.type')}
              placeholder={t('form.fraud.typePlaceholder')}
              options={fraudTypes.map((type) => ({ value: type.value, label: t(type.labelKey) }))}
              value={watch('extra_fields.fraud_type') || ''}
              onChange={(value) => setValue('extra_fields.fraud_type', value)}
              error={extraErrors?.fraud_type?.message as string}
            />
            <div style={col2}>
              <Input
                label={t('form.fraud.amount')}
                type="number"
                placeholder={t('form.fraud.amountPlaceholder')}
                {...register('extra_fields.amount', { valueAsNumber: true })}
                error={extraErrors?.amount?.message as string}
              />
              <Select
                label={t('form.fraud.currency')}
                options={currencies.map((c) => ({ value: c, label: c }))}
                value={watch('extra_fields.currency') || ''}
                onChange={(value) => setValue('extra_fields.currency', value)}
              />
            </div>
            <Toggle
              label={t('form.fraud.evidence')}
              checked={watch('extra_fields.has_evidence') || false}
              onChange={(e) => setValue('extra_fields.has_evidence', e.target.checked)}
            />
          </>
        );

      case 'business':
        return (
          <>
            <GroupTitle>{t('form.business.title')}</GroupTitle>
            <Input
              label={t('form.business.businessSphere')}
              placeholder={t('form.business.businessPlaceholder')}
              {...register('extra_fields.business_sphere')}
              error={extraErrors?.business_sphere?.message as string}
            />
            <Input
              label={t('form.business.disputeAmount')}
              type="number"
              placeholder={t('form.business.disputePlaceholder')}
              {...register('extra_fields.dispute_amount', { valueAsNumber: true })}
            />
            <Toggle
              label={t('form.business.hasDocuments')}
              checked={watch('extra_fields.has_documents') || false}
              onChange={(e) => setValue('extra_fields.has_documents', e.target.checked)}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      key={serviceType}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '24px',
        borderRadius: '14px',
        background: 'var(--accent-soft)',
        border: '1px solid var(--line-soft)',
        animation: 'heroFadeUp 0.4s var(--ease-expo)',
      }}
    >
      {renderFields()}
    </div>
  );
});
