import {FrameModel} from './FrameModel';
import {DiscriminatorMappingData} from './DiscriminatorMappingData';

/**
 * Mapping between discriminator and model classes.
 */
export class DiscriminatorMapping extends DiscriminatorMappingData
{
    public static getModelClassByDiscriminator(discriminator: string): typeof FrameModel
    {
        return this.mapping[discriminator];
    }

    public static getDiscriminatorByModelClass(clazz: typeof FrameModel)
    {
        // It should be in the class' static data.
        if(clazz.discriminator)
            return clazz.discriminator;

        // Find it in mapping
        for (var disc in this.mapping)
        {
            if (this.mapping[disc] === clazz)
                return disc;
        }
        return null;
    }

    public static scanGlobalClasses()
    {
        DiscriminatorMapping.mapping = {};

		var props = Object.getOwnPropertyNames(window);
		for (let i = 0; i < props.length; i++) {
			let key = props[i];
            if (key.startsWith("webkit"))
                continue;
			let val = window[key];
            if (val == null)
                continue;
            if (typeof val !== 'function')
                continue;
            if (val.prototype == void 0)
                continue;
            //if (key.startsWith("Test"))
            //    console.log("AAAAAAAA " + key)///
            //    console.log("AAAAAAAA " + key + " superclass: " + getParentClass(val))///
            if (val.discriminator === void 0)
                continue;
			/*console.log(`Key: ${key}, Type: ${typeof val},  ` +
                `Disc: ${val.discriminator}, ` +
				`Proto: ${val.prototype}, ` +
				`Ctor: ${val.constructor}, ` +
				`Ctor.Prototype: ${val.constructor ? val.constructor.prototype : '-'}, ` +
				`Proto.Ctor: ${val.prototype ? val.prototype.constructor : '-'}`
			);/**/
            //if (val.prototype.constructor !== FrameModel)
			/*if (!hasSuperClass(val, FrameModel))
                continue;
            */

            let modelClass = (<typeof FrameModel>val.prototype.constructor);
            let discr = modelClass.discriminator;
            this.mapping[discr] == modelClass;
        }
    }
}


export function hasSuperClass(clazz: typeof Object, ancestor: typeof Object): boolean {
	if(new clazz() instanceof ancestor)
		return true;
}

export function getParentClass(clazz){
    return parent = Object.getPrototypeOf(Object.getPrototypeOf(new clazz())).constructor;
}

