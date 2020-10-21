import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from "@patternfly/react-core";

import { Anchor } from "antd";
import "antd/lib/anchor/style/index.css";

import { RuleEntity, LabelEntity } from "models/api";
import { XMLEditor } from "./xml-editor";

const providerIdGenerator = (index: number, provider: Provider) => {
  return `${index}-${provider.providerID}`;
};

const ruleIdGenerator = (
  index1: number,
  provider: Provider,
  index2: number,
  rule: RuleEntity
) => {
  return `${index1}-${index2}-${provider.providerID}-${rule.ruleID}`;
};
const labelIdGenerator = (
  index1: number,
  provider: Provider,
  index2: number,
  label: LabelEntity
) => {
  return `${index1}-${index2}-${provider.providerID}-${label.labelID}`;
};

interface Provider {
  providerID: string;
  loadError?: string;
  origin?: string;
  rules?: RuleEntity[];
  labels?: LabelEntity[];
}

export interface RulePathViewDetailsProps {
  container?: HTMLElement;
  containerChildSelector?: string;

  providers: Provider[];
}

export const RulePathViewDetails: React.FC<RulePathViewDetailsProps> = ({
  container,
  containerChildSelector,
  providers,
}) => {
  console.log("ArchiveIdentificationConfigLoadingRuleProvider", providers);
  const [containerElement, setContainerElement] = useState<HTMLElement>(
    container || window.document.documentElement
  );

  const handleAnchorClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (!container) {
      return;
    }

    let newContainerHTMLElement = container;
    if (containerChildSelector) {
      newContainerHTMLElement = container.querySelector(
        containerChildSelector
      ) as HTMLElement;
    }

    setContainerElement(newContainerHTMLElement);
  }, [container, containerChildSelector]);

  return (
    <Grid hasGutter md={6}>
      <GridItem md={9}>
        <Stack hasGutter>
          {providers.map((provider, index1) => (
            <StackItem key={index1}>
              <Card style={{ marginBottom: 1 }}>
                <CardTitle id={providerIdGenerator(index1, provider)}>
                  {provider.providerID}
                </CardTitle>
                <CardBody>
                  {provider.loadError && <span>{provider.loadError}</span>}
                  {!provider.loadError && (
                    <Stack hasGutter>
                      {provider.rules &&
                        provider.rules.map((rule, index2) => (
                          <StackItem
                            key={index2}
                            id={`${ruleIdGenerator(
                              index1,
                              provider,
                              index2,
                              rule
                            )}`}
                          >
                            <XMLEditor
                              name={rule.ruleID}
                              content={rule.ruleContents}
                            />
                          </StackItem>
                        ))}
                      {provider.labels &&
                        provider.labels.map((label, index2) => (
                          <StackItem
                            key={index2}
                            id={`${labelIdGenerator(
                              index1,
                              provider,
                              index2,
                              label
                            )}`}
                          >
                            <XMLEditor
                              name={label.labelID}
                              content={label.labelContents}
                            />
                          </StackItem>
                        ))}
                    </Stack>
                  )}
                </CardBody>
              </Card>
            </StackItem>
          ))}
        </Stack>
      </GridItem>
      <GridItem md={3}>
        <Anchor
          offsetTop={10}
          targetOffset={0}
          onClick={handleAnchorClick}
          getContainer={() => containerElement}
          style={{
            maxHeight: containerElement.offsetHeight,
          }}
        >
          <Title
            headingLevel="h2"
            size={TitleSizes["lg"]}
            style={{ padding: "7px 0 7px 16px" }}
          >
            Contents
          </Title>
          {providers.map((provider, index1) => (
            <Anchor.Link
              key={index1}
              href={`#${providerIdGenerator(index1, provider)}`}
              title={provider.providerID}
            >
              {provider.rules &&
                provider.rules.map((rule, index2) => (
                  <Anchor.Link
                    key={index2}
                    href={`#${ruleIdGenerator(index1, provider, index2, rule)}`}
                    title={rule.ruleID}
                  />
                ))}
              {provider.labels &&
                provider.labels.map((label, index2) => (
                  <Anchor.Link
                    key={index2}
                    href={`#${labelIdGenerator(
                      index1,
                      provider,
                      index2,
                      label
                    )}`}
                    title={label.labelID}
                  />
                ))}
            </Anchor.Link>
          ))}
        </Anchor>
      </GridItem>
    </Grid>
  );
};
