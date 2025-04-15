const permissions = {
  SuperAdmin: [
    {
      id: "user_per-01",
      permission: "USER_MANAGEMENT",
    },
    {
      id: "user_per-02",
      permission: "LEAD_MANAGEMENT",
    },
    {
      id: "user_per-05",
      permission: "CONTACT_MANAGMENT",
    },
    {
      id: "user_per-06",
      permission: "SALES_MANAGEMENT",
    },
    {
      id: "user_per-07",
      permission: "MARKETING_MANAGEMENT",
    },
    {
      id: "user_per-08",
      permission: "CUSTOM_SERVICES",
    },
    {
      id: "user_per-09",
      permission: "EMAIL_INTEGRATION",
    },
    {
      id: "user_per-10",
      permission: "DOC_MANAGEMENT",
    },
    {
      id: "user_per-12",
      permission: "SOCIAL_MEDIA_MANAGEMENt",
    },
    {
      id: "user_per-03",
      permission: "TRANING",
    },
    {
      id: "user_per-15",
      permission: "REPORTNIG",
    },
    {
      id: "user_per-16",
      permission: "HR_MANAGEMENT",
    },
    {
      id: "user_per-198",
      permission: "FINANCE_MANAGEMENT",
    },
    {
      id: "user_per-25",
      permission: "REPORTING_ATS",
    },
  ],

  AdminDm: [
    {
      id: "user_per-01",
      permission: "USER_MANAGEMENT",
    },
    {
      id: "user_per-02",
      permission: "LEAD_MANAGEMENT",
    },
    {
      id: "user_per-05",
      permission: "CONTACT_MANAGMENT",
    },
    {
      id: "user_per-06",
      permission: "SALES_MANAGEMENT",
    },
    {
      id: "user_per-07",
      permission: "MARKETING_MANAGEMENT",
    },
    {
      id: "user_per-08",
      permission: "CUSTOM_SERVICES",
    },
    {
      id: "user_per-09",
      permission: "EMAIL_INTEGRATION",
    },
    {
      id: "user_per-10",
      permission: "DOC_MANAGEMENT",
    },
    {
      id: "user_per-12",
      permission: "SOCIAL_MEDIA_MANAGEMENt",
    },
    {
      id: "user_per-03",
      permission: "TRANING",
    },
    {
      id: "user_per-15",
      permission: "REPORTNIG",
    },
    {
      id: "user_per-16",
      permission: "HR_MANAGEMENT",
    },
  ],

  AdminEM: [
    {
      id: "user_per-25",
      permission: "REPORTING_ATS",
    },
  ],

  Counselor: [
    {
      id: "user_per-01",
      permission: "USER_MANAGEMENT",
    },
    {
      id: "user_per-27",
      permission: "LEAD_MANAGEMENT",
    },
    {
      id: "user_per-28",
      permission: "MARKETING_MANAGEMENT",
    },
    {
      id: "user_per-29",
      permission: "SALES_MANAGEMENT",
    },
    {
      id: "user_per-31",
      permission: "DOC_MANAGEMENT",
    },
  ],

  Telecaller: [
    
    {
      id: "user_per-01",
      permission: "USER_MANAGEMENT",
    },
    {
      id: "user_per-33",
      permission: "SALES_MANAGEMENT",
    },
    {
      id: "user_per-34",
      permission: "LEAD_MANAGEMENT",
    },
    {
      id: "user_per-35",
      permission: "CONTACT_MANAGMENT",
    },
    {
      id: "user_per-36",
      permission: "DOC_MANAGEMENT",
    },
    {
      id: "user_per-37",
      permission: "EMAIL_INTEGRATION",
    },
  ],

  HrManager: [
    {
      id: "user_per-25",
      permission: "REPORTING_ATS",
    },
  ],

  HrExecutive: [
    {
      id: "user_per-25",
      permission: "REPORTING_ATS",
    },
  ],

  Recruiter: [
    {
      id: "user_per-25",
      permission: "REPORTING_ATS",
    },
  ],

  FinanceManager: [
    {
      id: "user_per-41",
      permission: "FINANCE_MANAGEMENT",
    },
  ],

  FinanceExicutive: [
    {
      id: "user_per-43",
      permission: "FINANCE_MANAGEMENT",
    },
  ],

  Trainer: [
    {
      id: "user_per-44",
      permission: "TRANING_MANAGEMENT",
    },
    {
      id: "user_per-45",
      permission: "DOC_MANAGEMENT",
    },
  ],

  Tranee: [
    {
      id: "user_per-46",
      permission: "TRANING_MANAGEMENT",
    },
    {
      id: "user_per-47",
      permission: "STUDENT_MANAGEMENT",
    },
  ],

  VendorManagementManager: [
    {
      id: "user_per-07",
      permission: "MARKETING_MANAGEMENT",
    },
    {
      id: "user_per-01",
      permission: "USER_MANAGEMENT",
    },
  ],

  VendorManagementExecutive: [
    {
      id: "user_per-07",
      permission: "MARKETING_MANAGEMENT",
    },
    {
      id: "user_per-01",
      permission: "USER_MANAGEMENT",
    },
  ],

  MarketingManager: [
    {
      id: "user_per-07",
      permission: "MARKETING_MANAGEMENT",
    },
    {
      id: "user_per-01",
      permission: "USER_MANAGEMENT",
    },
  ],

  MarketingExecutive: [
    {
      id: "user_per-07",
      permission: "MARKETING_MANAGEMENT",
    },
    {
      id: "user_per-01",
      permission: "USER_MANAGEMENT",
    },
  ],
};

const rolePermissions = (key) => {
  switch (key) {
    case "SuperAdmin":
      return JSON.stringify(permissions?.SuperAdmin);
    case "AdminDm":
      return JSON.stringify(permissions?.AdminDm);
    case "AdminEM":
      return JSON.stringify(permissions?.AdminEM);
    case "Counselor":
      return JSON.stringify(permissions?.Counselor);
    case "Telecaller":
      return JSON.stringify(permissions?.Telecaller);
    case "HrManager":
      return JSON.stringify(permissions?.HrManager);
    case "HrExecutive":
      return JSON.stringify(permissions?.HrExecutive);
    case "Recruiter":
      return JSON.stringify(permissions?.Recruiter);
    case "FinanceManager":
      return JSON.stringify(permissions?.FinanceManager);
    case "FinanceExicutive":
      return JSON.stringify(permissions?.FinanceExicutive);
    case "FinanceExicutive":
      return JSON.stringify(permissions?.Trainer);
    case "Tranee":
      return JSON.stringify(permissions?.Tranee);
    case "VendorManagementManager":
      return JSON.stringify(permissions?.VendorManagementManager);
    case "VendorManagementExecutive":
      return JSON.stringify(permissions?.VendorManagementExecutive);
    case "MarketingManager":
      return JSON.stringify(permissions?.MarketingManager);
    case "MarketingExecutive":
      return JSON.stringify(permissions?.MarketingExecutive);
    default:
      break;
  }
};

module.exports = rolePermissions;
