package org.jboss.windup.web.services.rest;

import java.io.IOException;

import org.junit.Assert;
import org.junit.Test;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class UnhandledExceptionHandlerTest
{
    static class ExtendsException extends Exception
    {
        public ExtendsException()
        {
            super();
        }

        public ExtendsException(String message)
        {
            super(message);
        }

        public ExtendsException(String message, Throwable cause)
        {
            super(message, cause);
        }

        public ExtendsException(Throwable cause)
        {
            super(cause);
        }
    }

    @Test
    public void findFirstValidOccurrenceInExceptionChain()
    {
        Throwable cause = new RuntimeException("This is cause");
        Throwable exc = new ExtendsException("This is just a test", cause);

        Throwable foundCause = UnhandledExceptionHandler.findFirstOccurenceInExceptionChain(RuntimeException.class, exc);

        Assert.assertEquals(cause, foundCause);
    }

    @Test
    public void findFirstOccurrenceInExceptionChainInvalid()
    {
        Throwable cause = new RuntimeException("This is cause");
        Throwable exc = new ExtendsException("This is just a test", cause);

        Throwable foundCause = UnhandledExceptionHandler.findFirstOccurenceInExceptionChain(IOException.class, exc);

        Assert.assertEquals(null, foundCause);
    }

    @Test
    public void findFirstOccurrenceInExceptionChainNoCause()
    {
        Throwable exc = new ExtendsException("This is just a test");

        Throwable foundCause = UnhandledExceptionHandler.findFirstOccurenceInExceptionChain(ExtendsException.class, exc);

        Assert.assertEquals(exc, foundCause);
    }

    @Test
    public void findFirstValidOccurrenceInExceptionChainString()
    {
        Throwable cause = new RuntimeException("This is cause");
        Throwable exc = new ExtendsException("This is just a test", cause);

        Throwable foundCause = UnhandledExceptionHandler.findFirstOccurenceInExceptionChain(RuntimeException.class.getName(), exc);

        Assert.assertEquals(cause, foundCause);
    }

    @Test
    public void findFirstOccurrenceInExceptionChainInvalidString()
    {
        Throwable cause = new RuntimeException("This is cause");
        Throwable exc = new ExtendsException("This is just a test", cause);

        Throwable foundCause = UnhandledExceptionHandler.findFirstOccurenceInExceptionChain(IOException.class.getName(), exc);

        Assert.assertEquals(null, foundCause);
    }

    @Test
    public void findFirstOccurrenceInExceptionChainNoCauseString()
    {
        Throwable exc = new ExtendsException("This is just a test");

        Throwable foundCause = UnhandledExceptionHandler.findFirstOccurenceInExceptionChain(ExtendsException.class.getName(), exc);

        Assert.assertEquals(exc, foundCause);
    }
}
