#!/usr/bin/env bash
# Install windup-openshift
git clone --branch="${DEFAULT_BRANCH}" "https://github.com/${GIT_ORGANIZATION}/windup-openshift.git" "${HOME}/dependencies/windup-openshift"

mvn -f ${HOME}/dependencies/windup-openshift clean install -DskipTests \
-Ddocker.name.windup.web=${DOCKER_ID}/windup-web-openshift \
-Ddocker.name.windup.web.executor=${DOCKER_ID}/windup-web-openshift-me \
>> windup_openshift.log 2>&1

tail --lines=50 windup_openshift.log


# Install windup-web-distribution
git clone --branch="${DEFAULT_BRANCH}" "https://github.com/${GIT_ORGANIZATION}/windup-web-distribution.git" "${HOME}/dependencies/windup-web-distribution"

mvn -f ${HOME}/dependencies/windup-web-distribution/pom.xml clean install -DskipTests \
>> windup_web_distribution.log 2>&1

tail --lines=50 windup_web_distribution.log


# Install windup-docker
git clone --branch="${DEFAULT_BRANCH}" "https://github.com/${GIT_ORGANIZATION}/windup-docker.git" "${HOME}/dependencies/windup-docker"

mvn -f ${HOME}/dependencies/windup-docker/pom.xml clean install -DskipTests \
-Ddocker.name.windup.web=${DOCKER_ID}/windup-web \
>> windup_docker.log 2>&1

tail --lines=50 windup_docker.log
