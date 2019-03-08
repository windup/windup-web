#!/usr/bin/env bash

echo "Executing before script created script"

for GIT_REPO in windup windup-rulesets windup-distribution ; do
    git clone --branch="${DEFAULT_BRANCH}" "https://github.com/${GIT_ORGANIZATION}/${GIT_REPO}.git"
    mvn -f ${GIT_REPO}/pom.xml clean install -DskipTests
done
