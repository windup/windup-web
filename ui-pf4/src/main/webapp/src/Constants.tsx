export class Constants {
  static readonly DEFAULT_PAGE_SIZE = 10;
  static readonly DEFAULT_PAGINATION_OPTIONS = [10, 20, 50, 100];
}

export const getDeleteSuccessAlertModel = (type: string) => ({
  variant: "success",
  title: "Success",
  description: `${type} deleted successfully`,
});

export const getDeleteErrorAlertModel = (type: string) => ({
  variant: "danger",
  title: "Error",
  description: `Error while deleting ${type}`,
});
