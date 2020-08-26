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
  SelectVariant,
  SelectOptionObject,
  SelectOption,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";

import "./select-card.scss";
import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

export interface SelectCardProps {
  label: string;
  value: string | Option[];
  icon?: React.ComponentType<any>;
  onChange: (isSelected: boolean, value: string) => void;
}

export const SelectCard: React.FC<SelectCardProps> = ({
  label,
  value,
  icon,
  onChange,
}) => {
  const [isCardSelected, setIsCardSelected] = useState(false);

  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectValues, setSelectValues] = useState<string | SelectOptionObject>(
    Array.isArray(value) ? value[0].value : ""
  );

  const handleCardClick = (event: React.MouseEvent) => {
    // Workaround to stop 'select' event propagation
    const eventTarget: any = event.target;
    if (eventTarget.type === "button") {
      return;
    }

    setIsCardSelected((previous) => {
      const newValue = !previous;

      if (Array.isArray(value)) {
        onChange(newValue, selectValues as any);
      } else {
        onChange(newValue, value);
      }

      return newValue;
    });
  };

  const handleSelectToggle = (isOpen: boolean) => {
    setIsSelectOpen(isOpen);
  };

  const handleSelectSelection = (
    event: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject
  ) => {
    event.stopPropagation();

    setIsSelectOpen(false);
    setSelectValues(value);
    setIsCardSelected(true);

    onChange(true, value as any);
  };

  return (
    <Card
      onClick={handleCardClick}
      isSelectable
      isSelected={isCardSelected}
      className="select-card__component__wrapper"
    >
      <CardBody>
        <Bullseye>
          <EmptyState variant={EmptyStateVariant.small}>
            <EmptyStateIcon icon={icon ? icon : CubesIcon} />
            <Title headingLevel="h4" size="md">
              {label}
            </Title>
            {Array.isArray(value) && (
              <Select
                id="carlos"
                variant={SelectVariant.single}
                aria-label="Select Input"
                onToggle={handleSelectToggle}
                onSelect={handleSelectSelection}
                selections={selectValues}
                isOpen={isSelectOpen}
                direction="down"
              >
                {value.map((el, index) => (
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
