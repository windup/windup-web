import React from "react";
import { Tooltip } from "@patternfly/react-core";
import {
  WarningTriangleIcon,
  ExclamationCircleIcon,
} from "@patternfly/react-icons";
import {
  global_warning_color_100 as warningColor,
  global_danger_color_100 as dangerColor,
} from "@patternfly/react-tokens";

export interface RulelabelTitleProps {
  name: string;
  errors: string[];
  numberOfRulesLabels: number;
}

export const RulelabelTitle: React.FC<RulelabelTitleProps> = ({
  name,
  errors,
  numberOfRulesLabels,
}) => {
  let info;
  if (errors.length > 0) {
    info = (
      <Tooltip content={errors.join(", ")}>
        <i>
          {" "}
          <ExclamationCircleIcon color={dangerColor.value} />
        </i>
      </Tooltip>
    );
  }
  if (numberOfRulesLabels === 0) {
    info = (
      <Tooltip content="Could not identify any rule inside this file/folder">
        <i>
          {" "}
          <WarningTriangleIcon color={warningColor.value} />
        </i>
      </Tooltip>
    );
  }

  return (
    <span>
      <span>{name}</span>
      {info}
    </span>
  );
};
