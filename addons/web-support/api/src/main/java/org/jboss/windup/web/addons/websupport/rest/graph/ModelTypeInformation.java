package org.jboss.windup.web.addons.websupport.rest.graph;

/**
 * Contains the @TypeValue discriminator value and classname for a Tinkerpop Frame.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ModelTypeInformation
{
    private String discriminator;
    private String className;

    public ModelTypeInformation()
    {
    }

    public ModelTypeInformation(String discriminator, String className)
    {
        this.discriminator = discriminator;
        this.className = className;
    }

    /**
     * Gets the discriminator (value of the @TypeValue annotation).
     */
    public String getDiscriminator()
    {
        return discriminator;
    }

    /**
     * Gets the simple class name (no package name).
     */
    public String getClassName()
    {
        return className;
    }

    @Override
    public String toString()
    {
        return "ModelTypeInformation{" +
                    "discriminator='" + discriminator + '\'' +
                    ", className='" + className + '\'' +
                    '}';
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
            return true;
        if (!(o instanceof ModelTypeInformation))
            return false;

        ModelTypeInformation that = (ModelTypeInformation) o;

        if (discriminator != null ? !discriminator.equals(that.discriminator) : that.discriminator != null)
            return false;
        return className != null ? className.equals(that.className) : that.className == null;
    }

    @Override
    public int hashCode()
    {
        int result = discriminator != null ? discriminator.hashCode() : 0;
        result = 31 * result + (className != null ? className.hashCode() : 0);
        return result;
    }
}
