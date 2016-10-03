package org.jboss.windup.web.services.rest;

class ErrorMessage
{
    private String error;

    public ErrorMessage(String error)
    {
        this.error = error;
    }

    public String getError()
    {
        return error;
    }
}
