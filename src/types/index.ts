export type ServiceType = 'fraud' | 'business';

export type MessengerType = 'whatsapp' | 'telegram' | 'line';

export type RequestStatus = 'new' | 'in_progress' | 'resolved' | 'rejected';

export interface BaseFormData {
  name: string;
  service_type: ServiceType;
  messenger_type: MessengerType;
  messenger_contact: string;
  city: string;
  description: string;
  consent: boolean;
  lang: 'ru' | 'en';
}

export interface FraudExtraFields {
  fraud_type: string;
  amount: number;
  currency: string;
  has_evidence: boolean;
}

export interface BusinessExtraFields {
  business_sphere: string;
  dispute_amount?: number;
  has_documents: boolean;
}

export type ExtraFields = FraudExtraFields | BusinessExtraFields;

export interface RequestData extends BaseFormData {
  extra_fields?: ExtraFields;
  file_urls?: string[];
}

export interface ServiceConfig {
  id: ServiceType;
  icon: string;
  titleKey: string;
  subtitleKey: string;
}

export interface FAQItem {
  questionKey: string;
  answerKey: string;
}

export interface StepConfig {
  number: string;
  titleKey: string;
  descriptionKey: string;
}

export interface AdvantageConfig {
  icon: string;
  titleKey: string;
  descriptionKey: string;
}
