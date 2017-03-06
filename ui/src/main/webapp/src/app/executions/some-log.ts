export let someLog = `
    Cloning "https://github.com/bparees/openshift-jee-sample.git" ...
	Commit:	5df41f9360bf41ae3a25c7de7a300c25547ba0cc (update readme with maven args)
	Author:	Ben Parees <bparees@redhat.com>
	Date:	Tue Jun 9 09:13:46 2015 -0400

Found pom.xml... attempting to build with 'mvn package -Popenshift -DskipTests -B -s /opt/app-root/src/.m2/settings.xml'
Apache Maven 3.3.9 (bb52d8502b132ec0a5a3f4c09453c07478323dc5; 2015-11-10T16:41:47+00:00)
Maven home: /usr/local/apache-maven-3.3.9
Java version: 1.8.0_121, vendor: Oracle Corporation
Java home: /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.121-0.b13.el7_3.x86_64/jre
Default locale: en_US, platform encoding: ANSI_X3.4-1968
OS name: "linux", version: "4.4.27-boot2docker", arch: "amd64", family: "unix"
[INFO] Scanning for projects...
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building SampleApp 1.0
[INFO] ------------------------------------------------------------------------
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-resources-plugin/2.6/maven-resources-plugin-2.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-resources-plugin/2.6/maven-resources-plugin-2.6.pom (8 KB at 8.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-plugins/23/maven-plugins-23.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-plugins/23/maven-plugins-23.pom (9 KB at 103.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/22/maven-parent-22.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/22/maven-parent-22.pom (30 KB at 203.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/apache/11/apache-11.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/apache/11/apache-11.pom (15 KB at 183.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-resources-plugin/2.6/maven-resources-plugin-2.6.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-resources-plugin/2.6/maven-resources-plugin-2.6.jar (29 KB at 323.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-compiler-plugin/3.1/maven-compiler-plugin-3.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-compiler-plugin/3.1/maven-compiler-plugin-3.1.pom (10 KB at 115.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-plugins/24/maven-plugins-24.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-plugins/24/maven-plugins-24.pom (11 KB at 148.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/23/maven-parent-23.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/23/maven-parent-23.pom (32 KB at 318.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/apache/13/apache-13.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/apache/13/apache-13.pom (14 KB at 194.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-compiler-plugin/3.1/maven-compiler-plugin-3.1.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-compiler-plugin/3.1/maven-compiler-plugin-3.1.jar (42 KB at 403.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-surefire-plugin/2.12.4/maven-surefire-plugin-2.12.4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-surefire-plugin/2.12.4/maven-surefire-plugin-2.12.4.pom (11 KB at 114.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/surefire/surefire/2.12.4/surefire-2.12.4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/surefire/surefire/2.12.4/surefire-2.12.4.pom (14 KB at 154.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-surefire-plugin/2.12.4/maven-surefire-plugin-2.12.4.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-surefire-plugin/2.12.4/maven-surefire-plugin-2.12.4.jar (30 KB at 260.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-war-plugin/2.3/maven-war-plugin-2.3.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-war-plugin/2.3/maven-war-plugin-2.3.pom (8 KB at 104.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-war-plugin/2.3/maven-war-plugin-2.3.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/plugins/maven-war-plugin/2.3/maven-war-plugin-2.3.jar (82 KB at 549.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/javax/javaee-api/7.0/javaee-api-7.0.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/javax/javaee-api/7.0/javaee-api-7.0.pom (9 KB at 115.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/net/java/jvnet-parent/3/jvnet-parent-3.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/net/java/jvnet-parent/3/jvnet-parent-3.pom (5 KB at 66.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/com/sun/mail/javax.mail/1.5.0/javax.mail-1.5.0.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/com/sun/mail/javax.mail/1.5.0/javax.mail-1.5.0.pom (5 KB at 42.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/com/sun/mail/all/1.5.0/all-1.5.0.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/com/sun/mail/all/1.5.0/all-1.5.0.pom (19 KB at 237.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/net/java/jvnet-parent/1/jvnet-parent-1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/net/java/jvnet-parent/1/jvnet-parent-1.pom (5 KB at 56.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/javax/activation/activation/1.1/activation-1.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/javax/activation/activation/1.1/activation-1.1.pom (2 KB at 11.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/javax/javaee-api/7.0/javaee-api-7.0.jar
[INFO] Downloading: https://repo1.maven.org/maven2/javax/activation/activation/1.1/activation-1.1.jar
[INFO] Downloading: https://repo1.maven.org/maven2/com/sun/mail/javax.mail/1.5.0/javax.mail-1.5.0.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/com/sun/mail/javax.mail/1.5.0/javax.mail-1.5.0.jar (510 KB at 806.6 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/javax/activation/activation/1.1/activation-1.1.jar (62 KB at 97.9 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/javax/javaee-api/7.0/javaee-api-7.0.jar (1886 KB at 1313.0 KB/sec)
[INFO]
[INFO] --- maven-resources-plugin:2.6:resources (default-resources) @ SampleApp ---
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-api/2.0.6/maven-plugin-api-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-api/2.0.6/maven-plugin-api-2.0.6.pom (2 KB at 13.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven/2.0.6/maven-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven/2.0.6/maven-2.0.6.pom (9 KB at 110.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/5/maven-parent-5.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/5/maven-parent-5.pom (15 KB at 113.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/apache/3/apache-3.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/apache/3/apache-3.pom (4 KB at 40.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-project/2.0.6/maven-project-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-project/2.0.6/maven-project-2.0.6.pom (3 KB at 31.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-settings/2.0.6/maven-settings-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-settings/2.0.6/maven-settings-2.0.6.pom (2 KB at 23.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-model/2.0.6/maven-model-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-model/2.0.6/maven-model-2.0.6.pom (3 KB at 38.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.4.1/plexus-utils-1.4.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.4.1/plexus-utils-1.4.1.pom (2 KB at 19.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/1.0.11/plexus-1.0.11.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/1.0.11/plexus-1.0.11.pom (9 KB at 93.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-container-default/1.0-alpha-9-stable-1/plexus-container-default-1.0-alpha-9-stable-1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-container-default/1.0-alpha-9-stable-1/plexus-container-default-1.0-alpha-9-stable-1.pom (4 KB at 47.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-containers/1.0.3/plexus-containers-1.0.3.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-containers/1.0.3/plexus-containers-1.0.3.pom (492 B at 5.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/1.0.4/plexus-1.0.4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/1.0.4/plexus-1.0.4.pom (6 KB at 70.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/junit/junit/3.8.1/junit-3.8.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/junit/junit/3.8.1/junit-3.8.1.pom (998 B at 11.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.0.4/plexus-utils-1.0.4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.0.4/plexus-utils-1.0.4.pom (7 KB at 98.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/classworlds/classworlds/1.1-alpha-2/classworlds-1.1-alpha-2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/classworlds/classworlds/1.1-alpha-2/classworlds-1.1-alpha-2.pom (4 KB at 38.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-profile/2.0.6/maven-profile-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-profile/2.0.6/maven-profile-2.0.6.pom (2 KB at 22.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact-manager/2.0.6/maven-artifact-manager-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact-manager/2.0.6/maven-artifact-manager-2.0.6.pom (3 KB at 36.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-repository-metadata/2.0.6/maven-repository-metadata-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-repository-metadata/2.0.6/maven-repository-metadata-2.0.6.pom (2 KB at 29.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact/2.0.6/maven-artifact-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact/2.0.6/maven-artifact-2.0.6.pom (2 KB at 18.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-registry/2.0.6/maven-plugin-registry-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-registry/2.0.6/maven-plugin-registry-2.0.6.pom (2 KB at 26.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-core/2.0.6/maven-core-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-core/2.0.6/maven-core-2.0.6.pom (7 KB at 70.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.6/maven-plugin-parameter-documenter-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.6/maven-plugin-parameter-documenter-2.0.6.pom (2 KB at 23.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/reporting/maven-reporting-api/2.0.6/maven-reporting-api-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/reporting/maven-reporting-api/2.0.6/maven-reporting-api-2.0.6.pom (2 KB at 22.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/reporting/maven-reporting/2.0.6/maven-reporting-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/reporting/maven-reporting/2.0.6/maven-reporting-2.0.6.pom (2 KB at 20.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/doxia/doxia-sink-api/1.0-alpha-7/doxia-sink-api-1.0-alpha-7.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/doxia/doxia-sink-api/1.0-alpha-7/doxia-sink-api-1.0-alpha-7.pom (424 B at 5.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/doxia/doxia/1.0-alpha-7/doxia-1.0-alpha-7.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/doxia/doxia/1.0-alpha-7/doxia-1.0-alpha-7.pom (4 KB at 39.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.6/maven-error-diagnostics-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.6/maven-error-diagnostics-2.0.6.pom (2 KB at 22.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/commons-cli/commons-cli/1.0/commons-cli-1.0.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/commons-cli/commons-cli/1.0/commons-cli-1.0.pom (3 KB at 23.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.6/maven-plugin-descriptor-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.6/maven-plugin-descriptor-2.0.6.pom (2 KB at 24.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interactivity-api/1.0-alpha-4/plexus-interactivity-api-1.0-alpha-4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interactivity-api/1.0-alpha-4/plexus-interactivity-api-1.0-alpha-4.pom (7 KB at 75.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-monitor/2.0.6/maven-monitor-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-monitor/2.0.6/maven-monitor-2.0.6.pom (2 KB at 11.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/classworlds/classworlds/1.1/classworlds-1.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/classworlds/classworlds/1.1/classworlds-1.1.pom (4 KB at 40.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/2.0.5/plexus-utils-2.0.5.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/2.0.5/plexus-utils-2.0.5.pom (4 KB at 46.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/2.0.6/plexus-2.0.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/2.0.6/plexus-2.0.6.pom (17 KB at 168.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-filtering/1.1/maven-filtering-1.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-filtering/1.1/maven-filtering-1.1.pom (6 KB at 68.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-components/17/maven-shared-components-17.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-components/17/maven-shared-components-17.pom (9 KB at 130.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/21/maven-parent-21.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/21/maven-parent-21.pom (26 KB at 299.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/apache/10/apache-10.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/apache/10/apache-10.pom (15 KB at 170.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.5.15/plexus-utils-1.5.15.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.5.15/plexus-utils-1.5.15.pom (7 KB at 86.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/2.0.2/plexus-2.0.2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/2.0.2/plexus-2.0.2.pom (12 KB at 123.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.12/plexus-interpolation-1.12.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.12/plexus-interpolation-1.12.pom (889 B at 13.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-components/1.1.14/plexus-components-1.1.14.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-components/1.1.14/plexus-components-1.1.14.pom (6 KB at 82.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/sonatype/plexus/plexus-build-api/0.0.4/plexus-build-api-0.0.4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/sonatype/plexus/plexus-build-api/0.0.4/plexus-build-api-0.0.4.pom (3 KB at 34.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/sonatype/spice/spice-parent/10/spice-parent-10.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/sonatype/spice/spice-parent/10/spice-parent-10.pom (3 KB at 46.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/sonatype/forge/forge-parent/3/forge-parent-3.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/sonatype/forge/forge-parent/3/forge-parent-3.pom (5 KB at 63.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.5.8/plexus-utils-1.5.8.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.5.8/plexus-utils-1.5.8.pom (8 KB at 123.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.13/plexus-interpolation-1.13.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.13/plexus-interpolation-1.13.pom (890 B at 10.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-components/1.1.15/plexus-components-1.1.15.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-components/1.1.15/plexus-components-1.1.15.pom (3 KB at 30.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/2.0.3/plexus-2.0.3.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/2.0.3/plexus-2.0.3.pom (16 KB at 132.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-api/2.0.6/maven-plugin-api-2.0.6.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-project/2.0.6/maven-project-2.0.6.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-profile/2.0.6/maven-profile-2.0.6.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact-manager/2.0.6/maven-artifact-manager-2.0.6.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-registry/2.0.6/maven-plugin-registry-2.0.6.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-api/2.0.6/maven-plugin-api-2.0.6.jar (13 KB at 66.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-core/2.0.6/maven-core-2.0.6.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact-manager/2.0.6/maven-artifact-manager-2.0.6.jar (56 KB at 452.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.6/maven-plugin-parameter-documenter-2.0.6.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-project/2.0.6/maven-project-2.0.6.jar (114 KB at 443.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/reporting/maven-reporting-api/2.0.6/maven-reporting-api-2.0.6.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.6/maven-plugin-parameter-documenter-2.0.6.jar (21 KB at 93.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/doxia/doxia-sink-api/1.0-alpha-7/doxia-sink-api-1.0-alpha-7.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/reporting/maven-reporting-api/2.0.6/maven-reporting-api-2.0.6.jar (10 KB at 38.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-repository-metadata/2.0.6/maven-repository-metadata-2.0.6.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-core/2.0.6/maven-core-2.0.6.jar (149 KB at 521.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.6/maven-error-diagnostics-2.0.6.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/doxia/doxia-sink-api/1.0-alpha-7/doxia-sink-api-1.0-alpha-7.jar (6 KB at 19.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/commons-cli/commons-cli/1.0/commons-cli-1.0.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-registry/2.0.6/maven-plugin-registry-2.0.6.jar (29 KB at 92.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.6/maven-plugin-descriptor-2.0.6.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-profile/2.0.6/maven-profile-2.0.6.jar (35 KB at 81.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interactivity-api/1.0-alpha-4/plexus-interactivity-api-1.0-alpha-4.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-repository-metadata/2.0.6/maven-repository-metadata-2.0.6.jar (24 KB at 61.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/classworlds/classworlds/1.1/classworlds-1.1.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/commons-cli/commons-cli/1.0/commons-cli-1.0.jar (30 KB at 74.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact/2.0.6/maven-artifact-2.0.6.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.6/maven-error-diagnostics-2.0.6.jar (14 KB at 32.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-settings/2.0.6/maven-settings-2.0.6.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.6/maven-plugin-descriptor-2.0.6.jar (37 KB at 87.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-model/2.0.6/maven-model-2.0.6.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interactivity-api/1.0-alpha-4/plexus-interactivity-api-1.0-alpha-4.jar (14 KB at 30.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-monitor/2.0.6/maven-monitor-2.0.6.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/classworlds/classworlds/1.1/classworlds-1.1.jar (37 KB at 73.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-container-default/1.0-alpha-9-stable-1/plexus-container-default-1.0-alpha-9-stable-1.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-settings/2.0.6/maven-settings-2.0.6.jar (48 KB at 95.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/junit/junit/3.8.1/junit-3.8.1.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-monitor/2.0.6/maven-monitor-2.0.6.jar (11 KB at 19.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/2.0.5/plexus-utils-2.0.5.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact/2.0.6/maven-artifact-2.0.6.jar (86 KB at 162.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-filtering/1.1/maven-filtering-1.1.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-model/2.0.6/maven-model-2.0.6.jar (85 KB at 160.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/sonatype/plexus/plexus-build-api/0.0.4/plexus-build-api-0.0.4.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/sonatype/plexus/plexus-build-api/0.0.4/plexus-build-api-0.0.4.jar (7 KB at 10.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.13/plexus-interpolation-1.13.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/junit/junit/3.8.1/junit-3.8.1.jar (119 KB at 180.2 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-container-default/1.0-alpha-9-stable-1/plexus-container-default-1.0-alpha-9-stable-1.jar (190 KB at 269.0 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-filtering/1.1/maven-filtering-1.1.jar (43 KB at 59.5 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.13/plexus-interpolation-1.13.jar (60 KB at 80.6 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/2.0.5/plexus-utils-2.0.5.jar (218 KB at 275.2 KB/sec)
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 1 resource
[INFO]
[INFO] --- maven-compiler-plugin:3.1:compile (default-compile) @ SampleApp ---
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-api/2.0.9/maven-plugin-api-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-api/2.0.9/maven-plugin-api-2.0.9.pom (2 KB at 10.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven/2.0.9/maven-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven/2.0.9/maven-2.0.9.pom (19 KB at 155.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/8/maven-parent-8.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/8/maven-parent-8.pom (24 KB at 274.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/apache/4/apache-4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/apache/4/apache-4.pom (5 KB at 35.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact/2.0.9/maven-artifact-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact/2.0.9/maven-artifact-2.0.9.pom (2 KB at 19.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.5.1/plexus-utils-1.5.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.5.1/plexus-utils-1.5.1.pom (3 KB at 25.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-core/2.0.9/maven-core-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-core/2.0.9/maven-core-2.0.9.pom (8 KB at 100.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-settings/2.0.9/maven-settings-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-settings/2.0.9/maven-settings-2.0.9.pom (3 KB at 28.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-model/2.0.9/maven-model-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-model/2.0.9/maven-model-2.0.9.pom (4 KB at 31.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.9/maven-plugin-parameter-documenter-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.9/maven-plugin-parameter-documenter-2.0.9.pom (2 KB at 30.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-profile/2.0.9/maven-profile-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-profile/2.0.9/maven-profile-2.0.9.pom (3 KB at 27.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-repository-metadata/2.0.9/maven-repository-metadata-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-repository-metadata/2.0.9/maven-repository-metadata-2.0.9.pom (2 KB at 25.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.9/maven-error-diagnostics-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.9/maven-error-diagnostics-2.0.9.pom (2 KB at 25.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-project/2.0.9/maven-project-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-project/2.0.9/maven-project-2.0.9.pom (3 KB at 33.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact-manager/2.0.9/maven-artifact-manager-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact-manager/2.0.9/maven-artifact-manager-2.0.9.pom (3 KB at 39.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-registry/2.0.9/maven-plugin-registry-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-registry/2.0.9/maven-plugin-registry-2.0.9.pom (2 KB at 25.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.9/maven-plugin-descriptor-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.9/maven-plugin-descriptor-2.0.9.pom (3 KB at 29.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-monitor/2.0.9/maven-monitor-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-monitor/2.0.9/maven-monitor-2.0.9.pom (2 KB at 18.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-toolchain/1.0/maven-toolchain-1.0.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-toolchain/1.0/maven-toolchain-1.0.pom (4 KB at 49.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-utils/0.1/maven-shared-utils-0.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-utils/0.1/maven-shared-utils-0.1.pom (4 KB at 57.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-components/18/maven-shared-components-18.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-components/18/maven-shared-components-18.pom (5 KB at 71.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/com/google/code/findbugs/jsr305/2.0.1/jsr305-2.0.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/com/google/code/findbugs/jsr305/2.0.1/jsr305-2.0.1.pom (965 B at 14.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-incremental/1.1/maven-shared-incremental-1.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-incremental/1.1/maven-shared-incremental-1.1.pom (5 KB at 70.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-components/19/maven-shared-components-19.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-components/19/maven-shared-components-19.pom (7 KB at 100.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-api/2.2.1/maven-plugin-api-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-api/2.2.1/maven-plugin-api-2.2.1.pom (2 KB at 18.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven/2.2.1/maven-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven/2.2.1/maven-2.2.1.pom (22 KB at 245.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/11/maven-parent-11.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/11/maven-parent-11.pom (32 KB at 395.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/apache/5/apache-5.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/apache/5/apache-5.pom (5 KB at 64.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-core/2.2.1/maven-core-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-core/2.2.1/maven-core-2.2.1.pom (12 KB at 160.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-settings/2.2.1/maven-settings-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-settings/2.2.1/maven-settings-2.2.1.pom (3 KB at 32.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-model/2.2.1/maven-model-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-model/2.2.1/maven-model-2.2.1.pom (4 KB at 40.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.11/plexus-interpolation-1.11.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.11/plexus-interpolation-1.11.pom (889 B at 11.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.2.1/maven-plugin-parameter-documenter-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.2.1/maven-plugin-parameter-documenter-2.2.1.pom (2 KB at 14.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/slf4j/slf4j-jdk14/1.5.6/slf4j-jdk14-1.5.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/slf4j/slf4j-jdk14/1.5.6/slf4j-jdk14-1.5.6.pom (2 KB at 16.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/slf4j/slf4j-parent/1.5.6/slf4j-parent-1.5.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/slf4j/slf4j-parent/1.5.6/slf4j-parent-1.5.6.pom (8 KB at 77.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/slf4j/slf4j-api/1.5.6/slf4j-api-1.5.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/slf4j/slf4j-api/1.5.6/slf4j-api-1.5.6.pom (3 KB at 42.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/slf4j/jcl-over-slf4j/1.5.6/jcl-over-slf4j-1.5.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/slf4j/jcl-over-slf4j/1.5.6/jcl-over-slf4j-1.5.6.pom (3 KB at 21.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-profile/2.2.1/maven-profile-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-profile/2.2.1/maven-profile-2.2.1.pom (3 KB at 35.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact/2.2.1/maven-artifact-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact/2.2.1/maven-artifact-2.2.1.pom (2 KB at 20.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-repository-metadata/2.2.1/maven-repository-metadata-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-repository-metadata/2.2.1/maven-repository-metadata-2.2.1.pom (2 KB at 27.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-error-diagnostics/2.2.1/maven-error-diagnostics-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-error-diagnostics/2.2.1/maven-error-diagnostics-2.2.1.pom (2 KB at 21.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-project/2.2.1/maven-project-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-project/2.2.1/maven-project-2.2.1.pom (3 KB at 41.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact-manager/2.2.1/maven-artifact-manager-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact-manager/2.2.1/maven-artifact-manager-2.2.1.pom (4 KB at 37.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/backport-util-concurrent/backport-util-concurrent/3.1/backport-util-concurrent-3.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/backport-util-concurrent/backport-util-concurrent/3.1/backport-util-concurrent-3.1.pom (880 B at 13.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-registry/2.2.1/maven-plugin-registry-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-registry/2.2.1/maven-plugin-registry-2.2.1.pom (2 KB at 29.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-descriptor/2.2.1/maven-plugin-descriptor-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-descriptor/2.2.1/maven-plugin-descriptor-2.2.1.pom (3 KB at 28.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-monitor/2.2.1/maven-monitor-2.2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-monitor/2.2.1/maven-monitor-2.2.1.pom (2 KB at 13.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/sonatype/plexus/plexus-sec-dispatcher/1.3/plexus-sec-dispatcher-1.3.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/sonatype/plexus/plexus-sec-dispatcher/1.3/plexus-sec-dispatcher-1.3.pom (3 KB at 46.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/sonatype/spice/spice-parent/12/spice-parent-12.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/sonatype/spice/spice-parent/12/spice-parent-12.pom (7 KB at 81.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/sonatype/forge/forge-parent/4/forge-parent-4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/sonatype/forge/forge-parent/4/forge-parent-4.pom (9 KB at 126.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.5.5/plexus-utils-1.5.5.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.5.5/plexus-utils-1.5.5.pom (6 KB at 72.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/sonatype/plexus/plexus-cipher/1.4/plexus-cipher-1.4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/sonatype/plexus/plexus-cipher/1.4/plexus-cipher-1.4.pom (3 KB at 24.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-component-annotations/1.5.5/plexus-component-annotations-1.5.5.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-component-annotations/1.5.5/plexus-component-annotations-1.5.5.pom (815 B at 11.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-containers/1.5.5/plexus-containers-1.5.5.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-containers/1.5.5/plexus-containers-1.5.5.pom (5 KB at 44.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/2.0.7/plexus-2.0.7.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/2.0.7/plexus-2.0.7.pom (17 KB at 206.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler-api/2.2/plexus-compiler-api-2.2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler-api/2.2/plexus-compiler-api-2.2.pom (865 B at 11.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler/2.2/plexus-compiler-2.2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler/2.2/plexus-compiler-2.2.pom (4 KB at 48.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-components/1.3.1/plexus-components-1.3.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-components/1.3.1/plexus-components-1.3.1.pom (3 KB at 45.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/3.3.1/plexus-3.3.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/3.3.1/plexus-3.3.1.pom (20 KB at 232.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/sonatype/spice/spice-parent/17/spice-parent-17.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/sonatype/spice/spice-parent/17/spice-parent-17.pom (7 KB at 86.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/sonatype/forge/forge-parent/10/forge-parent-10.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/sonatype/forge/forge-parent/10/forge-parent-10.pom (14 KB at 148.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/3.0.8/plexus-utils-3.0.8.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/3.0.8/plexus-utils-3.0.8.pom (4 KB at 30.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/3.2/plexus-3.2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/3.2/plexus-3.2.pom (19 KB at 133.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler-manager/2.2/plexus-compiler-manager-2.2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler-manager/2.2/plexus-compiler-manager-2.2.pom (690 B at 9.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler-javac/2.2/plexus-compiler-javac-2.2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler-javac/2.2/plexus-compiler-javac-2.2.pom (769 B at 8.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compilers/2.2/plexus-compilers-2.2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compilers/2.2/plexus-compilers-2.2.pom (2 KB at 16.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-container-default/1.5.5/plexus-container-default-1.5.5.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-container-default/1.5.5/plexus-container-default-1.5.5.pom (3 KB at 28.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.4.5/plexus-utils-1.4.5.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.4.5/plexus-utils-1.4.5.pom (3 KB at 34.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-classworlds/2.2.2/plexus-classworlds-2.2.2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-classworlds/2.2.2/plexus-classworlds-2.2.2.pom (4 KB at 60.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/xbean/xbean-reflect/3.4/xbean-reflect-3.4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/xbean/xbean-reflect/3.4/xbean-reflect-3.4.pom (3 KB at 36.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/xbean/xbean/3.4/xbean-3.4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/xbean/xbean/3.4/xbean-3.4.pom (19 KB at 80.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/log4j/log4j/1.2.12/log4j-1.2.12.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/log4j/log4j/1.2.12/log4j-1.2.12.pom (145 B at 2.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/commons-logging/commons-logging-api/1.1/commons-logging-api-1.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/commons-logging/commons-logging-api/1.1/commons-logging-api-1.1.pom (6 KB at 62.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/com/google/collections/google-collections/1.0/google-collections-1.0.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/com/google/collections/google-collections/1.0/google-collections-1.0.pom (3 KB at 32.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/com/google/google/1/google-1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/com/google/google/1/google-1.pom (2 KB at 23.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/junit/junit/3.8.2/junit-3.8.2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/junit/junit/3.8.2/junit-3.8.2.pom (747 B at 11.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact/2.0.9/maven-artifact-2.0.9.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-api/2.0.9/maven-plugin-api-2.0.9.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.5.1/plexus-utils-1.5.1.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-core/2.0.9/maven-core-2.0.9.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-settings/2.0.9/maven-settings-2.0.9.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-settings/2.0.9/maven-settings-2.0.9.jar (48 KB at 288.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.9/maven-plugin-parameter-documenter-2.0.9.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact/2.0.9/maven-artifact-2.0.9.jar (87 KB at 429.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-profile/2.0.9/maven-profile-2.0.9.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.5.1/plexus-utils-1.5.1.jar (206 KB at 1018.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-model/2.0.9/maven-model-2.0.9.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-parameter-documenter/2.0.9/maven-plugin-parameter-documenter-2.0.9.jar (21 KB at 81.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-repository-metadata/2.0.9/maven-repository-metadata-2.0.9.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-core/2.0.9/maven-core-2.0.9.jar (156 KB at 517.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.9/maven-error-diagnostics-2.0.9.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-profile/2.0.9/maven-profile-2.0.9.jar (35 KB at 103.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-project/2.0.9/maven-project-2.0.9.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-model/2.0.9/maven-model-2.0.9.jar (86 KB at 254.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-registry/2.0.9/maven-plugin-registry-2.0.9.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-repository-metadata/2.0.9/maven-repository-metadata-2.0.9.jar (24 KB at 68.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.9/maven-plugin-descriptor-2.0.9.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-error-diagnostics/2.0.9/maven-error-diagnostics-2.0.9.jar (14 KB at 33.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact-manager/2.0.9/maven-artifact-manager-2.0.9.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-registry/2.0.9/maven-plugin-registry-2.0.9.jar (29 KB at 65.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-monitor/2.0.9/maven-monitor-2.0.9.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-descriptor/2.0.9/maven-plugin-descriptor-2.0.9.jar (37 KB at 81.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-toolchain/1.0/maven-toolchain-1.0.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-plugin-api/2.0.9/maven-plugin-api-2.0.9.jar (13 KB at 26.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-utils/0.1/maven-shared-utils-0.1.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-monitor/2.0.9/maven-monitor-2.0.9.jar (11 KB at 18.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/com/google/code/findbugs/jsr305/2.0.1/jsr305-2.0.1.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-artifact-manager/2.0.9/maven-artifact-manager-2.0.9.jar (57 KB at 103.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-incremental/1.1/maven-shared-incremental-1.1.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-toolchain/1.0/maven-toolchain-1.0.jar (33 KB at 57.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-component-annotations/1.5.5/plexus-component-annotations-1.5.5.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-project/2.0.9/maven-project-2.0.9.jar (119 KB at 205.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler-api/2.2/plexus-compiler-api-2.2.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/com/google/code/findbugs/jsr305/2.0.1/jsr305-2.0.1.jar (32 KB at 50.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler-manager/2.2/plexus-compiler-manager-2.2.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-incremental/1.1/maven-shared-incremental-1.1.jar (14 KB at 21.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler-javac/2.2/plexus-compiler-javac-2.2.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-component-annotations/1.5.5/plexus-component-annotations-1.5.5.jar (5 KB at 6.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-container-default/1.5.5/plexus-container-default-1.5.5.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler-api/2.2/plexus-compiler-api-2.2.jar (25 KB at 36.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-classworlds/2.2.2/plexus-classworlds-2.2.2.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler-manager/2.2/plexus-compiler-manager-2.2.jar (5 KB at 6.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/xbean/xbean-reflect/3.4/xbean-reflect-3.4.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-compiler-javac/2.2/plexus-compiler-javac-2.2.jar (19 KB at 25.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/log4j/log4j/1.2.12/log4j-1.2.12.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-utils/0.1/maven-shared-utils-0.1.jar (151 KB at 188.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/commons-logging/commons-logging-api/1.1/commons-logging-api-1.1.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-classworlds/2.2.2/plexus-classworlds-2.2.2.jar (46 KB at 51.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/com/google/collections/google-collections/1.0/google-collections-1.0.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-container-default/1.5.5/plexus-container-default-1.5.5.jar (212 KB at 232.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/junit/junit/3.8.2/junit-3.8.2.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/commons-logging/commons-logging-api/1.1/commons-logging-api-1.1.jar (44 KB at 46.7 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/log4j/log4j/1.2.12/log4j-1.2.12.jar (350 KB at 362.8 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/xbean/xbean-reflect/3.4/xbean-reflect-3.4.jar (131 KB at 135.6 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/junit/junit/3.8.2/junit-3.8.2.jar (118 KB at 105.0 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/com/google/collections/google-collections/1.0/google-collections-1.0.jar (625 KB at 452.3 KB/sec)
[INFO] Nothing to compile - all classes are up to date
[INFO]
[INFO] --- maven-resources-plugin:2.6:testResources (default-testResources) @ SampleApp ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /opt/app-root/src/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.1:testCompile (default-testCompile) @ SampleApp ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.12.4:test (default-test) @ SampleApp ---
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/surefire/surefire-booter/2.12.4/surefire-booter-2.12.4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/surefire/surefire-booter/2.12.4/surefire-booter-2.12.4.pom (3 KB at 36.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/surefire/surefire-api/2.12.4/surefire-api-2.12.4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/surefire/surefire-api/2.12.4/surefire-api-2.12.4.pom (3 KB at 25.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/surefire/maven-surefire-common/2.12.4/maven-surefire-common-2.12.4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/surefire/maven-surefire-common/2.12.4/maven-surefire-common-2.12.4.pom (6 KB at 62.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/plugin-tools/maven-plugin-annotations/3.1/maven-plugin-annotations-3.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/plugin-tools/maven-plugin-annotations/3.1/maven-plugin-annotations-3.1.pom (2 KB at 19.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/plugin-tools/maven-plugin-tools/3.1/maven-plugin-tools-3.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/plugin-tools/maven-plugin-tools/3.1/maven-plugin-tools-3.1.pom (16 KB at 131.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/reporting/maven-reporting-api/2.0.9/maven-reporting-api-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/reporting/maven-reporting-api/2.0.9/maven-reporting-api-2.0.9.pom (2 KB at 22.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/reporting/maven-reporting/2.0.9/maven-reporting-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/reporting/maven-reporting/2.0.9/maven-reporting-2.0.9.pom (2 KB at 8.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-toolchain/2.0.9/maven-toolchain-2.0.9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-toolchain/2.0.9/maven-toolchain-2.0.9.pom (4 KB at 43.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/commons/commons-lang3/3.1/commons-lang3-3.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/commons/commons-lang3/3.1/commons-lang3-3.1.pom (17 KB at 158.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/commons/commons-parent/22/commons-parent-22.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/commons/commons-parent/22/commons-parent-22.pom (41 KB at 344.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/apache/9/apache-9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/apache/9/apache-9.pom (15 KB at 160.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-common-artifact-filters/1.3/maven-common-artifact-filters-1.3.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-common-artifact-filters/1.3/maven-common-artifact-filters-1.3.pom (4 KB at 42.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-components/12/maven-shared-components-12.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-components/12/maven-shared-components-12.pom (10 KB at 91.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/13/maven-parent-13.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/13/maven-parent-13.pom (23 KB at 248.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/apache/6/apache-6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/apache/6/apache-6.pom (13 KB at 105.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-container-default/1.0-alpha-9/plexus-container-default-1.0-alpha-9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-container-default/1.0-alpha-9/plexus-container-default-1.0-alpha-9.pom (2 KB at 16.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/surefire/surefire-booter/2.12.4/surefire-booter-2.12.4.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/surefire/surefire-api/2.12.4/surefire-api-2.12.4.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/surefire/maven-surefire-common/2.12.4/maven-surefire-common-2.12.4.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/commons/commons-lang3/3.1/commons-lang3-3.1.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-common-artifact-filters/1.3/maven-common-artifact-filters-1.3.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/surefire/surefire-booter/2.12.4/surefire-booter-2.12.4.jar (34 KB at 138.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/3.0.8/plexus-utils-3.0.8.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/surefire/surefire-api/2.12.4/surefire-api-2.12.4.jar (115 KB at 468.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/reporting/maven-reporting-api/2.0.9/maven-reporting-api-2.0.9.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/commons/commons-lang3/3.1/commons-lang3-3.1.jar (309 KB at 904.4 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-toolchain/2.0.9/maven-toolchain-2.0.9.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/reporting/maven-reporting-api/2.0.9/maven-reporting-api-2.0.9.jar (10 KB at 29.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/plugin-tools/maven-plugin-annotations/3.1/maven-plugin-annotations-3.1.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/plugin-tools/maven-plugin-annotations/3.1/maven-plugin-annotations-3.1.jar (14 KB at 31.0 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-toolchain/2.0.9/maven-toolchain-2.0.9.jar (38 KB at 79.1 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-common-artifact-filters/1.3/maven-common-artifact-filters-1.3.jar (31 KB at 62.5 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/3.0.8/plexus-utils-3.0.8.jar (227 KB at 364.6 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/surefire/maven-surefire-common/2.12.4/maven-surefire-common-2.12.4.jar (257 KB at 380.5 KB/sec)
[INFO] Tests are skipped.
[INFO]
[INFO] --- maven-war-plugin:2.3:war (default-war) @ SampleApp ---
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-archiver/2.5/maven-archiver-2.5.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-archiver/2.5/maven-archiver-2.5.pom (5 KB at 56.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-archiver/2.1/plexus-archiver-2.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-archiver/2.1/plexus-archiver-2.1.pom (3 KB at 31.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/3.0/plexus-utils-3.0.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/3.0/plexus-utils-3.0.pom (4 KB at 47.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/sonatype/spice/spice-parent/16/spice-parent-16.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/sonatype/spice/spice-parent/16/spice-parent-16.pom (9 KB at 72.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/sonatype/forge/forge-parent/5/forge-parent-5.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/sonatype/forge/forge-parent/5/forge-parent-5.pom (9 KB at 104.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-io/2.0.2/plexus-io-2.0.2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-io/2.0.2/plexus-io-2.0.2.pom (2 KB at 16.6 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-components/1.1.19/plexus-components-1.1.19.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-components/1.1.19/plexus-components-1.1.19.pom (3 KB at 32.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/3.0.1/plexus-3.0.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/3.0.1/plexus-3.0.1.pom (19 KB at 227.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.15/plexus-interpolation-1.15.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.15/plexus-interpolation-1.15.pom (1018 B at 14.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-io/2.0.5/plexus-io-2.0.5.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-io/2.0.5/plexus-io-2.0.5.pom (3 KB at 25.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-components/1.2/plexus-components-1.2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-components/1.2/plexus-components-1.2.pom (3 KB at 45.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-archiver/2.2/plexus-archiver-2.2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-archiver/2.2/plexus-archiver-2.2.pom (4 KB at 34.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-components/1.1.20/plexus-components-1.1.20.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-components/1.1.20/plexus-components-1.1.20.pom (3 KB at 27.3 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/3.1/plexus-3.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/3.1/plexus-3.1.pom (19 KB at 108.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/3.0.7/plexus-utils-3.0.7.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/3.0.7/plexus-utils-3.0.7.pom (3 KB at 30.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-io/2.0.4/plexus-io-2.0.4.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-io/2.0.4/plexus-io-2.0.4.pom (2 KB at 18.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/com/thoughtworks/xstream/xstream/1.4.3/xstream-1.4.3.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/com/thoughtworks/xstream/xstream/1.4.3/xstream-1.4.3.pom (9 KB at 76.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/com/thoughtworks/xstream/xstream-parent/1.4.3/xstream-parent-1.4.3.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/com/thoughtworks/xstream/xstream-parent/1.4.3/xstream-parent-1.4.3.pom (19 KB at 140.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/codehaus-parent/3/codehaus-parent-3.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/codehaus-parent/3/codehaus-parent-3.pom (5 KB at 37.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/xmlpull/xmlpull/1.1.3.1/xmlpull-1.1.3.1.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/xmlpull/xmlpull/1.1.3.1/xmlpull-1.1.3.1.pom (386 B at 3.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/xpp3/xpp3_min/1.1.4c/xpp3_min-1.1.4c.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/xpp3/xpp3_min/1.1.4c/xpp3_min-1.1.4c.pom (2 KB at 21.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-filtering/1.0-beta-2/maven-filtering-1.0-beta-2.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-filtering/1.0-beta-2/maven-filtering-1.0-beta-2.pom (4 KB at 37.5 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-components/10/maven-shared-components-10.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-shared-components/10/maven-shared-components-10.pom (9 KB at 107.0 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/9/maven-parent-9.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-parent/9/maven-parent-9.pom (33 KB at 213.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.5.6/plexus-utils-1.5.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-utils/1.5.6/plexus-utils-1.5.6.pom (6 KB at 55.1 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/1.0.12/plexus-1.0.12.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus/1.0.12/plexus-1.0.12.pom (10 KB at 101.8 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.6/plexus-interpolation-1.6.pom
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.6/plexus-interpolation-1.6.pom (3 KB at 21.7 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/maven-archiver/2.5/maven-archiver-2.5.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-io/2.0.5/plexus-io-2.0.5.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.15/plexus-interpolation-1.15.jar
[INFO] Downloading: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-archiver/2.2/plexus-archiver-2.2.jar
[INFO] Downloading: https://repo1.maven.org/maven2/com/thoughtworks/xstream/xstream/1.4.3/xstream-1.4.3.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/maven-archiver/2.5/maven-archiver-2.5.jar (22 KB at 202.9 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/xmlpull/xmlpull/1.1.3.1/xmlpull-1.1.3.1.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-interpolation/1.15/plexus-interpolation-1.15.jar (60 KB at 434.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/xpp3/xpp3_min/1.1.4c/xpp3_min-1.1.4c.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-io/2.0.5/plexus-io-2.0.5.jar (57 KB at 360.2 KB/sec)
[INFO] Downloading: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-filtering/1.0-beta-2/maven-filtering-1.0-beta-2.jar
[INFO] Downloaded: https://repo1.maven.org/maven2/xmlpull/xmlpull/1.1.3.1/xmlpull-1.1.3.1.jar (8 KB at 36.4 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/xpp3/xpp3_min/1.1.4c/xpp3_min-1.1.4c.jar (25 KB at 83.5 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/org/apache/maven/shared/maven-filtering/1.0-beta-2/maven-filtering-1.0-beta-2.jar (33 KB at 109.5 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/org/codehaus/plexus/plexus-archiver/2.2/plexus-archiver-2.2.jar (181 KB at 385.2 KB/sec)
[INFO] Downloaded: https://repo1.maven.org/maven2/com/thoughtworks/xstream/xstream/1.4.3/xstream-1.4.3.jar (471 KB at 570.3 KB/sec)
[INFO] Packaging webapp
[INFO] Assembling webapp [SampleApp] in [/opt/app-root/src/target/SampleApp]
[INFO] Processing war project
[INFO] Copying webapp resources [/opt/app-root/src/src/main/webapp]
[INFO] Webapp assembled in [42 msecs]
[INFO] Building war: /opt/app-root/src/target/ROOT.war
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 27.820 s
[INFO] Finished at: 2017-02-21T08:50:53+00:00
[INFO] Final Memory: 14M/140M
[INFO] ------------------------------------------------------------------------
Moving built war files into /wildfly/standalone/deployments for later deployment...
Moving all war artifacts from /opt/app-root/src/target directory into /wildfly/standalone/deployments for later deployment...
'/opt/app-root/src/target/ROOT.war' -> '/wildfly/standalone/deployments/ROOT.war'
Moving all ear artifacts from /opt/app-root/src/target directory into /wildfly/standalone/deployments for later deployment...
Moving all rar artifacts from /opt/app-root/src/target directory into /wildfly/standalone/deployments for later deployment...
Moving all jar artifacts from /opt/app-root/src/target directory into /wildfly/standalone/deployments for later deployment...
...done


Pushing image 172.30.74.35:5000/dsf/test:latest ...
Pushed 0/12 layers, 0% complete
Pushed 1/12 layers, 9% complete
Pushed 2/12 layers, 17% complete
Pushed 3/12 layers, 26% complete
Pushed 4/12 layers, 36% complete
Pushed 5/12 layers, 43% complete
Pushed 6/12 layers, 51% complete
Pushed 7/12 layers, 61% complete
Pushed 8/12 layers, 69% complete
Pushed 8/12 layers, 87% complete
Pushed 9/12 layers, 89% complete
Pushed 10/12 layers, 99% complete
Pushed 11/12 layers, 99% complete
Pushed 12/12 layers, 100% complete
Push successful
`;
