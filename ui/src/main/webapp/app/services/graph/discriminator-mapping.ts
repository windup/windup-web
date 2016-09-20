import {BaseModel} from './base.model';

/**
 * Mapping between discriminator and model classes.
 */
export class DiscriminatorMapping
{
    private static mapping: { [key: string]: typeof BaseModel } = {};

    public static getModelClassByDiscriminator(discriminator: string): typeof BaseModel
    {
        return this.mapping[discriminator];
    }

    public static addModelClass(clazz: typeof BaseModel) {
        this.mapping[clazz.discriminator] = clazz;
    }

    public static getDiscriminatorByModelClass(clazz: typeof BaseModel)
    {
        // It should be in the class' static data.
        if(clazz.discriminator)
            return clazz.discriminator;


        return null;
    }
}

export function getParentClass(clazz){
    return parent = Object.getPrototypeOf(Object.getPrototypeOf(new clazz())).constructor;
}

