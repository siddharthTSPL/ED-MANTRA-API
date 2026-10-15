// One-time script: purane candidates ke blank/NULL fields ko "NA" kar deta hai.
// Run:  node scripts/backfillNA.js
// (Pehle DB ka backup le lena.)
require("dotenv").config();
const sequelize = require("../connections/db");
const { NA_FIELDS } = require("../utils/naDefaults");

(async () => {
  try {
    const t = '"CandidateManagement"';
    for (const f of NA_FIELDS) {
      const [, meta] = await sequelize.query(
        `UPDATE ${t} SET "${f}" = 'NA' WHERE "${f}" IS NULL OR TRIM("${f}") IN ('', 'null', 'undefined')`
      );
      console.log(`${f}: ${meta.rowCount ?? 0} rows updated`);
    }

    // language JSONB
    const [, langMeta] = await sequelize.query(
      `UPDATE ${t} SET "language" = '["NA"]'::jsonb
       WHERE "language" IS NULL OR "language" = '[]'::jsonb OR "language" = '""'::jsonb`
    );
    console.log(`language: ${langMeta.rowCount ?? 0} rows updated`);

    console.log("Done.");
    process.exit(0);
  } catch (err) {
    console.error("Backfill failed:", err);
    process.exit(1);
  }
})();