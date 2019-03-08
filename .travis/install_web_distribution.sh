#!/usr/bin/env bash

echo "$ git clone --branch=${DEFAULT_BRANCH} https://github.com/${GIT_ORGANIZATION}/windup-web-distribution.git"
git clone --branch="${DEFAULT_BRANCH}" "https://github.com/${GIT_ORGANIZATION}/windup-web-distribution.git"

mvn -f windup-web-distribution/pom.xml clean install -DskipTests >> install_web_distribution.log 2>&1

echo "$ tail --lines=50 install_web_distribution.log"
tail --lines=50 install_web_distribution.log
