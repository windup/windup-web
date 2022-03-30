package org.jboss.windup.web.services;

import org.jboss.windup.config.InputType;
import org.jboss.windup.config.ValidationResult;
import org.jboss.windup.exec.configuration.options.SourceOption;
import org.jboss.windup.exec.configuration.options.TargetOption;

import java.util.Collection;
import java.util.Set;

public class CustomSourceDelegator extends TargetOption {

    private final SourceOption sourceOption;
    private final Set<String> additionalSourceTechnologies;

    public CustomSourceDelegator(SourceOption sourceOption, Set<String> additionalSourceTechnologies) {
        this.sourceOption = sourceOption;
        this.additionalSourceTechnologies = additionalSourceTechnologies;
    }

    @Override
    public Collection<?> getAvailableValues() {
        Set<String> systemAvailableValues = (Set<String>) sourceOption.getAvailableValues();
        systemAvailableValues.addAll(additionalSourceTechnologies);
        return systemAvailableValues;
    }

    @Override
    public String getName() {
        return sourceOption.getName();
    }

    @Override
    public String getLabel() {
        return sourceOption.getLabel();
    }

    @Override
    public String getDescription() {
        return sourceOption.getDescription();
    }

    @Override
    public InputType getUIType() {
        return sourceOption.getUIType();
    }

    @Override
    public Class<String> getType() {
        return sourceOption.getType();
    }

    @Override
    public boolean isRequired() {
        return sourceOption.isRequired();
    }

    @Override
    public ValidationResult validate(Object values) {
        return super.validate(values);
    }
}
