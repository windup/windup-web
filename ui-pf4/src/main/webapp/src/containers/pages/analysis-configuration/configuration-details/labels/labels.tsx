import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { Card, CardBody } from "@patternfly/react-core";
import { CustomLabels } from "containers/custom-labels";
import { ProjectRoute } from "Paths";

export interface LabelsProps extends RouteComponentProps<ProjectRoute> {}

export const Labels: React.FC<LabelsProps> = ({ match }) => {
  return (
    <div className="pf-c-form">
      <Card>
        <CardBody>
          <CustomLabels projectId={match.params.project} />
        </CardBody>
      </Card>
    </div>
  );
};
