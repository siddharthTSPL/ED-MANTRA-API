const express = require("express");
// const CandidateRegistration = require("./modals/ats"); // this line only fo live production due to create table 
// const Company = require("./modals/company"); // this line only for live production due to create table 
// const InterviewSchedule = require("./modals/interviewSchedule"); // this line only for live production due to create table 
// const Onboarding = require("./modals/candidateOnboarding"); // this line only for live production due to create table 
// const Onboarding = require("./modals/vacancy"); // this line only for live production due to create table 
//const Vacancy = require("./modals/vacancy"); // this line only for live production due to create table 
// const MarketingLeads = require("./modals/marketingLeads");
// const MarketingRemarks = require("./modals/marketingRemarks");
//const Location = require('./modals/locations')(sequelize, DataTypes);
//const Sector = require('./modals/sector')(sequelize, DataTypes);
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cron = require("node-cron"); // Import node-cron
require("dotenv").config();
const port = process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "500mb" }));  // Adjust as needed
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require("./routes/employee/addEmployee"));
app.use(require("./routes/otp/veryfyOtp"));
app.use(require("./routes/employee/EmpLogin"));
app.use(require("./routes/employee/changePassword"));
app.use(require("./routes/employee/getEmployee"));
app.use(require("./routes/employee/updateEmployee"));
app.use(require("./routes/employee/getAllEmployees"));
app.use(require("./routes/employee/getAllTelecallers"));
app.use(require("./routes/employee/getAllCounselor"));
app.use(require("./routes/employee/getAllAdminDm"));
app.use(require("./routes/excel/uploadLead"));
app.use(require("./routes/excel/getLead"));
app.use(require("./routes/excel/getLeadByEmpId"));
app.use(require("./routes/excel/updateLeadById"));
app.use(require("./routes/excel/regStatusLead"));
app.use(require("./routes/excel/deleteLead"));
app.use(require("./routes/excel/addLead"));
app.use(require("./routes/studentRegistration/addStudent"));
app.use(require("./routes/studentRegistration/getStudentByEmpId"));
app.use(require("./routes/studentAdmission/admitStudent"));
app.use(require("./routes/studentAdmission/getAllStudent"));
app.use(require("./routes/leadAudio/audio"));
app.use(require("./routes/leadAudio/downloadAudio"));
app.use(require("./routes/employee/getEmployeeByEmpId"));
app.use(require("./routes/excel/getRegisteredLeadbyEmpId"));
app.use(require("./routes/excel/getRegisteredLeadbyAdmin"));
app.use(require("./routes/excel/getAdmissionLeadbyEmpId"));
app.use(require("./routes/excel/getAdmissionLeadbyAdmin"));
app.use(require("./routes/excel/deleteBulkLead"));
app.use(require("./routes/reporting/reporting"));
app.use(require("./routes/ats/candidateRegistration"));
app.use(require("./routes/ats/getAllCandidates"));
app.use(require("./routes/ats/deleteCadidateById"));
app.use(require("./routes/ats/updateCandidate"));
app.use(require("./routes/excel/deadBulkLead"));
app.use(require("./routes/excel/getDeadLead"));
app.use(require("./routes/excel/recoverBulkLead"));
app.use(require("./routes/company/addCompany"));
app.use(require("./routes/company/getAllCompany"));
app.use(require("./routes/company/getAllComapnyUniquely"));
app.use(require("./routes/company/getCompanyById"));
app.use(require("./routes/company/updateCompanyById"));
app.use(require("./routes/company/deleteCompanyById"));
app.use(require("./routes/interview/addInterview"));
app.use(require("./routes/interview/getAllInterview"));
app.use(require("./routes/interview/updateInterviewScheduleById"));
app.use(require("./routes/interview/deleteInterviewById"));
app.use(require("./routes/excel/deleteOldLead"));
app.use(require("./routes/onboarding/getOnboardingCandidate"));
app.use(require("./routes/employee/getAllRecruiters"));
app.use(require("./routes/onboarding/addOnboarding"));
app.use(require("./routes/onboarding/updateOnboarding"));
app.use(require("./routes/company/getAllComapnyUniquely"));
app.use(require("./routes/interview/getJobProfileByCompany"));
app.use(require("./routes/vacancy/addVacancy"));
app.use(require("./routes/vacancy/getAllVacancy"));
app.use(require("./routes/vacancy/updateVacancyById"));
app.use(require("./routes/ats/uploadCandidate"));
app.use(require("./routes/company/uploadCompany"));
app.use(require("./routes/reporting/atsReporting"));
app.use(require("./routes/interview/getOpenVacancyByCompanyId"));
app.use(require("./routes/company/bulkAssign"));
app.use(require("./routes/vacancy/deleteVacancyById"));
const downloadDocRoutes = require("./routes/ats/downloadDoc");
app.use("/api", downloadDocRoutes);

const downloadOrgDocRoutes = require("./routes/company/downloadDoc");
app.use("/api", downloadOrgDocRoutes);
app.use(require("./routes/marketing/addMarketingLeads"));
app.use(require("./routes/marketing/getMarketingLead"));
app.use(require("./routes/marketing/updateMarketingLeads"));
app.use(require("./routes/employee/getAllMarketingManager"));
app.use(require("./routes/employee/getAllVendorManagementExecutive"));
app.use(require("./routes/employee/getAllVendorManagementManager"));
app.use(require("./routes/employee/getAllMarketingExecutive"));
app.use(require("./routes/marketing/getVendorsByEmpId"));
app.use(require("./routes/marketing/deleteMarketingLead"));
app.use(require("./routes/marketing/deleteBulkMarketingLead"));
app.use(require("./routes/marketing/uploadMarketingLead"));
app.use(require("./routes/ats/deleteBulkCandidate")); 
app.use(require("./routes/company/deleteBulkCompany")); 
app.use(require("./routes/dashboard/addNotice")); 
app.use(require("./routes/dashboard/getNotice"));
app.use(require("./routes/ats/searchCandidates"));
// app.use(require("./routes/ats/assignLocation"));
// app.use(require("./routes/ats/assignSector"));
// app.use(require("./routes/ats/CandidateRegistartionByEmpId"));
// app.use(require("./routes/ats/getCandidateByEmpId"));

// Schedule task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
  try {
    await db.ExcelData.destroy({
      where: {
        status: 'Dead Lead',
        updatedAt: {
          [Op.lt]: thirtyDaysAgo
        }
      }
    });
    console.log('Old dead leads deleted');
  } catch (error) {
    console.error('Error deleting old dead leads:', error);
  }
});

app.listen(port, () => {
  console.log(`Your server is running at port no: ${port}`);
});