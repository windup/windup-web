import React, { useState } from "react";
import { Gallery, GalleryItem } from "@patternfly/react-core";

import { SelectCard } from "../select-card/select-card";

import appOnServer from "images/Icon-Red_Hat-App_on_server-A-Red-RGB.svg";
import cloud from "images/Icon-Red_Hat-Cloud-A-Red-RGB.svg";
import migration from "images/Icon-Red_Hat-Migration-A-Red-RGB.svg";
import mug from "images/Icon-Red_Hat-Mug-A-Red-RGB.svg";
import multiply from "images/Icon-Red_Hat-Multiply-A-Red-RGB.svg";
import server from "images/Icon-Red_Hat-Server-A-Red-RGB.svg";

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
  default: boolean;
}

const options: TransformationPathOption[] = [
  {
    label: "Application server migration to EAP 7",
    description:
      "Upgrade to the latest Release of JBoss EAP or migrate your applications to JBoss EAP from competitors' Enterprise Application server (e.g.Oracle Weblogic Server).",
    // options: [
    //   {
    //     label: "JBoss EAP 6",
    //     value: "eap6",
    //     default: false,
    //   },
    //   {
    //     label: "JBoss EAP 7",
    //     value: "eap7",
    //     default: true,
    //   },
    // ],
    options: "eap7",
    iconSrc: appOnServer,
  },
  {
    label: "Containerization",
    description:
      "A comprehensive set of cloud and container readiness rules to assess applications for suitability for deployment on OpenShift Container Platform.",
    options: "cloud-readiness",
    iconSrc: cloud,
  },
  {
    label: "Quarkus",
    description:
      "Rules to support the migration of Spring Boot applications to Quarkus. The rules also identify other, non-Spring Boot,  technologies embedded within applications for which there are equivalent Quarkus extensions.",
    options: "quarkus",
    iconSrc: migration,
  },
  {
    label: "OracleJDK to OpenJDK",
    description: "Rules to support the migration to OpenJDK from OracleJDK.",
    options: "openjdk",
    iconSrc: mug,
  },
  {
    label: "OpenJDK 11",
    description: "Rules to support the migration to OpenJDK 11 from OpenJDK 8.",
    options: "openjdk11",
    iconSrc: mug,
  },
  {
    label: "Linux",
    description:
      "Ensure that there are no Microsoft Windows paths hard coded and no Dynamic-Link Library (DLL) into your applications.",
    options: "linux",
    iconSrc: server,
  },
  {
    label: "Jakarta EE 9",
    description:
      "A collection of rules to support migrating applications from Java EE 8 to Jakarta EE 9. The rules cover project dependencies, package renaming, updating XML Schema namespaces, the renaming of application configuration properties and bootstrapping files.",
    options: "jakarta-ee",
    iconSrc: migration,
  },
  {
    label: "Spring Boot on Red Hat Runtimes",
    description:
      "A set of rules for assessing the compatibility of applications against versions of Spring Boot libraries suported by Red Hat Runtimes.",
    options: "rhr",
    iconSrc: migration,
  },
  {
    label: "Open Liberty",
    description:
      "A comprehensive set of rules for migrating traditional WebSphere applications to Open Liberty.",
    options: "openliberty",
    iconSrc: migration,
  },
  {
    label: "Camel",
    description:
      "Rules for the migration from Apache Camel 2 to Apache Camel 3.",
    options: "camel",
    iconSrc: multiply,
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
      {options.map((elem, index) => (
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
          />
        </GalleryItem>
      ))}
    </Gallery>
  );
};
