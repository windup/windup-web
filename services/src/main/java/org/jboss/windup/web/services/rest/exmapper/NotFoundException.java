package org.jboss.windup.web.services.rest.exmapper;

/**
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
public class NotFoundException extends IllegalArgumentException
{
    public NotFoundException(String string) {
        super(string);
    }

    public NotFoundException(String string, Throwable thrwbl) {
        super(string, thrwbl);
    }
}
