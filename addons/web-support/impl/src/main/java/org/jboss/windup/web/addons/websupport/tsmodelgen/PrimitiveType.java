package org.jboss.windup.web.addons.websupport.tsmodelgen;

/**
 * Handles String, boolean, byte, char, short, int, long, float, and double.
 * 
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
enum PrimitiveType implements ModelType
{
    STRING("string"), NUMBER("number"), BOOLEAN("boolean"), ENUM("string"), ANY("any");

    private String typeScriptTypeName;

    PrimitiveType(String tsType)
    {
        this.typeScriptTypeName = tsType;
    }

    static PrimitiveType from(Class type)
    {
        if (Iterable.class.isAssignableFrom(type))
        {
            throw new IllegalArgumentException("Given type is Iterable (not a primitive type): " + type.getName());
        }
        if (String.class.isAssignableFrom(type))
        {
            return STRING;
        }
        if (Number.class.isAssignableFrom(type) || type.equals(Integer.TYPE) || type.equals(Long.TYPE) || type.equals(Double.TYPE)
                    || type.equals(Short.TYPE) || type.equals(Float.TYPE) || type.equals(Byte.TYPE) || type.equals(Character.TYPE)
                    || type.equals(Byte.TYPE))
        {
            return NUMBER;
        }
        if (Boolean.class.isAssignableFrom(type) || type.equals(Boolean.TYPE))
        {
            return BOOLEAN;
        }
        if (Enum.class.isAssignableFrom(type))
        {
            return ENUM;
        }
        // TypeScriptModelsGenerator.LOG.warning("Not a primitive type: " + type.getTypeName());
        return ANY;
    }

    @Override
    public String getTypeScriptTypeName()
    {
        return typeScriptTypeName;
    }
}
