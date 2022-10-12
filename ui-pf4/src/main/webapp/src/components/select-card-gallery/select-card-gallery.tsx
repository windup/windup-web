import React, { useState } from "react";
import { Gallery, GalleryItem } from "@patternfly/react-core";

import { SelectCard } from "../select-card/select-card";
import { TransformationPathOption } from "layout/TransformationPaths";
import { Theme } from "layout/ThemeUtils";

export interface SelectCardGalleryProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const SelectCardGallery: React.FC<SelectCardGalleryProps> = ({
  value,
  onChange,
}) => {
  // When Option is an array e.g. EAP Card then it has a default value
  // However the default value changes after the user selects the dropdown.
  // 'selected' will keep the last selected dropdown value so it doesn't go back to
  // the original 'default' value. Map<'card.label', 'last card's selected dropdown value'>()
  const [selected, setSelected] = useState<Map<string, string>>(new Map());

  const isCardSelected = (
    cardOptions: string | { label: string; value: string }[]
  ): boolean => {
    if (typeof cardOptions === "string") {
      return value.includes(cardOptions);
    } else {
      const keyValues = cardOptions.map((k) => k.value);
      return value.some((f) => keyValues.includes(f));
    }
  };

  const getCardValue = (card: TransformationPathOption): string => {
    if (typeof card.options === "string") {
      return card.options;
    } else {
      const keyValues = card.options.map((k) => k.value);
      const intersection = value.filter((f) => keyValues.includes(f));
      return intersection.length > 0
        ? intersection[0]
        : selected.get(card.label) ||
            card.options.find((f) => f.default)?.value ||
            card.options[0].value;
    }
  };

  const handleOnCardChange = (
    isSelected: boolean,
    selectionValue: string,
    card: TransformationPathOption
  ) => {
    const optionsValue: string[] = Array.isArray(card.options)
      ? card.options.map((f) => f.value)
      : [card.options];

    const newValue = value.filter((f) => !optionsValue.includes(f));
    if (isSelected) {
      onChange([...newValue, selectionValue]);
    } else {
      onChange(newValue);
    }

    setSelected((previous) =>
      new Map(previous).set(card.label, selectionValue)
    );
  };

  return (
    <Gallery hasGutter>
      {Theme.transformationPaths.map((elem, index) => (
        <GalleryItem key={index}>
          <SelectCard
            label={elem.label}
            description={elem.description}
            options={elem.options}
            icon={elem.icon}
            iconSrc={elem.iconSrc}
            isSelected={isCardSelected(elem.options)}
            value={getCardValue(elem)}
            onChange={(isSelected, selectionValue) => {
              handleOnCardChange(isSelected, selectionValue, elem);
            }}
            isNew={elem.isNew}
          />
        </GalleryItem>
      ))}
    </Gallery>
  );
};
