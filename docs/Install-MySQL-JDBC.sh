## E.g. /home/ondra/sw/AS/jboss-eap-7.0
EAP_DIR=$1
if [ "" == "$1" ] ; then
    echo "Where is the EAP to which the MySQL JDBC module should be installed?"
    read EAP_DIR;
fi

MODULES_DIR=$EAP_DIR/modules/system/layers/base
if [ ! -d $MODULES_DIR ] ; then
    echo "Module's dir not found in EAP: " + $MODULES_DIR;
    return -1;
fi
JDBC_DIR=$MODULES_DIR/mysqljdbc
wget -q https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-5.1.38.zip
unzip mysql-connector-java-5.1.38.zip
rm mysql-connector-java-5.1.38.zip
mkdir -p $JDBC_DIR/main
mv mysql-connector-java-5.1.38/mysql-connector-java-5.1.38-bin.jar $JDBC_DIR/main
rm -rf mysql-connector-java-5.1.38/

cat <<EOF > $JDBC_DIR/main/module.xml
<?xml version="1.0" encoding="UTF-8"?>
<module xmlns="urn:jboss:module:1.1" name="mysqljdbc">
    <resources> <resource-root path="mysql-connector-java-5.1.38-bin.jar"/> </resources>
    <dependencies> <module name="javax.api"/> <module name="javax.transaction.api"/> </dependencies>
</module>
EOF

xsltproc -o standalone_.xml addDriver.xsl $EAP_DIR/standalone/configuration/standalone.xml
mv -f standalone_.xml $EAP_DIR/standalone/configuration/standalone.xml

