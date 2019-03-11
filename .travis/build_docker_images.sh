#!/usr/bin/env bash

# Install windup-openshift
echo "$ git clone --branch=${DEFAULT_BRANCH} https://github.com/${GIT_ORGANIZATION}/windup-openshift.git"
git clone --branch="${DEFAULT_BRANCH}" "https://github.com/${GIT_ORGANIZATION}/windup-openshift.git"

mvn -f windup-openshift clean install -DskipTests \
-Ddocker.name.windup.web=${DOCKER_ID}/windup-web-openshift \
-Ddocker.name.windup.web.executor=${DOCKER_ID}/windup-web-openshift-me \
>> windup_openshift.log 2>&1

echo "$ tail --lines=50 windup_openshift.log"
tail --lines=50 windup_openshift.log


# Install windup-web-distribution
echo "$ git clone --branch=${DEFAULT_BRANCH} https://github.com/${GIT_ORGANIZATION}/windup-web-distribution.git"
git clone --branch="${DEFAULT_BRANCH}" "https://github.com/${GIT_ORGANIZATION}/windup-web-distribution.git"

mvn -f windup-web-distribution/pom.xml clean install -DskipTests \
>> windup_web_distribution.log 2>&1

echo "$ tail --lines=50 windup_web_distribution.log"
tail --lines=50 windup_web_distribution.log


# Install windup-docker
echo "$ git clone --branch=${DEFAULT_BRANCH} https://github.com/${GIT_ORGANIZATION}/windup-docker.git"
git clone --branch="${DEFAULT_BRANCH}" "https://github.com/${GIT_ORGANIZATION}/windup-docker.git"

mvn -f windup-docker/pom.xml clean install -DskipTests \
-Ddocker.name.windup.web=${DOCKER_ID}/windup-web \
>> windup_docker.log 2>&1

echo "$ tail --lines=50 windup_docker.log"
tail --lines=50 windup_docker.log
