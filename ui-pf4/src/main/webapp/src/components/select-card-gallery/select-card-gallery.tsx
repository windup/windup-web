import * as React from "react";
import { Gallery, GalleryItem } from "@patternfly/react-core";
import {
  GgIcon,
  CloudIcon,
  LinuxIcon,
  JavaIcon,
  BatteryQuarterIcon,
  AnkhIcon,
  ChildIcon,
} from "@patternfly/react-icons";

import { SelectCard } from "../select-card/select-card";

const options = [
  {
    label: "Application server migration to",
    options: [
      {
        label: "JBoss EAP 6",
        value: "eap6",
      },
      {
        label: "JBoss EAP 7",
        value: "eap7",
      },
    ],
    icon: GgIcon,
  },
  {
    label: "Containerization",
    options: "cloud-readiness",
    icon: CloudIcon,
  },
  {
    label: "Linux",
    options: "linux",
    icon: LinuxIcon,
  },
  {
    label: "Open JDK",
    options: "openjdk",
    icon: JavaIcon,
  },
  {
    label: "Camel",
    options: "camel",
    icon: AnkhIcon,
  },
  {
    label: "Quarkus",
    options: "quarkus",
    icon: BatteryQuarterIcon,
  },
  {
    label: "Red Hat Runtimes",
    options: "runtimes",
    icon: ChildIcon,
  },
];

export interface SelectCardGalleryProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const SelectCardGallery: React.FC<SelectCardGalleryProps> = ({
  value,
  onChange,
}) => {
  const isSelected = (
    cardOptions: string | { label: string; value: string }[]
  ): boolean => {
    if (typeof cardOptions === "string") {
      return value.includes(cardOptions);
    } else {
      const keyValues = cardOptions.map((k) => k.value);
      return value.some((f) => keyValues.includes(f));
    }
  };

  const getCardValue = (
    cardOptions: string | { label: string; value: string }[]
  ): string => {
    if (typeof cardOptions === "string") {
      return cardOptions;
    } else {
      const keyValues = cardOptions.map((k) => k.value);
      const intersection = value.filter((f) => keyValues.includes(f));
      return intersection.length > 0 ? intersection[0] : cardOptions[0].value;
    }
  };

  const handleOnCardChange = (
    isSelected: boolean,
    selectionValue: string,
    cardOptions: string | { label: string; value: string }[]
  ) => {
    const optionsValue: string[] = Array.isArray(cardOptions)
      ? cardOptions.map((f) => f.value)
      : [cardOptions];

    const newValue = value.filter((f) => !optionsValue.includes(f));
    if (isSelected) {
      onChange([...newValue, selectionValue]);
    } else {
      onChange(newValue);
    }
  };

  return (
    <Gallery hasGutter>
      {options.map((elem, index) => (
        <GalleryItem key={index}>
          <SelectCard
            label={elem.label}
            options={elem.options}
            icon={elem.icon}
            isSelected={isSelected(elem.options)}
            value={getCardValue(elem.options)}
            onChange={(isSelected, selectionValue) => {
              handleOnCardChange(isSelected, selectionValue, elem.options);
            }}
          />
        </GalleryItem>
      ))}
    </Gallery>
  );
};
