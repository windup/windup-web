import * as React from "react";
import { Gallery, GalleryItem } from "@patternfly/react-core";

import { SelectCard } from "../select-card/select-card";

import jbossLogo from "img/jboss.png";
import openshiftLogo from "img/openshift.png";
import linuxLogo from "img/linux.png";
import openjdkLogo from "img/openjdk.png";
import camelLogo from "img/camel.png";
import quarkusLogo from "img/quarkus.png";
import rhRuntimesLogo from "img/rh-runtimes.png";

interface TransformationPathOption {
  label: string;
  options: string | MultipleOptions[];
  icon?: React.ComponentType<any>;
  iconSrc?: string;
}

interface MultipleOptions {
  label: string;
  value: string;
}

const options: TransformationPathOption[] = [
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
    iconSrc: jbossLogo,
  },
  {
    label: "Containerization",
    options: "cloud-readiness",
    iconSrc: openshiftLogo,
  },
  {
    label: "Linux",
    options: "linux",
    iconSrc: linuxLogo,
  },
  {
    label: "Open JDK",
    options: "openjdk",
    iconSrc: openjdkLogo,
  },
  {
    label: "Camel",
    options: "camel",
    iconSrc: camelLogo,
  },
  {
    label: "Quarkus",
    options: "quarkus",
    iconSrc: quarkusLogo,
  },
  {
    label: "Red Hat Runtimes",
    options: "runtimes",
    iconSrc: rhRuntimesLogo,
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
            iconSrc={elem.iconSrc}
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
