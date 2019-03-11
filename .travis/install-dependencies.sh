#!/usr/bin/env bash

for GIT_REPO in windup windup-rulesets windup-distribution ; do
    echo "$ git clone --branch=${DEFAULT_BRANCH} https://github.com/${GIT_ORGANIZATION}/${GIT_REPO}.git ${HOME}/dependencies/${GIT_REPO}"
    git clone --branch="${DEFAULT_BRANCH}" "https://github.com/${GIT_ORGANIZATION}/${GIT_REPO}.git" "${HOME}/dependencies/${GIT_REPO}"

    echo "$ mvn -f ${HOME}/dependencies/${GIT_REPO}/pom.xml clean install -DskipTests >> install_dependencies.log 2>&1"
    mvn -f ${HOME}/dependencies/${GIT_REPO}/pom.xml clean install -DskipTests >> install_dependencies.log 2>&1

    echo "$ tail --lines=50 install_dependencies.log"
    tail --lines=50 install_dependencies.log
done
