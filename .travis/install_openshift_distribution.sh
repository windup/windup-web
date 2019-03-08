#!/usr/bin/env bash

git clone --branch="${DEFAULT_BRANCH}" "https://github.com/${GIT_ORGANIZATION}/windup-openshift.git"
 
mvn clean install -f windup-openshift \
-Ddocker.name.windup.web=${DOCKER_ID}/windup-web-openshift \
-Ddocker.name.windup.web.executor=${DOCKER_ID}/windup-web-openshift-messaging-executor