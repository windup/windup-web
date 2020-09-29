import React from "react";
import { RouteComponentProps } from "react-router-dom";

export interface RulesProps
  extends RouteComponentProps<{ project: string; execution: string }> {}

export const Rules: React.FC<RulesProps> = () => {
  return (
    <React.Fragment>
      <p>Rules</p>
    </React.Fragment>
  );
};
