import React from "react";
import { Pagination, PaginationVariant } from "@patternfly/react-core";
import { Constants } from "../../Constants";

export interface SimplePaginationProps {
  count: number;
  params: {
    perPage?: number;
    page?: number;
  };

  isTop?: boolean;
  isCompact?: boolean;
  perPageOptions?: number[];
  onChange: ({ page, perPage }: { page: number; perPage: number }) => void;
}

export const SimplePagination: React.FC<SimplePaginationProps> = ({
  count,
  params,
  isTop,
  isCompact,
  perPageOptions,
  onChange,
}) => {
  const mapPerPageOptions = (options: number[]) => {
    return options.map((option) => ({
      title: String(option),
      value: option,
    }));
  };

  const getPerPage = () => {
    return params.perPage || Constants.DEFAULT_PAGE_SIZE;
  };

  return (
    <Pagination
      itemCount={count}
      page={params.page || 1}
      perPage={getPerPage()}
      onPageInput={(_, page) => {
        onChange({ page, perPage: getPerPage() });
      }}
      onSetPage={(_, page) => {
        onChange({ page, perPage: getPerPage() });
      }}
      onPerPageSelect={(_, perPage) => {
        onChange({ page: 1, perPage });
      }}
      isCompact={isTop || isCompact}
      widgetId="pagination-options-menu"
      variant={isTop ? PaginationVariant.top : PaginationVariant.bottom}
      perPageOptions={mapPerPageOptions(
        perPageOptions || Constants.DEFAULT_PAGINATION_OPTIONS
      )}
    />
  );
};
