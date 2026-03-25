import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Input } from './fields/Input';
import { Select } from './fields/Select';
import { Toggle } from './fields/Toggle';
import { fraudTypes, currencies, policeTypes } from '../../config/services';
import type { ServiceType } from '../../types';

interface DynamicFieldsProps {
  serviceType: ServiceType | '';
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
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

  const renderFields = () => {
    switch (serviceType) {
      case 'fraud':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#1E3A3A',
              }}
            >
              {t('form.fraud.title')}
            </h4>
            <Select
              label={t('form.fraud.type')}
              placeholder={t('form.fraud.typePlaceholder')}
              options={fraudTypes.map((type) => ({
                value: type.value,
                label: t(type.labelKey),
              }))}
              value={watch('extra_fields.fraud_type') || ''}
              onChange={(value) => setValue('extra_fields.fraud_type', value)}
              error={extraErrors?.fraud_type?.message as string}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
          </div>
        );

      case 'police':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#1E3A3A',
              }}
            >
              {t('form.police.title')}
            </h4>
            <Select
              label={t('form.police.situationType')}
              placeholder={t('form.police.situationTypePlaceholder')}
              options={policeTypes.map((type) => ({
                value: type.value,
                label: t(type.labelKey),
              }))}
              value={watch('extra_fields.situation_type') || ''}
              onChange={(value) => setValue('extra_fields.situation_type', value)}
              error={extraErrors?.situation_type?.message as string}
            />
            <Input
              label={t('form.police.eventDate')}
              type="date"
              {...register('extra_fields.event_date')}
              error={extraErrors?.event_date?.message as string}
            />
            <Toggle
              label={t('form.police.hasProtocol')}
              checked={watch('extra_fields.has_protocol') || false}
              onChange={(e) => setValue('extra_fields.has_protocol', e.target.checked)}
            />
          </div>
        );

      case 'business':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#1E3A3A',
              }}
            >
              {t('form.business.title')}
            </h4>
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      key={serviceType}
      style={{
        padding: '24px',
        borderRadius: '12px',
        background: '#FFFFFF',
        border: '1px solid #E5E8E8',
        animation: 'fadeInUp 0.3s ease-out',
      }}
    >
      {renderFields()}
    </div>
  );
});
