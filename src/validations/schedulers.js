function isNormalInteger(str) {
  return /^\+?(0|[1-9]\d*)$/.test(str);
}

function validate(name, value) {
  if (name === "params" || name === "crontab_string") {
    if (value.length > 0) return "success";
    return "error";
  }
}

function disabledButton(state) {
  const { params, crontab_string } = state;

  if (params.isValid === "error" || params.isValid == null) return true;
  if (crontab_string.isValid === "error" || crontab_string.isValid == null)
    return true;

  return false;
}

export { validate, disabledButton };
