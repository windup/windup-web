import React from "react";
import {
  Progress,
  Split,
  SplitItem,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import { InProgressIcon } from "@patternfly/react-icons";

import { WindupExecution } from "models/api";

export interface ActiveAnalysisProgressbarProps {
  activeExecution: WindupExecution;
}

export const ActiveAnalysisProgressbar: React.FC<ActiveAnalysisProgressbarProps> = ({
  activeExecution,
}) => {
  return (
    <>
      <Split hasGutter>
        <SplitItem>
          <InProgressIcon />
        </SplitItem>
        <SplitItem isFilled>
          <Stack>
            <StackItem>
              Analysis: #{activeExecution.id}
              {/* <Stack>
                    <StackItem>
                      <TextContent>
                        <TextList component={TextListVariants.dl}>
                          <TextListItem component={TextListItemVariants.dt}>
                            Analysis:
                          </TextListItem>
                          <TextListItem component={TextListItemVariants.dd}>
                            #{activeExecution.id}
                          </TextListItem>
                        </TextList>
                      </TextContent>
                    </StackItem>
                    <StackItem>
                      <Level>
                        <LevelItem>
                          <TextContent>
                            <TextList component={TextListVariants.dl}>
                              <TextListItem component={TextListItemVariants.dt}>
                                Task:
                              </TextListItem>
                              <TextListItem component={TextListItemVariants.dd}>
                                {activeExecution.currentTask}
                              </TextListItem>
                            </TextList>
                          </TextContent>
                        </LevelItem>
                        <LevelItem>
                          ({activeExecution.workCompleted}/
                          {activeExecution.totalWork})&nbsp;
                        </LevelItem>
                      </Level>
                    </StackItem>
                  </Stack> */}
            </StackItem>
            <StackItem>
              <Progress
                title={`Task: ${activeExecution.currentTask}`}
                measureLocation="top"
                min={0}
                max={activeExecution.totalWork}
                value={activeExecution.workCompleted}
                label={`(${activeExecution.workCompleted}/${activeExecution.totalWork})`}
                valueText={`(${activeExecution.workCompleted}/${activeExecution.totalWork})`}
              />
            </StackItem>
          </Stack>
        </SplitItem>
      </Split>
    </>
  );
};
