<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:jb="urn:jboss:domain:4.0"
    xmlns:ds="urn:jboss:domain:datasources:4.0"
    >
    <xsl:output method="xml"/>

    <xsl:template match="/jb:server/jb:profile/ds:subsystem/ds:datasources/ds:drivers">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
        <ds:driver name="mysql" module="mysqljdbc">
            <ds:xa-datasource-class>com.mysql.jdbc.jdbc2.optional.MysqlXADataSource</ds:xa-datasource-class>
        </ds:driver>
    </xsl:template>

    <!-- Remove (skip) the 'mysql' driver if exists. -->
    <xsl:template match="/jb:server/jb:profile/ds:subsystem/ds:datasources/ds:drivers/ds:driver[@name='mysql']">
    </xsl:template>

    <xsl:template match="/jb:server/jb:profile/ds:subsystem/ds:datasources/">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
        <ds:datasource jndi-name="java:jboss/datasources/windupDS" pool-name="windup-ds-pool" enabled="true" use-java-context="true">
            <ds:connection-url>jdbc:mysql://localhost:3306/windup?characterEncoding=UTF-8&amp;characterSetResults=UTF-8&amp;autoReconnect=true&amp;zeroDateTimeBehavior=convertToNull</ds:connection-url>
            <ds:driver>mysql</ds:driver>
            <ds:security>
                <ds:user-name>windup</ds:user-name>
                <ds:password>windup</ds:password>
            </ds:security>
        </ds:datasource>
    </xsl:template>


    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

</xsl:stylesheet>
