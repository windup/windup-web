package org.jboss.windup.web.services.validators;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.logging.Logger;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class FileExistsValidator implements ConstraintValidator<FileExistsConstraint, String>
{
    private static Logger LOG = Logger.getLogger(FileExistsValidator.class.getSimpleName());

    @Override
    public void initialize(FileExistsConstraint constraintAnnotation)
    {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context)
    {
        if (value != null)
            LOG.info("Validating path: " + Paths.get(value).toAbsolutePath().normalize().toString());
        return value != null && Files.exists(Paths.get(value));
    }
}
