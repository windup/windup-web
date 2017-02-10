package org.jboss.windup.web.services.validators;

import java.util.logging.Logger;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
public class NotBlankValidator implements ConstraintValidator<NotBlankConstraint, String>
{
    private static Logger LOG = Logger.getLogger(NotBlankValidator.class.getSimpleName());

    @Override
    public void initialize(NotBlankConstraint constraintAnnotation)
    {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context)
    {
        return value != null && !value.trim().isEmpty();
    }
}
