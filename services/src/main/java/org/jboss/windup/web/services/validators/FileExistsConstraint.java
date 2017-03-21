package org.jboss.windup.web.services.validators;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Constraint(validatedBy = FileExistsValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface FileExistsConstraint
{
    /**
     * This special marker bypasses the existence check. This can be used to bypass validation
     * on files that have been marked deleted.
     */
    String DELETED_FILEPATH = "WINDUP_FILE_DELETED";

    String message() default "File does not exist";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
