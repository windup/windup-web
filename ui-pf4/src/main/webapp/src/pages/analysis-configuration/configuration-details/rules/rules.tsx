import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { Card, CardBody } from "@patternfly/react-core";

import { ConditionalRender, SelectProjectEmptyMessage } from "components";

import { ProjectRoute } from "Paths";
import { isNullOrUndefined } from "utils/utils";

import { CustomRules } from "containers/custom-rules";

export interface RulesProps extends RouteComponentProps<ProjectRoute> {}

export const Rules: React.FC<RulesProps> = ({ match }) => {
  return (
    <ConditionalRender
      when={isNullOrUndefined(match.params.project)}
      then={<SelectProjectEmptyMessage />}
    >
      <div className="pf-c-form">
        <Card>
          <CardBody>
            <CustomRules
              projectId={match.params.project}
              skipChangeToProvisional={false}
            />
          </CardBody>
        </Card>
      </div>
    </ConditionalRender>
  );
};
