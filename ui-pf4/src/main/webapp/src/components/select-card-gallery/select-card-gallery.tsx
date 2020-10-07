import React from "react";
import { Gallery, GalleryItem } from "@patternfly/react-core";

import { SelectCard } from "../select-card/select-card";

import jbossLogo from "img/jboss.svg";
import openshiftLogo from "img/openshift.svg";
import linuxLogo from "img/linux.svg";
import openjdkLogo from "img/openjdk.svg";
import camelLogo from "img/camel.svg";
import quarkusLogo from "img/quarkus.png";
import rhRuntimesLogo from "img/rh-runtimes.png";

interface TransformationPathOption {
  label: string;
  description?: string;
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
    description:
      "Upgrade to the latest Release of JBoss EAP or migrate your applications to JBoss EAP from competitors' Enterprise Application Server (e.g. Oracle WebLogic Server)",
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
    description:
      "A comprehensive set of cloud and container readiness rules to assess applications for suitability for deployment on Openshift",
    options: "cloud-readiness",
    iconSrc: openshiftLogo,
  },
  {
    label: "Linux",
    description:
      "Ensure there are no Microsoft Windows paths hard coded into your applications",
    options: "linux",
    iconSrc: linuxLogo,
  },
  {
    label: "Open JDK",
    description: "Rules to support the migration to OpenJDK from OracleJDK",
    options: "openjdk",
    iconSrc: openjdkLogo,
  },
  {
    label: "Camel",
    description:
      "A comprehensive set of rules for migration from Apache Camel 2 to Apache Camel 3",
    options: "camel",
    iconSrc: camelLogo,
  },
  {
    label: "Quarkus",
    description:
      "Rules to support the migration of SpringBoot applications to Quarkus",
    options: "quarkus",
    iconSrc: quarkusLogo,
  },
  {
    label: "Red Hat Runtimes",
    description:
      "A set of rules for assessing the compatibility of applications against the versions of Spring Boot libraries supported by Red Hat Runtimes",
    options: "rhr",
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
            description={elem.description}
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
