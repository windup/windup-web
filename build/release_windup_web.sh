#!/bin/sh
 : ${1:?"Must specify release version. Ex: 2.0.1.Final"}
 : ${2:?"Must specify next development version. Ex: 2.0.2-SNAPSHOT"}

if [ -f "$HOME/.windup_profile" ]
then
   . $HOME/.windup_profile
fi

REL=$1
DEV=$2

function release_windup {
        REPO=$1
        REPODIR=$2

        cd $REPODIR
        echo Releasing \"$REPO\" - $REL \(Next dev version is $DEV\)
        mvn release:prepare-with-pom clean install \
                -DdevelopmentVersion=$DEV \
                -DreleaseVersion=$REL \
                -Dtag=$REL \
                -DskipTests \
                -Darguments=-DskipTests \
                -Dmvn.test.skip=true \
                -Dfurnace.dot.skip \
                -Dwebpack.environment=production

        echo "Priming build for $REPO"
        mvn -DskipTests clean install -Dwebpack.environment=production

        echo "Prepare build for $REPO"
        mvn release:prepare clean install \
                -DdevelopmentVersion=$DEV \
                -DreleaseVersion=$REL \
                -Dtag=$REL \
                -DskipTests \
                -Darguments=-DskipTests \
                -Dmvn.test.skip=true \
                -Dfurnace.dot.skip \
                -Dwebpack.environment=production

        echo "Finished preparing release"

        mvn release:perform \
                -P jboss-release,gpg-sign \
                -DdevelopmentVersion=$DEV \
                -DreleaseVersion=$REL \
                -Dtag=$REL \
                -DskipTests \
                -Darguments=-DskipTests \
                -Dmvn.test.skip=true \
                -Dfurnace.dot.skip \
                -Dwebpack.environment=production
        cd ..
}

WORK_DIR="windup_web_tmp_dir"
echo "Working in temp directory $WORK_DIR"
echo "Cleaning any previous contents from $WORK_DIR"
rm -rf $WORK_DIR
mkdir $WORK_DIR
cd $WORK_DIR
#git clone git@github.com:windup/windup-keycloak-tool.git
git clone git@github.com:windup/windup-web.git
git clone git@github.com:windup/windup-openshift.git
git clone git@github.com:windup/windup-web-distribution.git

cd windup-web
sed -i -e "s/<version.windup>.*<\/version.windup>/<version.windup>$REL<\/version.windup>/g" pom.xml
cd tsmodelsgen-invocation
sed -i -e "s/<version.windup.core>.*<\/version.windup.core>/<version.windup.core>$REL<\/version.windup.core>/g" pom.xml
sed -i -e "s/<version.windup.web>.*<\/version.windup.web>/<version.windup.web>$REL<\/version.windup.web>/g" pom.xml
cd ../tsmodelsgen-maven-plugin
sed -i -e "s/<version.windup.core>.*<\/version.windup.core>/<version.windup.core>$REL<\/version.windup.core>/g" pom.xml
sed -i -e "s/<version.windup.web>.*<\/version.windup.web>/<version.windup.web>$REL<\/version.windup.web>/g" pom.xml


cd ..

git add -A
git commit -a -m "Preparing for release"
git push origin

cd ../windup-web-distribution
sed -i -e "s/DOCKER_IMAGES_TAG=latest/DOCKER_IMAGES_TAG=$REL/g" src/main/resources/openshift/deployment.properties

git add -A
git commit -a -m "Preparing for release"
git push origin
cd ../

#release_windup git@github.com:windup/windup-keycloak-tool.git windup-keycloak-tool
release_windup git@github.com:windup/windup-web.git windup-web
release_windup git@github.com:windup/windup-openshift.git windup-openshift
release_windup git@github.com:windup/windup-web-distribution.git windup-web-distribution

cd windup-web
sed -i -e "s/<version.windup>.*<\/version.windup>/<version.windup>$DEV<\/version.windup>/g" pom.xml
cd tsmodelsgen-invocation
sed -i -e "s/<version.windup.core>.*<\/version.windup.core>/<version.windup.core>$DEV<\/version.windup.core>/g" pom.xml
sed -i -e "s/<version.windup.web>.*<\/version.windup.web>/<version.windup.web>$DEV<\/version.windup.web>/g" pom.xml
cd ../tsmodelsgen-maven-plugin
sed -i -e "s/<version.windup.core>.*<\/version.windup.core>/<version.windup.core>$DEV<\/version.windup.core>/g" pom.xml
sed -i -e "s/<version.windup.web>.*<\/version.windup.web>/<version.windup.web>$DEV<\/version.windup.web>/g" pom.xml
cd ..
git add -A
git commit -a -m "Back to development"
git push origin

cd ../windup-web-distribution
sed -i -e "s/DOCKER_IMAGES_TAG=$REL/DOCKER_IMAGES_TAG=latest/g" src/main/resources/openshift/deployment.properties

git add -A
git commit -a -m "Back to development"
git push origin
cd ../

#
# #open https://repository.jboss.org/nexus/index.html
# #echo "Cleaning up temp directory $WORK_DIR"
# echo "Done"
# #rm -rf $WORK_DIR
