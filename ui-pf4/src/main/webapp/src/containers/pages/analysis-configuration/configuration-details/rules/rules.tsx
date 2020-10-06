import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { Card, CardBody } from "@patternfly/react-core";
import { CustomRules } from "containers/custom-rules";
import { ProjectRoute } from "Paths";

export interface RulesProps extends RouteComponentProps<ProjectRoute> {}

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
