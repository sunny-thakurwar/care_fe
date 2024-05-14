import { ICreateHealthIdRequest } from "../Components/ABDM/models";
import { HCXClaimModel, HCXPolicyModel } from "../Components/HCX/models";
import { fireRequest } from "./fireRequest";

// Facility
export const getUserList = (params: object, key?: string) => {
  return fireRequest("userList", [], params, null, key);
};

export const getFacilityUsers = (id: string, params?: object) => {
  return fireRequest(
    "getFacilityUsers",
    [],
    { ...params },
    { facility_id: id },
  );
};

// asset bed
export const listAssetBeds = (params: object, altKey?: string) =>
  fireRequest("listAssetBeds", [], params, {}, altKey);

export const partialUpdateAssetBed = (params: object, asset_id: string) =>
  fireRequest(
    "partialUpdateAssetBed",
    [],
    { ...params },
    {
      external_id: asset_id,
    },
  );

export const deleteAssetBed = (asset_id: string) =>
  fireRequest(
    "deleteAssetBed",
    [],
    {},
    {
      external_id: asset_id,
    },
  );

// Download Actions
export const downloadFacility = () => {
  return fireRequest("downloadFacility");
};

export const downloadFacilityCapacity = () => {
  return fireRequest("downloadFacilityCapacity");
};

export const downloadFacilityDoctors = () => {
  return fireRequest("downloadFacilityDoctors");
};

export const downloadFacilityTriage = () => {
  return fireRequest("downloadFacilityTriage");
};

//Patient
export const getAllPatient = (params: object, altKey: string) => {
  return fireRequest("patientList", [], params, null, altKey);
};
export const getPatient = (pathParam: object) => {
  return fireRequest("getPatient", [], {}, pathParam);
};

// District/State/Local body/ward
export const getDistrictByName = (params: object) => {
  return fireRequest("getDistrictByName", [], params, null);
};

// Sample Test
export const downloadSampleTests = (params: object) => {
  return fireRequest("getTestSampleList", [], { ...params, csv: 1 });
};

// Consultation
export const getConsultation = (id: string) => {
  return fireRequest("getConsultation", [], {}, { id: id });
};

export const generateDischargeSummary = (pathParams: object) => {
  return fireRequest("dischargeSummaryGenerate", [], {}, pathParams);
};
export const previewDischargeSummary = (pathParams: object) => {
  return fireRequest(
    "dischargeSummaryPreview",
    [],
    {},
    pathParams,
    undefined,
    true,
  );
};
export const emailDischargeSummary = (params: object, pathParams: object) => {
  return fireRequest("dischargeSummaryEmail", [], params, pathParams);
};
export const dischargePatient = (params: object, pathParams: object) => {
  return fireRequest("dischargePatient", [], params, pathParams);
};

//Shift
export const listShiftRequests = (params: object, key: string) => {
  return fireRequest("listShiftRequests", [], params, null, key);
};

export const downloadShiftRequests = (params: object) => {
  return fireRequest("downloadShiftRequests", [], params);
};

// External Results
export const externalResultList = (params: object, altKey: string) => {
  return fireRequest("externalResultList", [], params, null, altKey);
};

// Resource
export const downloadResourceRequests = (params: object) => {
  return fireRequest("downloadResourceRequests", [], params);
};

export const listAssets = (params: object) =>
  fireRequest("listAssets", [], params);
export const operateAsset = (id: string, params: object) =>
  fireRequest("operateAsset", [], params, { external_id: id });

export const listAssetTransaction = (params: object) =>
  fireRequest("listAssetTransaction", [], params);
export const getAssetTransaction = (id: string) =>
  fireRequest("getAssetTransaction", [], {}, { id });

export const listAssetService = (params: object, asset_external_id: string) =>
  fireRequest("listAssetService", [], params, { asset_external_id });
export const getAssetService = (
  params: object,
  asset_external_id: string,
  external_id: string,
) =>
  fireRequest("getAssetService", [], params, {
    asset_external_id,
    external_id,
  });
export const updateAssetService = (
  asset_external_id: string,
  external_id: string,
  params: object,
) =>
  fireRequest("updateAssetService", [], params, {
    asset_external_id,
    external_id,
  });

// ABDM related
export const generateAadhaarOtp = (aadhaar: string) =>
  fireRequest("generateAadhaarOtp", [], { aadhaar });

export const resentAadhaarOtp = (txnId: string) =>
  fireRequest("resendAadhaarOtp", [], { txnId });

export const verifyAadhaarOtp = (txnId: string, otp: string) =>
  fireRequest("verifyAadhaarOtp", [], { txnId, otp });

export const generateMobileOtp = (txnId: string, mobile: string) =>
  fireRequest("generateMobileOtp", [], { txnId, mobile });

export const checkAndGenerateMobileOtp = (txnId: string, mobile: string) =>
  fireRequest("checkAndGenerateMobileOtp", [], { txnId, mobile });

export const verifyMobileOtp = (txnId: string, otp: string) =>
  fireRequest("verifyMobileOtp", [], { txnId, otp });

export const createHealthId = (data: ICreateHealthIdRequest) =>
  fireRequest("createHealthId", [], data);

