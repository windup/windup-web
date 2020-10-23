import React, { useEffect, useState } from "react";

import {
  Progress,
  Stack,
  StackItem,
  Split,
  SplitItem,
  ProgressSize,
  ProgressVariant,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";

import { Application } from "models/api";
import { formatBytes } from "utils/format";
import { deleteRegisteredApplication } from "api/api";

export interface AddApplicationsListProps {
  applications: Application[];
  onApplicationDeleted: (applications: Application[]) => void;
}

export const AddApplicationsList: React.FC<AddApplicationsListProps> = ({
  applications,
  onApplicationDeleted,
}) => {
  const [list, setList] = useState<Application[]>([]);
  useEffect(() => {
    setList(applications);
  }, [applications]);

  const handleRemoveApplication = (app: Application) => {
    deleteRegisteredApplication(app.id).then(() => {
      onApplicationDeleted(list.filter((f) => f.id !== app.id));
    });
  };

  return (
    <Stack hasGutter>
      {list.map((app, index) => (
        <StackItem key={index}>
          <Split>
            <SplitItem isFilled>
              <Progress
                title={`${app.inputFilename} (${formatBytes(app.fileSize)})`}
                size={ProgressSize.sm}
                value={100}
                variant={ProgressVariant.success}
              />
            </SplitItem>
            <SplitItem>
              <Button
                variant={ButtonVariant.plain}
                aria-label="delete-application"
                onClick={() => handleRemoveApplication(app)}
              >
                <TrashIcon />
              </Button>
            </SplitItem>
          </Split>
        </StackItem>
      ))}
    </Stack>
  );
};
