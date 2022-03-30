package org.jboss.windup.web.services;

import java.util.Set;

public class SourceTargetTechnologies {
    private Set<String> sources;
    private Set<String> targets;

    public Set<String> getSources() {
        return sources;
    }

    public void setSources(Set<String> sources) {
        this.sources = sources;
    }

    public Set<String> getTargets() {
        return targets;
    }

    public void setTargets(Set<String> targets) {
        this.targets = targets;
    }
}
