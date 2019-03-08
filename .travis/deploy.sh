#!/usr/bin/env bash

GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
GIT_COMMIT_ID="$(git rev-parse --short HEAD)"
DOCKER_TAG="${GIT_BRANCH}_${GIT_COMMIT_ID}"

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"

docker tag ${DOCKER_ID}/windup-web-openshift ${DOCKER_ID}/windup-web-openshift:${DOCKER_TAG}
docker tag ${DOCKER_ID}/windup-web-openshift-messaging-executor ${DOCKER_ID}/windup-web-openshift-messaging-executor:${DOCKER_TAG}

docker push ${DOCKER_ID}/windup-web-openshift:${DOCKER_TAG}
docker push ${DOCKER_ID}/windup-web-openshift-messaging-executor:${DOCKER_TAG}
