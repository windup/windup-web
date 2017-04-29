
export function SetInProperties (propertyPrefix: string): any {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (descriptor) {
            descriptor.get = function () {
                if (!this.data)
                    return null;

                let result = [];

                for (let key in this.data) {
                    if (!(<string>key).startsWith(propertyPrefix + ":"))
                        continue;

                    let value = <string>key;
                    value = value.substring(propertyPrefix.length + 1);
                    result.push(value);
                }
                return result;
            };
        }
    };
}
