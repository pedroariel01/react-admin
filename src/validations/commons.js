function validate(value) {
  if (value.length > 0) return "success";
  return "error";
}

function disabledButton(state) {
  const { host, database, user, password, schema, table, delimiter } = state;

  if (
    host.isValid === "error" ||
    database.isValid === "error" ||
    user.isValid === "error" ||
    password.isValid === "error" ||
    schema.isValid === "error" ||
    table.isValid === "error" ||
    delimiter.isValid === "error"
  ) {
    return true;
  }

  return false;
}

function requireDisabledButton(state, fields_validate) {
  for (let k in state) {
    if (
      fields_validate.find(item => item === k) &&
      (state[k].isValid === "error" || state[k].isValid == null)
    ) {
      return true;
    }
  }

  return false;
}

export { validate, disabledButton, requireDisabledButton };
