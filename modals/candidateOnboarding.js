const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const Onboarding = sequelize.define(
    "Onboarding",
    {

      SrNo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true, // Ensure uniqueness for SrNo
      },

      recordId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
    
    joiningDate:{

        type: DataTypes.STRING,
        allowNull:true
    },

    consultAmount: {

      type: DataTypes.STRING,
      allowNull: true,
    },
    recvAmount:{

        type: DataTypes.STRING,
        allowNull:true
    },
    balance:{

        type: DataTypes.STRING,
        allowNull:true
    },

  },
  {
    tableName: "candidateOnboarding",
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("Database and tables created successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

module.exports = Onboarding;
