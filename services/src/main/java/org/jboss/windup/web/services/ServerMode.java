package org.jboss.windup.web.services;

import java.util.logging.Logger;

/**
 * Server mode of the Windup server - currently either development or production.
 * Used for purposes like throttling log messages and showing details in error messages.
 *
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
public enum ServerMode
{
    DEVELOPMENT, PRODUCTION;

    private static Logger LOG = Logger.getLogger(ServerMode.class.getSimpleName());

    private static final String SERVER_MODE_ENV_VARIABLE = "SERVER_MODE";

    public static ServerMode getServerMode()
    {
        ServerMode modeEnum = ServerMode.PRODUCTION;

        String modeAsString = System.getenv(SERVER_MODE_ENV_VARIABLE);
        try
        {
            if (modeAsString != null )
                modeEnum = ServerMode.valueOf(modeAsString);
        }
        catch (IllegalArgumentException e)
        {
            LOG.warning(e.getMessage());
        }

        return modeEnum;
    }

    public static boolean isProduction()
    {
        return PRODUCTION.equals(getServerMode());
    }
}
