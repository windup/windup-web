import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardActions,
  CardHeader,
  Button,
} from "@patternfly/react-core";
import { AngleLeftIcon, AngleDownIcon } from "@patternfly/react-icons";

export interface ExpandableCardProps {
  title: any;
  expandByDefault?: boolean;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  children,
  expandByDefault,
}) => {
  const [isExpanded, setIsExpanded] = useState(expandByDefault);

  const toggleBody = () => {
    setIsExpanded((current) => !current);
  };

  return (
    <Card>
      <CardHeader>
        <CardActions>
          <Button onClick={toggleBody} variant="plain" aria-label="Action">
            {isExpanded ? <AngleDownIcon /> : <AngleLeftIcon />}
          </Button>
        </CardActions>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {isExpanded && <CardBody>{children}</CardBody>}
    </Card>
  );
};
