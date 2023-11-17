package org.jboss.windup.web.services.json;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import org.jboss.windup.web.services.model.WindupExecution;

import java.io.File;
import java.io.IOException;
import java.util.TimeZone;

/**
 * This contains utility methods for converting {@link WindupExecution}
 * objects to and from JSON.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WindupExecutionJSONUtil
{
    public static String serializeToString(WindupExecution execution) throws IOException
    {
        return getObjectWriter().writeValueAsString(execution);
    }

    public static void serializeToFile(File outputFile, WindupExecution execution) throws IOException
    {
        getObjectWriter().writeValue(outputFile, execution);
    }

    public static WindupExecution readJSONFromFile(File file) throws IOException
    {
        return getObjectMapper().reader().forType(WindupExecution.class).readValue(file);
    }

    public static WindupExecution readJSON(String input) throws IOException
    {
        return getObjectMapper().reader().forType(WindupExecution.class).readValue(input);
    }

    private static ObjectMapper getObjectMapper()
    {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setTimeZone(TimeZone.getDefault());
        objectMapper.addMixIn(Object.class, MyHandlerFilterMixin.class);
        return objectMapper;
    }

    private static ObjectWriter getObjectWriter()
    {
        ObjectMapper objectMapper = getObjectMapper();
        SimpleBeanPropertyFilter handlerFilter = SimpleBeanPropertyFilter.serializeAllExcept("handler", "delegate");
        FilterProvider filters = new SimpleFilterProvider().addFilter("proxyFilter", handlerFilter);
        return objectMapper.writer(filters);
    }

    @JsonFilter("proxyFilter")
    public static class MyHandlerFilterMixin
    {

    }
}
