import {BaseFrameModel as BaseModel} from './BaseFrameModel';

/**
 * Mapping between discriminator and model classes.
 * This probably needs inheritance due to how TS works (at the time I am playing with it).
 * 
 * This could theoretically support multiple base models, like, DiscriminatorMapping<T extends BaseModel>,
 * but TypeScript can't deal with class generics well.
 */
export abstract class DiscriminatorMapping
{
    public static getMapping() : { [key: string]: typeof BaseModel } { return {}; }
    
    public static getModelClassByDiscriminator(discriminator: string): typeof BaseModel
    {
        //return this.mapping[discriminator];
        return this.getMapping()[discriminator];
    }

    public static getDiscriminatorByModelClass(clazz: typeof BaseModel)
    {
        // It should be in the class' static data.
        if(clazz.discriminator)
            return clazz.discriminator;

        // Find it in mapping
        for (var disc in this.getMapping())
        {
            if (this.getMapping()[disc] === clazz)
                return disc;
        }
        return null;
    }

    /**
     * This is intended to scan all TS classes that extend BaseFrameModel.
     * However there's no supported way to do it 
     * and the one used here may stop working in future TS versions.
     * Therefore for now, let's rely on the generated DiscriminatorMappingData.ts.
     */
    public static scanGlobalClasses() : { [key: string]: typeof BaseModel }
    {
        let mapping_ : { [key: string]: typeof BaseModel } = {};
        ///DiscriminatorMapping.mapping = {};

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
            //if (val.prototype.constructor !== BaseModel)
            /*if (!hasSuperClass(val, BaseModel))
                continue;
            */

            let modelClass = (<typeof BaseModel>val.prototype.constructor);
            let discr = modelClass.discriminator;
            mapping_[discr] == modelClass;
        }
        
        ///this.mapping = mapping_;
        return mapping_;
    }
    
    public toString() : string {
        let mapping_ = Object.getPrototypeOf(this).constructor.getMapping();
        return `${Object.getPrototypeOf(this).constructor}{${Object.getOwnPropertyNames(mapping_).length}}`;
    }
}


export function hasSuperClass(clazz: typeof Object, ancestor: typeof Object): boolean {
	if(new clazz() instanceof ancestor)
		return true;
}

export function getParentClass(clazz){
    return parent = Object.getPrototypeOf(Object.getPrototypeOf(new clazz())).constructor;
}

