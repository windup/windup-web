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
        echo "Priming build for $REPO"
        mvn -DskipTests clean install -Dwebpack.environment=production

        echo Releasing \"$REPO\" - $REL \(Next dev version is $DEV\)
        echo "Prepare build for $REPO"
        mvn release:prepare \
                -DdevelopmentVersion=$DEV \
                -DreleaseVersion=$REL \
                -Dtag=$REL \
                -DskipTests \
                -Darguments=-DskipTests \
                -Dmvn.test.skip=true \
                -Dfurnace.dot.skip \
                -Dwebpack.environment=production \
                -DpreparationGoals=clean,install || return 1;

        echo "Finished preparing release"

        mvn release:perform \
                -DdevelopmentVersion=$DEV \
                -DreleaseVersion=$REL \
                -Dtag=$REL \
                -DskipTests \
                -Darguments=-DskipTests \
                -Dmvn.test.skip=true \
                -Dfurnace.dot.skip \
                -Dwebpack.environment=production || return 1;

        cd ..
}

WORK_DIR="windup_web_tmp_dir"
echo "Working in temp directory $WORK_DIR"
echo "Cleaning any previous contents from $WORK_DIR"
rm -rf $WORK_DIR
mkdir $WORK_DIR
cd $WORK_DIR
#git clone git@github.com:windup/windup-keycloak-tool.git
git clone git@github.com:windup/windup-web.git --branch 4.0.x
git clone git@github.com:windup/windup-web-distribution.git --branch 4.0.x


cd windup-web
sed -i -e "s/<version.windup>.*<\/version.windup>/<version.windup>$REL<\/version.windup>/g" pom.xml

cd tsmodelsgen-invocation
sed -i -e "s/<version.windup.core>.*<\/version.windup.core>/<version.windup.core>$REL<\/version.windup.core>/g" pom.xml

cd ../tsmodelsgen-maven-plugin
sed -i -e "s/<version.windup.core>.*<\/version.windup.core>/<version.windup.core>$REL<\/version.windup.core>/g" pom.xml
#sed -i -e "s/<version.windup.web>.*<\/version.windup.web>/<version.windup.web>$REL<\/version.windup.web>/g" pom.xml

cd ..

git add -u && git commit -a -m "Preparing for release $REL" && git push origin --all --tags

cd ../

# this is not required to be done if there is not any change from previous release
#release_windup git@github.com:windup/windup-keycloak-tool.git windup-keycloak-tool

# MAIN release block
release_windup git@github.com:windup/windup-web.git windup-web && /
release_windup git@github.com:windup/windup-web-distribution.git windup-web-distribution

cd windup-web
sed -i -e "s/<version.windup>.*<\/version.windup>/<version.windup>$DEV<\/version.windup>/g" pom.xml

cd tsmodelsgen-invocation
sed -i -e "s/<version.windup.core>.*<\/version.windup.core>/<version.windup.core>$DEV<\/version.windup.core>/g" pom.xml

cd ../tsmodelsgen-maven-plugin
sed -i -e "s/<version.windup.core>.*<\/version.windup.core>/<version.windup.core>$DEV<\/version.windup.core>/g" pom.xml
#sed -i -e "s/<version.windup.web>.*<\/version.windup.web>/<version.windup.web>$DEV<\/version.windup.web>/g" pom.xml
cd ..

git add -u && git commit -a -m "Back to development" && git push origin --all --tags

cd ../

#
# #open https://repository.jboss.org/nexus/index.html
# check the builds:
#   * like running Web Console with some applications
#   * deploy to openshift/minishift

# #echo "Cleaning up temp directory $WORK_DIR"
echo "Done"
# #rm -rf $WORK_DIR

