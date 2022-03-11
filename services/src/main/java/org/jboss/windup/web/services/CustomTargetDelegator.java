package org.jboss.windup.web.services;

import org.jboss.windup.config.InputType;
import org.jboss.windup.config.ValidationResult;
import org.jboss.windup.exec.configuration.options.TargetOption;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class CustomTargetDelegator extends TargetOption {

    private final TargetOption targetOption;
    private final Set<String> additionalTargetTechnologies;

    public CustomTargetDelegator(TargetOption targetOption, Set<String> additionalTargetTechnologies) {
        this.targetOption = targetOption;
        this.additionalTargetTechnologies = additionalTargetTechnologies;
    }

    @Override
    public Collection<?> getAvailableValues() {
        Collection<?> systemAvailableValues = targetOption.getAvailableValues();
        return Stream.concat(systemAvailableValues.stream(), additionalTargetTechnologies.stream())
                .collect(Collectors.toSet());
    }

    @Override
    public String getName() {
        return targetOption.getName();
    }

    @Override
    public String getLabel() {
        return targetOption.getLabel();
    }

    @Override
    public String getDescription() {
        return targetOption.getDescription();
    }

    @Override
    public InputType getUIType() {
        return targetOption.getUIType();
    }

    @Override
    public Class<String> getType() {
        return targetOption.getType();
    }

    @Override
    public boolean isRequired() {
        return targetOption.isRequired();
    }

    @Override
    public ValidationResult validate(Object values) {
        return super.validate(values);
    }
}
