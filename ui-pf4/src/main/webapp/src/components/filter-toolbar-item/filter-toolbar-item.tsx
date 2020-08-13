import * as React from "react";
import { ToolbarGroup, ToolbarItem, TextInput } from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

export interface FilterToolbarItemProps {
  onFilterChange: (
    value: string,
    event: React.FormEvent<HTMLInputElement>
  ) => void;
  placeholder: string;
  searchValue?: string;
  isCompact?: boolean;
}

export const FilterToolbarItem: React.FC<FilterToolbarItemProps> = ({
  isCompact,
  searchValue,
  onFilterChange,
  placeholder,
}) => {
  return (
    <ToolbarGroup>
      <ToolbarItem>
        <div className={`toolbar-filter-input-group${isCompact ? "-c" : ""}`}>
          <TextInput
            placeholder={placeholder}
            value={searchValue}
            type="text"
            onChange={onFilterChange}
            aria-label={placeholder}
          />
          <SearchIcon />
        </div>
      </ToolbarItem>
    </ToolbarGroup>
  );
};
