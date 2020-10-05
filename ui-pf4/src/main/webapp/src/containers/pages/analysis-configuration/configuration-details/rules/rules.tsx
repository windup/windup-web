import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { Card, CardBody } from "@patternfly/react-core";
import { CustomRules } from "containers/custom-rules";

export interface RulesProps extends RouteComponentProps<{ project: string }> {}

export const Rules: React.FC<RulesProps> = ({ match }) => {
  return (
    <div className="pf-c-form">
      <Card>
        <CardBody>
          <CustomRules projectId={match.params.project} />
        </CardBody>
      </Card>
    </div>
  );
};
