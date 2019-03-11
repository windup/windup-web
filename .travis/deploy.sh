#!/usr/bin/env bash

GIT_BRANCH="$TRAVIS_BRANCH"
GIT_COMMIT_ID="$(git rev-parse --short HEAD)"
DOCKER_TAG="${GIT_BRANCH}_${GIT_COMMIT_ID}"

echo "Logging..."
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"

echo "Tagging using DOCKER_TAG=${DOCKER_TAG}..."
docker tag ${DOCKER_ID}/windup-web ${DOCKER_ID}/windup-web:${DOCKER_TAG}
docker tag ${DOCKER_ID}/windup-web-openshift ${DOCKER_ID}/windup-web-openshift:${DOCKER_TAG}
docker tag ${DOCKER_ID}/windup-web-openshift-me ${DOCKER_ID}/windup-web-openshift-me:${DOCKER_TAG}

echo "Pushing images..."
docker push ${DOCKER_ID}/windup-web:${DOCKER_TAG}
docker push ${DOCKER_ID}/windup-web-openshift:${DOCKER_TAG}
docker push ${DOCKER_ID}/windup-web-openshift-me:${DOCKER_TAG}
