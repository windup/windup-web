#!/usr/bin/env bash

git clone --branch="${DEFAULT_BRANCH}" "https://github.com/${GIT_ORGANIZATION}/windup-web-distribution.git"
mvn -f windup-web-distribution/pom.xml clean install -DskipTests
