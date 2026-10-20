const Company = require("./company");
const CompanyRemarks = require("./companyRemarks");

Company.hasMany(CompanyRemarks, {
    foreignKey: "companyId",
    sourceKey: "companyId",
    as: "remarks",
});

CompanyRemarks.belongsTo(Company, {
    foreignKey: "companyId",
    targetKey: "companyId",
    as: "company",
});

module.exports = {
    Company,
    CompanyRemarks,
};