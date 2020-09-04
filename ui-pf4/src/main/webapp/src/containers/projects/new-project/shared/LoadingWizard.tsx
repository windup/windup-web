import * as React from "react";

import { Wizard } from "@patternfly/react-core";
import { LoadingStep } from "components";

import { TITLE, DESCRIPTION } from "./constants";

export const LoadingWizard: React.FC<{}> = () => {
  return (
    <Wizard
      isOpen={true}
      title={TITLE}
      description={DESCRIPTION}
      steps={[
        {
          name: "Loading",
          component: <LoadingStep customText="Loading" />,
          isFinishedStep: true,
        },
      ]}
    />
  );
};
