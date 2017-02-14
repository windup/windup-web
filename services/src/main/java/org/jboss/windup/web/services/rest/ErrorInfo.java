package org.jboss.windup.web.services.rest;

/**
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
public class ErrorInfo
{
    private String message;
    private ExceptionInfo outerException;
    private ExceptionInfo rootCause;


    public ErrorInfo(String message)
    {
        this.message = message;
    }

    public ErrorInfo(String message, ExceptionInfo outerException, ExceptionInfo rootCause)
    {
        this.message = message;
        this.outerException = outerException;
        this.rootCause = rootCause;
    }

    
    public String getMessage()
    {
        return message;
    }

    public void setMessage(String message)
    {
        this.message = message;
    }

    public ExceptionInfo getOuterException()
    {
        return outerException;
    }

    public ErrorInfo setOuterException(Throwable outerException)
    {
        this.outerException = new ExceptionInfo(outerException);
        return this;
    }

    public ExceptionInfo getRootCause()
    {
        return rootCause;
    }

    public ErrorInfo setRootCause(Throwable rootCause)
    {
        this.rootCause = new ExceptionInfo(rootCause);
        return this;
    }


    public static class ExceptionInfo
    {
        String message;
        Class<? extends Throwable> type;
        String location;

        public ExceptionInfo(Throwable ex)
        {
            this.message = ex.getMessage();
            this.type = ex.getClass();
            if (ex.getStackTrace().length == 0)
                return;

            StackTraceElement stackEntry = ex.getStackTrace()[0];
            //         at org.hibernate.exception.internal.SQLStateConversionDelegate.convert(SQLStateConversionDelegate.java:112)
            this.location = String.format("    at %s.%s(%s:%d)", stackEntry.getClassName(), stackEntry.getMethodName(), stackEntry.getFileName(), stackEntry.getLineNumber());
        }

        public ExceptionInfo(String message, Class<? extends Throwable> type, String location)
        {
            this.message = message;
            this.type = type;
            this.location = location;
        }

        public String getMessage()
        {
            return message;
        }

        public Class<? extends Throwable> getType()
        {
            return type;
        }

        public String getLocation()
        {
            return location;
        }
    }
}
