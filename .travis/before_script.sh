#!/usr/bin/env bash

for GIT_REPO in windup windup-rulesets windup-distribution ; do
    git clone --branch="${DEFAULT_BRANCH}" https://github.com/"${GIT_ORGANIZATION}"/${GIT_REPO}.git
    mvn clean install -DskipTests -f ${GIT_REPO}
done
