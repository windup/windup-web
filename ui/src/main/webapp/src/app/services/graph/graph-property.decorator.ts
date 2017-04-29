
export function GraphProperty (name: string):any {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (descriptor) {
            descriptor.get = function () {
                if (!this.data)
                    return null;
                return this.data[name];
            };
        }
    };
}
