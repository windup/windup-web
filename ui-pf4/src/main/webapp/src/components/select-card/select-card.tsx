import * as React from "react";
import {
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateVariant,
  Card,
  CardBody,
  Bullseye,
  Select,
  SelectOption,
  SelectVariant,
  SelectOptionObject,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";

import "./select-card.scss";
import { useState } from "react";

interface CardSelectOption {
  value: string;
  label: string;
}

export interface SelectCardProps {
  label: string;
  options: string | CardSelectOption[];
  icon?: React.ComponentType<any>;
  isSelected: boolean;
  value: string;
  onChange: (isSelected: boolean, value: string) => void;
}

export const SelectCard: React.FC<SelectCardProps> = ({
  label,
  options,
  icon,
  isSelected,
  value,
  onChange,
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleCardClick = (event: React.MouseEvent) => {
    // Workaround to stop 'select' event propagation
    const eventTarget: any = event.target;
    if (eventTarget.type === "button") {
      return;
    }

    if (Array.isArray(options)) {
      onChange(!isSelected, value);
    } else {
      onChange(!isSelected, value || options);
    }
  };

  const handleSelectToggle = (isOpen: boolean) => {
    setIsSelectOpen(isOpen);
  };

  const handleSelectSelection = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string | SelectOptionObject
  ) => {
    event.stopPropagation();
    setIsSelectOpen(false);
    onChange(true, selection as any);
  };

  return (
    <Card
      onClick={handleCardClick}
      isSelectable
      isSelected={isSelected}
      className="select-card__component__wrapper"
    >
      <CardBody>
        <Bullseye>
          <EmptyState
            variant={EmptyStateVariant.small}
            className="select-card__component__empty-state"
          >
            <EmptyStateIcon icon={icon ? icon : CubesIcon} />
            <Title headingLevel="h4" size="md">
              {label}
            </Title>
            {Array.isArray(options) && (
              <Select
                variant={SelectVariant.single}
                aria-label="Select Input"
                onToggle={handleSelectToggle}
                onSelect={handleSelectSelection}
                selections={value}
                isOpen={isSelectOpen}
                direction="down"
              >
                {options.map((el, index) => (
                  <SelectOption key={index} value={el.value} />
                ))}
              </Select>
            )}
          </EmptyState>
        </Bullseye>
      </CardBody>
    </Card>
  );
};
