export const getValidatedFromError = (
  error: any
): "success" | "warning" | "error" | "default" => {
  return error ? "error" : "default";
};

export const getValidatedFromErrorTouched = (
  error: any,
  touched: boolean | undefined
): "success" | "warning" | "error" | "default" => {
  return error && touched ? "error" : "default";
};
