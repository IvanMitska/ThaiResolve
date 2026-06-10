import type { ServiceConfig, AdvantageConfig, StepConfig } from '../types';

export const services: ServiceConfig[] = [
  {
    id: 'fraud',
    icon: '01',
    titleKey: 'services.fraud.title',
    subtitleKey: 'services.fraud.subtitle',
  },
  {
    id: 'business',
    icon: '02',
    titleKey: 'services.business.title',
    subtitleKey: 'services.business.subtitle',
  },
];

export const advantages: AdvantageConfig[] = [
  {
    icon: '01',
    titleKey: 'advantages.network.title',
    descriptionKey: 'advantages.network.description',
  },
  {
    icon: '02',
    titleKey: 'advantages.system.title',
    descriptionKey: 'advantages.system.description',
  },
  {
    icon: '03',
    titleKey: 'advantages.speed.title',
    descriptionKey: 'advantages.speed.description',
  },
  {
    icon: '04',
    titleKey: 'advantages.privacy.title',
    descriptionKey: 'advantages.privacy.description',
  },
];

export const steps: StepConfig[] = [
  {
    number: '01',
    titleKey: 'steps.request.title',
    descriptionKey: 'steps.request.description',
  },
  {
    number: '02',
    titleKey: 'steps.evaluation.title',
    descriptionKey: 'steps.evaluation.description',
  },
  {
    number: '03',
    titleKey: 'steps.strategy.title',
    descriptionKey: 'steps.strategy.description',
  },
  {
    number: '04',
    titleKey: 'steps.result.title',
    descriptionKey: 'steps.result.description',
  },
];

export const cities = [
  'Bangkok',
  'Phuket',
  'Pattaya',
  'Chiang Mai',
  'Samui',
  'Krabi',
  'Hua Hin',
  'Other',
];

export const fraudTypes = [
  { value: 'purchase', labelKey: 'form.fraud.types.purchase' },
  { value: 'rental', labelKey: 'form.fraud.types.rental' },
  { value: 'investment', labelKey: 'form.fraud.types.investment' },
  { value: 'online_scam', labelKey: 'form.fraud.types.online_scam' },
  { value: 'crypto', labelKey: 'form.fraud.types.crypto' },
  { value: 'other', labelKey: 'form.fraud.types.other' },
];

export const currencies = ['THB', 'USD', 'RUB', 'EUR', 'USDT'];
