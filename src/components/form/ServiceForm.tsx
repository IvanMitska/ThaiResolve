import { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import { Input } from './fields/Input';
import { Select } from './fields/Select';
import { FileUpload } from './FileUpload';
import { DynamicFields } from './DynamicFields';
import { SuccessScreen } from './SuccessScreen';
import { useInView } from '../../hooks/useInView';
import { services, cities } from '../../config/services';
import type { ServiceType } from '../../types';

const messengers = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'line', label: 'Line' },
];

interface ServiceFormProps {
  preselectedService?: ServiceType;
}

export const ServiceForm = memo(function ServiceForm({ preselectedService }: ServiceFormProps) {
  const { t, i18n } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { ref, isVisible } = useInView();

  const createSchema = () =>
    z.object({
      name: z.string().min(2, t('form.validation.nameMin')),
      service_type: z.string().min(1, t('form.validation.serviceRequired')),
      messenger_type: z.string().min(1, t('form.validation.messengerRequired')),
      messenger_contact: z.string().min(1, t('form.validation.contactRequired')),
      city: z.string().min(1, t('form.validation.cityRequired')),
      description: z.string().min(20, t('form.validation.descriptionMin')),
      consent: z.boolean().refine((val) => val === true, t('form.validation.consentRequired')),
      extra_fields: z.any().optional(),
    });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSchema()),
    defaultValues: {
      name: '',
      service_type: preselectedService || '',
      messenger_type: '',
      messenger_contact: '',
      city: '',
      description: '',
      consent: false,
      extra_fields: {},
    },
  });

  const serviceType = watch('service_type') as ServiceType | '';

  useEffect(() => {
    if (preselectedService) {
      setValue('service_type', preselectedService);
    }
  }, [preselectedService, setValue]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        lang: i18n.language,
        file_urls: [],
      };

      const response = await fetch(
        import.meta.env.VITE_SUPABASE_URL
          ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-request`
          : '/api/submit-request',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error('Failed');
      setIsSuccess(true);
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setFiles([]);
    setIsSuccess(false);
  };

  if (isSuccess) {
    return <SuccessScreen onReset={handleReset} />;
  }

  return (
    <section
      id="form"
      ref={ref}
      style={{
        padding: '120px 0',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header - KAIF style */}
        <div
          className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{ marginBottom: '48px' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-muted)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                width: '40px',
                height: '1px',
                background: 'var(--text-muted)',
              }}
            />
            {t('form.label')}
          </span>
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            {t('form.title')}
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
          >
            {t('form.subtitle')}
          </p>
        </div>

        {/* Form card - KAIF style */}
        <div
          className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{
            background: 'rgba(255,255,255,0.92)',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid var(--border)',
            transitionDelay: '0.2s',
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <Input
              label={t('form.fields.name')}
              placeholder={t('form.fields.namePlaceholder')}
              {...register('name')}
              error={errors.name?.message as string}
            />

            <Select
              label={t('form.fields.serviceType')}
              placeholder={t('form.fields.serviceTypePlaceholder')}
              options={services.map((s) => ({
                value: s.id,
                label: `${s.icon} ${t(s.titleKey)}`,
              }))}
              value={watch('service_type')}
              onChange={(value) => setValue('service_type', value)}
              error={errors.service_type?.message as string}
            />

            {serviceType && (
              <DynamicFields
                serviceType={serviceType}
                register={register}
                watch={watch}
                setValue={setValue}
                errors={errors}
              />
            )}

            <div
              className="form-row"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
            >
              <Select
                label={t('form.fields.messenger')}
                placeholder={t('form.fields.messengerPlaceholder')}
                options={messengers}
                value={watch('messenger_type')}
                onChange={(value) => setValue('messenger_type', value)}
                error={errors.messenger_type?.message as string}
              />
              <Input
                label={t('form.fields.contact')}
                placeholder={t('form.fields.contactPlaceholder')}
                {...register('messenger_contact')}
                error={errors.messenger_contact?.message as string}
              />
            </div>

            <Select
              label={t('form.fields.city')}
              placeholder={t('form.fields.cityPlaceholder')}
              options={cities.map((c) => ({ value: c, label: c }))}
              value={watch('city')}
              onChange={(value) => setValue('city', value)}
              error={errors.city?.message as string}
            />

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {t('form.fields.description')}
              </label>
              <textarea
                {...register('description')}
                placeholder={t('form.fields.descriptionPlaceholder')}
                rows={4}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#FFFFFF',
                  border: errors.description ? '1px solid var(--error)' : '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  resize: 'none',
                  outline: 'none',
                }}
              />
              {errors.description && (
                <p style={{ fontSize: '13px', color: 'var(--error)' }}>{errors.description.message as string}</p>
              )}
            </div>

            <FileUpload files={files} onFilesChange={setFiles} />

            {/* Consent */}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                {...register('consent')}
                style={{
                  marginTop: '3px',
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {t('form.fields.consent')}
              </span>
            </label>
            {errors.consent && (
              <p style={{ fontSize: '13px', color: 'var(--error)', marginTop: '-12px' }}>
                {errors.consent.message as string}
              </p>
            )}

            {/* Submit - KAIF style */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-scale"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '18px 32px',
                background: 'var(--text-primary)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '30px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1,
                marginTop: '8px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {isSubmitting ? t('form.fields.submitting') || 'Sending...' : t('form.fields.submit')}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 600px) {
          #form .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
});
