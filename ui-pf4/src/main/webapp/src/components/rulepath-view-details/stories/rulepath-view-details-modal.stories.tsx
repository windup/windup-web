import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  RulePathViewDetails,
  RulePathViewDetailsProps,
} from "../rulepath-view-details";

export default {
  title: "Components / RulePathViewDetails",
  component: RulePathViewDetails,
  argTypes: {},
} as Meta;

const Template: Story<RulePathViewDetailsProps> = (args) => (
  <RulePathViewDetails {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  providers: [
    {
      id: 2643,
      version: 1,
      providerID: "JBoss5-web-class-loadingAA",
      origin: "a.mta.xml",
      description:
        "This ruleset looks for the class-loading element in a jboss-web.xml file, which is no longer valid in JBoss EAP 6",
      phase: "MIGRATIONRULESPHASE",
      dateLoaded: 1603360695415,
      dateModified: 1558344041252,
      sources: [{ id: 2533, version: 0, name: "eap", versionRange: "(4,5)" }],
      targets: [{ id: 1444, version: 0, name: "eap", versionRange: "[7,)" }],
      rules: [
        {
          id: 2644,
          version: 0,
          ruleID: "JBoss5-web-class-loading_001",
          ruleContents:
            '<rule id="JBoss5-web-class-loading_001" xmlns="http://windup.jboss.org/schema/jboss-ruleset"><when>    <xmlfile matches="jboss-web/class-loading"/></when><perform>    <iteration>        <classification effort="1" title="JBoss Web Application Descriptor"/>        <hint title="JBoss Web XML class-loading element is no longer valid">          <message>            The class-loading element is no longer valid in the jboss-web.xml file.          </message>          <link href="https://access.redhat.com/documentation/en-US/JBoss_Enterprise_Application_Platform/6.4/html-single/Migration_Guide/index.html#Create_or_Modify_Files_That_Control_Class_Loading_in_JBoss_Enterprise_Application_Platform_6" title="Create or Modify Files That Control Class Loading in JBoss EAP 6"/>        </hint>    </iteration></perform></rule>',
        },
        {
          id: 2645,
          version: 0,
          ruleID: "JBoss5-web-class-loading_002",
          ruleContents:
            '<rule id="JBoss5-web-class-loading_002" xmlns="http://windup.jboss.org/schema/jboss-ruleset"><when>    <xmlfile matches="jboss-web/class-loading"/></when><perform>    <iteration>        <classification effort="1" title="JBoss Web Application Descriptor"/>        <hint title="JBoss Web XML class-loading element is no longer valid">          <message>\n\t\t\t 222222 The class-loading element is no longer valid in the jboss-web.xml file.          </message>          <link href="https://access.redhat.com/documentation/en-US/JBoss_Enterprise_Application_Platform/6.4/html-single/Migration_Guide/index.html#Create_or_Modify_Files_That_Control_Class_Loading_in_JBoss_Enterprise_Application_Platform_6" title="Create or Modify Files That Control Class Loading in JBoss EAP 6"/>        </hint>    </iteration></perform></rule>',
        },
      ],
      rulesPath: {
        id: 2606,
        version: 0,
        path: "/home/cferiavi/Documents/custom-rules",
        scanRecursively: false,
        shortPath: "",
        loadError: "",
        rulesPathType: "USER_PROVIDED",
        registrationType: "PATH",
        scopeType: "PROJECT",
      },
      tags: [],
      loadError: "",
      ruleProviderType: "XML",
    },
    {
      id: 2646,
      version: 1,
      providerID: "JBoss5-web-class-loadingBB",
      origin: "JBoss2-web-class-loading.windup.xml",
      description:
        "This ruleset looks for the class-loading element in a jboss-web.xml file, which is no longer valid in JBoss EAP 6",
      phase: "MIGRATIONRULESPHASE",
      dateLoaded: 1603360695749,
      dateModified: 1558344059434,
      sources: [{ id: 2533, version: 0, name: "eap", versionRange: "(4,5)" }],
      targets: [{ id: 1444, version: 0, name: "eap", versionRange: "[7,)" }],
      rules: [
        {
          id: 2647,
          version: 0,
          ruleID: "JBoss5-web-class-loading_001",
          ruleContents:
            '<rule id="JBoss5-web-class-loading_001" xmlns="http://windup.jboss.org/schema/jboss-ruleset"><when>    <xmlfile matches="jboss-web/class-loading"/></when><perform>    <iteration>        <classification effort="1" title="JBoss Web Application Descriptor"/>        <hint title="JBoss Web XML class-loading element is no longer valid">          <message>            The class-loading element is no longer valid in the jboss-web.xml file.          </message>          <link href="https://access.redhat.com/documentation/en-US/JBoss_Enterprise_Application_Platform/6.4/html-single/Migration_Guide/index.html#Create_or_Modify_Files_That_Control_Class_Loading_in_JBoss_Enterprise_Application_Platform_6" title="Create or Modify Files That Control Class Loading in JBoss EAP 6"/>        </hint>    </iteration></perform></rule>',
        },
        {
          id: 2648,
          version: 0,
          ruleID: "JBoss5-web-class-loading_002",
          ruleContents:
            '<rule id="JBoss5-web-class-loading_002" xmlns="http://windup.jboss.org/schema/jboss-ruleset"><when>    <xmlfile matches="jboss-web/class-loading"/></when><perform>    <iteration>        <classification effort="1" title="JBoss Web Application Descriptor"/>        <hint title="JBoss Web XML class-loading element is no longer valid">          <message>\n\t\t\t 222222 The class-loading element is no longer valid in the jboss-web.xml file.          </message>          <link href="https://access.redhat.com/documentation/en-US/JBoss_Enterprise_Application_Platform/6.4/html-single/Migration_Guide/index.html#Create_or_Modify_Files_That_Control_Class_Loading_in_JBoss_Enterprise_Application_Platform_6" title="Create or Modify Files That Control Class Loading in JBoss EAP 6"/>        </hint>    </iteration></perform></rule>',
        },
      ],
      rulesPath: {
        id: 2606,
        version: 0,
        path: "/home/cferiavi/Documents/custom-rules",
        scanRecursively: false,
        shortPath: "",
        loadError: "",
        rulesPathType: "USER_PROVIDED",
        registrationType: "PATH",
        scopeType: "PROJECT",
      },
      tags: [],
      loadError: "",
      ruleProviderType: "XML",
    },
    {
      id: 2649,
      version: 1,
      providerID: "JBoss5-web-class-loadingCC",
      origin: "JBoss3-web-class-loading.windup.xml",
      description:
        "This ruleset looks for the class-loading element in a jboss-web.xml file, which is no longer valid in JBoss EAP 6",
      phase: "MIGRATIONRULESPHASE",
      dateLoaded: 1603360696055,
      dateModified: 1593614151800,
      sources: [{ id: 2533, version: 0, name: "eap", versionRange: "(4,5)" }],
      targets: [{ id: 1444, version: 0, name: "eap", versionRange: "[7,)" }],
      rules: [
        {
          id: 2650,
          version: 0,
          ruleID: "JBoss5-web-class-loading_001",
          ruleContents:
            '<rule id="JBoss5-web-class-loading_001" xmlns="http://windup.jboss.org/schema/jboss-ruleset"><when>    <xmlfile matches="jboss-web/class-loading"/></when><perform>    <iteration>        <classification effort="1" title="JBoss Web Application Descriptor"/>        <hint title="JBoss Web XML class-loading element is no longer valid">          <message>            The class-loading element is no longer valid in the jboss-web.xml file.          </message>          <link href="https://access.redhat.com/documentation/en-US/JBoss_Enterprise_Application_Platform/6.4/html-single/Migration_Guide/index.html#Create_or_Modify_Files_That_Control_Class_Loading_in_JBoss_Enterprise_Application_Platform_6" title="Create or Modify Files That Control Class Loading in JBoss EAP 6"/>        </hint>    </iteration></perform></rule>',
        },
      ],
      rulesPath: {
        id: 2606,
        version: 0,
        path: "/home/cferiavi/Documents/custom-rules",
        scanRecursively: false,
        shortPath: "",
        loadError: "",
        rulesPathType: "USER_PROVIDED",
        registrationType: "PATH",
        scopeType: "PROJECT",
      },
      tags: [],
      loadError: "",
      ruleProviderType: "XML",
    },
    {
      id: 2651,
      version: 1,
      providerID: "JBoss5-web-class-loadingAA",
      origin: "JBoss1-web-class-loading.windup.xml",
      description:
        "This ruleset looks for the class-loading element in a jboss-web.xml file, which is no longer valid in JBoss EAP 6",
      phase: "MIGRATIONRULESPHASE",
      dateLoaded: 1603360696357,
      dateModified: 1558344041252,
      sources: [{ id: 2533, version: 0, name: "eap", versionRange: "(4,5)" }],
      targets: [{ id: 1444, version: 0, name: "eap", versionRange: "[7,)" }],
      rules: [
        {
          id: 2652,
          version: 0,
          ruleID: "JBoss5-web-class-loading_001",
          ruleContents:
            '<rule id="JBoss5-web-class-loading_001" xmlns="http://windup.jboss.org/schema/jboss-ruleset"><when>    <xmlfile matches="jboss-web/class-loading"/></when><perform>    <iteration>        <classification effort="1" title="JBoss Web Application Descriptor"/>        <hint title="JBoss Web XML class-loading element is no longer valid">          <message>            The class-loading element is no longer valid in the jboss-web.xml file.          </message>          <link href="https://access.redhat.com/documentation/en-US/JBoss_Enterprise_Application_Platform/6.4/html-single/Migration_Guide/index.html#Create_or_Modify_Files_That_Control_Class_Loading_in_JBoss_Enterprise_Application_Platform_6" title="Create or Modify Files That Control Class Loading in JBoss EAP 6"/>        </hint>    </iteration></perform></rule>',
        },
        {
          id: 2653,
          version: 0,
          ruleID: "JBoss5-web-class-loading_002",
          ruleContents:
            '<rule id="JBoss5-web-class-loading_002" xmlns="http://windup.jboss.org/schema/jboss-ruleset"><when>    <xmlfile matches="jboss-web/class-loading"/></when><perform>    <iteration>        <classification effort="1" title="JBoss Web Application Descriptor"/>        <hint title="JBoss Web XML class-loading element is no longer valid">          <message>\n\t\t\t 222222 The class-loading element is no longer valid in the jboss-web.xml file.          </message>          <link href="https://access.redhat.com/documentation/en-US/JBoss_Enterprise_Application_Platform/6.4/html-single/Migration_Guide/index.html#Create_or_Modify_Files_That_Control_Class_Loading_in_JBoss_Enterprise_Application_Platform_6" title="Create or Modify Files That Control Class Loading in JBoss EAP 6"/>        </hint>    </iteration></perform></rule>',
        },
      ],
      rulesPath: {
        id: 2606,
        version: 0,
        path: "/home/cferiavi/Documents/custom-rules",
        scanRecursively: false,
        shortPath: "",
        loadError: "",
        rulesPathType: "USER_PROVIDED",
        registrationType: "PATH",
        scopeType: "PROJECT",
      },
      tags: [],
      loadError: "",
      ruleProviderType: "XML",
    },
  ] as any,
};
