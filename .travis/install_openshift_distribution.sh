#!/usr/bin/env bash

echo "$ git clone --branch=${DEFAULT_BRANCH} https://github.com/${GIT_ORGANIZATION}/windup-openshift.git"
git clone --branch="${DEFAULT_BRANCH}" "https://github.com/${GIT_ORGANIZATION}/windup-openshift.git"
 
mvn clean install -f windup-openshift \
-Ddocker.name.windup.web=${DOCKER_ID}/windup-web-openshift \
-Ddocker.name.windup.web.executor=${DOCKER_ID}/windup-web-openshift-me \
-Ddocker.name.windup.web.standalone=${DOCKER_ID}/windup-web \
>> install_openshift_distribution.log 2>&1

echo "$ tail --lines=50 install_openshift_distribution.log"
tail --lines=50 install_openshift_distribution.log