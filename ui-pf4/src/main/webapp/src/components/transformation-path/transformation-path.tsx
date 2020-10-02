import * as React from "react";
import {
  Title,
  Stack,
  StackItem,
  TextContent,
  TitleSizes,
  Text,
} from "@patternfly/react-core";

import { SelectCardGallery } from "components/select-card-gallery";

export interface TransformationPathProps {
  selectedTargets: string[];
  onSelectedTargetsChange: (values: string[]) => void;

  isFetching: boolean;
  isFetchingPlaceholder: any;
  fetchError?: any;
  fetchErrorPlaceholder?: any;
}
export const TransformationPath: React.FC<TransformationPathProps> = ({
  selectedTargets,
  onSelectedTargetsChange,
  isFetching,
  isFetchingPlaceholder,
  fetchError,
  fetchErrorPlaceholder,
}) => {
  return (
    <React.Fragment>
      {isFetching ? (
        isFetchingPlaceholder
      ) : fetchError ? (
        fetchErrorPlaceholder
      ) : (
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Title headingLevel="h5" size={TitleSizes["lg"]}>
                Select transformation path
              </Title>
              <Text component="small">
                Select on or more transformation options in focus for the
                analysis
              </Text>
            </TextContent>
          </StackItem>
          <StackItem
          // style={{
          //   margin: "0px -25px",
          //   padding: "15px 15px",
          // }}
          >
            <SelectCardGallery
              value={selectedTargets}
              onChange={onSelectedTargetsChange}
            />
          </StackItem>
        </Stack>
      )}
    </React.Fragment>
  );
};
