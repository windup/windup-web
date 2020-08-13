import * as React from "react";
import {
  OverflowMenu,
  OverflowMenuItem,
  Select,
  SelectVariant,
  OptionsMenu,
  OptionsMenuToggle,
  SelectOption,
  SelectOptionObject,
} from "@patternfly/react-core";
import {
  FilterIcon,
  SortAmountUpIcon,
  SortAmountDownIcon,
} from "@patternfly/react-icons";

export interface SortByMenuProps {
  options: Array<string | SelectOptionObject>;
  onChange: (option: string | SelectOptionObject, asc: boolean) => void;
}

export const SortByMenu: React.FC<SortByMenuProps> = ({
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | SelectOptionObject>(
    options[0]
  );

  const onToggle = (isExpanded: boolean) => {
    setIsOpen(isExpanded);
  };

  const onSelect = (
    _: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject
  ) => {
    setSelected(value);
    setIsOpen(false);

    onChange(selected, false);
  };

  return (
    <OverflowMenu breakpoint="md">
      <OverflowMenuItem isPersistent>
        <Select
          variant={SelectVariant.single}
          aria-label="Select sort by"
          aria-labelledby="page-layout-table-column-management-action-toolbar-top-select-checkbox-label page-layout-table-column-management-action-toolbar-top-select-checkbox-toggle"
          placeholderText={
            <>
              <FilterIcon /> {selected}
            </>
          }
          onToggle={onToggle}
          onSelect={onSelect}
          selections={selected}
          isOpen={isOpen}
        >
          {options.map((el, index) => (
            <SelectOption key={index} value={el} />
          ))}
        </Select>
      </OverflowMenuItem>
      <OverflowMenuItem>
        <OptionsMenu
          id="page-layout-table-column-management-action-toolbar-top-options-menu-toggle"
          isPlain
          menuItems={[]}
          toggle={
            <OptionsMenuToggle
              toggleTemplate={<SortAmountDownIcon aria-hidden="true" />}
              aria-label="Sort by"
              // onToggle={(a: boolean) => console.log(a)}
              onClick={() => console.log("a")}
              hideCaret
            />
          }
        />
      </OverflowMenuItem>
    </OverflowMenu>
  );
};
