import {BaseFrameModel} from './BaseFrameModel';

/**
 * Mapping between discriminator and model classes.
 */
export class DiscriminatorMapping
{
    static mapping: { [key: string]: typeof BaseFrameModel } = {};

    public static getModelClassByDiscriminator(discriminator: string): typeof BaseFrameModel
    {
        return this.mapping[discriminator];
    }

    public static addModelClass(clazz: typeof BaseFrameModel) {
        this.mapping[clazz.discriminator] = clazz;
    }

    public static getDiscriminatorByModelClass(clazz: typeof BaseFrameModel)
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

