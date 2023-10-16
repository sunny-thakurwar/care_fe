import { UserBaseModel } from "../../Users/models";

export type ConsentPurpose =
  | "CAREMGT"
  | "BTG"
  | "PUBHLTH"
  | "HPAYMT"
  | "DSRCH"
  | "PATRQT";

export type ConsentStatus =
  | "REQUESTED"
  | "GRANTED"
  | "DENIED"
  | "EXPIRED"
  | "REVOKED";

export type ConsentHIType =
  | "Prescription"
  | "DiagnosticReport"
  | "OPConsultation"
  | "DischargeSummary"
  | "ImmunizationRecord"
  | "HealthDocumentRecord"
  | "WellnessRecord";

export type ConsentAccessMode = "VIEW" | "STORE" | "QUERY" | "STREAM";

export type ConsentFrequencyUnit = "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";

export type ConsentCareContext = {
  patientReference: string;
  careContextReference: string;
};

export type ConsentModel = {
  id: string;
  consent_id: null | string;

  patient_abha: string;
  care_contexts: ConsentCareContext[];

  purpose: ConsentPurpose;
  hi_types: ConsentHIType[];

  access_mode: ConsentAccessMode;
  from_time: string;
  to_time: string;
  expiry: string;

  frequency_unit: ConsentFrequencyUnit;
  frequency_value: number;
  frequency_repeats: number;

  hip: null | string;
  hiu: null | string;

  created_date: string;
  modified_date: string;
};

export type ConsentArtefactModel = {
  consent_request: string;

  status: ConsentStatus;

  cm: null | string;
} & ConsentModel;

export type ConsentRequestModel = {
  requester: UserBaseModel;
  consent_artefacts: ConsentArtefactModel[];
} & ConsentModel;