import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { Card, CardBody } from "@patternfly/react-core";

import { ConditionalRender, SelectProjectEmptyMessage } from "components";

import { ProjectRoute } from "Paths";
import { isNullOrUndefined } from "utils/utils";

import { CustomLabels } from "containers/custom-labels";

export interface LabelsProps extends RouteComponentProps<ProjectRoute> {}

export const Labels: React.FC<LabelsProps> = ({ match }) => {
  return (
    <ConditionalRender
      when={isNullOrUndefined(match.params.project)}
      then={<SelectProjectEmptyMessage />}
    >
      <div className="pf-c-form">
        <Card>
          <CardBody>
            <CustomLabels
              projectId={match.params.project}
              skipChangeToProvisional={false}
            />
          </CardBody>
        </Card>
      </div>
    </ConditionalRender>
  );
};
