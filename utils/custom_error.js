const err = {
  errorLogin: {
    message: "An error occurred during login",
    statusCode: 400,
  },
  errorCreate: {
    message: "An error occurred while adding data",
    statusCode: 400,
  },
  errorUpdate: {
    message: "An error occurred while changing data",
    statusCode: 400,
  },
  errorDelete: {
    message: "An error occurred while deleting data",
    statusCode: 400,
  },
  errorSelect: {
    message: "An error occurred while displaying data",
    statusCode: 400,
  },
  errorChangePassword: {
    message: "An error occurred while changing the password",
    statusCode: 400,
  },
  errorChangeRole: {
    message: "An error occurred while changing the user role",
    statusCode: 400,
  },
  errorLogout: {
    message: "An error occurred while logging out",
    statusCode: 400,
  },
  errorRequest: {
    message: "An error occurred while processing your request.",
    statusCode: 400,
  },
  errorReset: {
    message: "An error occurred while resetting your request.",
    statusCode: 400,
  },
};

const mapMySQLError = (error) => {
  switch (error.code) {
    case "ER_DUP_ENTRY": {
      const match = error.sqlMessage.match(
        /Duplicate entry '(.+)' for key '(.+)'/
      );
      if (match) {
        const [_, value] = match;
        return `The value "${value}" already exists.`;
      }
      return "Duplicate entry detected. Please use unique data.";
    }
    case "ER_NO_SUCH_TABLE": {
      const match = error.sqlMessage.match(/Table '(.+)' doesn't exist/);
      if (match) {
        const tableName = match[1];
        return `The table "${tableName}" does not exist. Please check the table name.`;
      }
      return "The requested table does not exist.";
    }
    case "ER_BAD_FIELD_ERROR": {
      const match = error.sqlMessage.match(/Unknown column '(.+)' in '(.+)'/);
      if (match) {
        const [_, column, context] = match;
        return `The column "${column}" is not valid in the context "${context}". Please verify the column name.`;
      }
      return "Invalid column name detected. Please verify the query.";
    }
    case "ER_ROW_IS_REFERENCED_2":
      return "This record cannot be deleted or updated because it is referenced by another record in a related table. Please ensure that no related records exist before making changes.";
    case "ER_PARSE_ERROR":
      return "The SQL query syntax is invalid. Please check the SQL statement.";
    default:
      return "An error occurred on the server. Please try again later.";
  }
};

module.exports = {
  err,
  mapMySQLError,
};