export const searchByHealthId = (healthId: string) =>
  fireRequest("searchByHealthId", [], { healthId });

export const initiateAbdmAuthentication = (
  authMethod: string,
  healthid: string,
) => fireRequest("initiateAbdmAuthentication", [], { authMethod, healthid });

export const confirmWithAadhaarOtp = (
  txnId: string,
  otp: string,
  patientId?: string,
) => fireRequest("confirmWithAadhaarOtp", [], { txnId, otp, patientId });

export const confirmWithMobileOtp = (
  txnId: string,
  otp: string,
  patientId?: string,
) => fireRequest("confirmWithMobileOtp", [], { txnId, otp, patientId });

export const linkViaQR = (abha_details: any, patientId?: string) => {
  return fireRequest("linkViaQR", [], {
    ...abha_details,
    patientId,
  });
};

export const linkCareContext = (
  consultationId: string,
  data: { name?: string; gender?: "M" | "F" | "O"; dob?: string },
) => {
  return fireRequest("linkCareContext", [], {
    consultation: consultationId,
    ...data,
  });
};

export const getAbhaCard = (patient: string, type: "pdf" | "png") => {
  return fireRequest("getAbhaCard", [], {
    patient,
    type,
  });
};

export const getHealthInformation = (artefactId: string) => {
  return fireRequest("getHealthInformation", [], { artefactId });
};

export const healthFacilityActions = {
  list: (params: object) => {
    return fireRequest("listHealthFacilities", [], params);
  },

  create: (data: object) => {
    return fireRequest("createHealthFacility", [], data);
  },

  read: (id: string) => {
    return fireRequest(
      "getHealthFacility",
      [],
      {},
      { facility_id: id },
      undefined,
      true,
    );
  },

  update: (id: string, data: object) => {
    return fireRequest("updateHealthFacility", [], data, {
      facility_id: id,
    });
  },

  partialUpdate: (id: string, data: object) => {
    return fireRequest("partialUpdateHealthFacility", [], data, {
      facility_id: id,
    });
  },

  registerService: (id: string) => {
    return fireRequest(
      "registerHealthFacilityAsService",
      [],
      {},
      { facility_id: id },
    );
  },
};

export const consentActions = {
  list: (params: object) => {
    return fireRequest("listConsents", [], params);
  },

  create: (data: object) => {
    return fireRequest("createConsent", [], data);
  },

  read: (id: string) => {
    return fireRequest("getConsent", [], {}, { id });
  },

  status: (id: string) => {
    return fireRequest("checkConsentStatus", [], {}, { id }, undefined, true);
  },
};

export const patientsActions = {
  find: (params: object) => {
    return fireRequest("findPatients", [], params);
  },
};

export const listAssetAvailability = (params: object) =>
  fireRequest("listAssetAvailability", [], params);
export const getAssetAvailability = (id: string) =>
  fireRequest("getAssetAvailability", [], {}, { id });

export const listPMJYPackages = (query?: string) =>
  fireRequest("listPMJYPackages", [], { query });

// HCX Actions
export const HCXActions = {
  checkEligibility: (policy: string) => {
    return fireRequest("hcxCheckEligibility", [], { policy });
  },

  payors: {
    list(query: string) {
      return fireRequest("hcxListPayors", [], { query });
    },
  },

  policies: {
    list(params: object) {
      return fireRequest("listHCXPolicies", [], params);
    },
    create(obj: HCXPolicyModel) {
      return fireRequest("createHCXPolicy", [], obj);
    },
    read(id: string) {
      return fireRequest("getHCXPolicy", [], {}, { external_id: id });
    },
    update(id: string, obj: HCXPolicyModel) {
      return fireRequest("updateHCXPolicy", [], obj, { external_id: id });
    },
    partialUpdate(id: string, obj: Partial<HCXPolicyModel>) {
      return fireRequest("partialUpdateHCXPolicy", [], obj, {
        external_id: id,
      });
    },
    delete(id: string) {
      return fireRequest("deleteHCXPolicy", [], {}, { external_id: id });
    },
  },

  claims: {
    list(params: object) {
      return fireRequest("listHCXClaims", [], params);
    },
    create(obj: object) {
      return fireRequest("createHCXClaim", [], obj);
    },
    read(id: string) {
      return fireRequest("getHCXClaim", [], {}, { external_id: id });
    },
    update(id: string, obj: HCXClaimModel) {
      return fireRequest("updateHCXClaim", [], obj, { external_id: id });
    },
    partialUpdate(id: string, obj: Partial<HCXClaimModel>) {
      return fireRequest("partialUpdateHCXClaim", [], obj, {
        external_id: id,
      });
    },
    delete(id: string) {
      return fireRequest("deleteHCXClaim", [], {}, { external_id: id });
    },
  },

  preauths: {
    list(consultation: string) {
      return fireRequest(
        "listHCXClaims",
        [],
        {
          consultation,
          ordering: "-modified_date",
          use: "preauthorization",
        },
        {},
        `listPreAuths-${consultation}`,
      );
    },
  },

  makeClaim(claim: string) {
    return fireRequest("hcxMakeClaim", [], { claim });
  },
};
