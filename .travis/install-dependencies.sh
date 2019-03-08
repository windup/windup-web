#!/usr/bin/env bash

echo "Executing before script created script"

function bell() {
  while true; do
    echo -e "\a"
    sleep 60
  done
}
bell &
for GIT_REPO in windup windup-rulesets windup-distribution ; do
    git clone --branch="${DEFAULT_BRANCH}" "https://github.com/${GIT_ORGANIZATION}/${GIT_REPO}.git"
    mvn -f ${GIT_REPO}/pom.xml clean install -DskipTests >> build.log 2>&1
done
exit $?
