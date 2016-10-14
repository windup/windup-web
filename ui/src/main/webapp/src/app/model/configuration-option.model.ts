export interface ConfigurationOption {
    /**
     * Returns the name of the parameter. This should be a short name that is suitable for use in a command line parameter (for example, "packages" or
     * "excludePackages").
     */
    name:string;

    /**
     * Return a short amount of descriptive text regarding the option (for example, "Exclude Packages").
     */
    label:string;

    /**
     * Returns descriptive text that may be more lengthy and descriptive (for example, "Excludes the specified Java packages from Windup's scans").
     */
    description:string;

    /**
     * Returns the datatype for this Option (typically File, String, or List<String>).
     */
    type:string;

    /**
     * Returns a type that can be used as a hint to indicate what type of user interface should be presented for this option.
     */
    uitype:string;

    /**
     * Indicates whether or not this option must be specified.
     */
    required:boolean;

    /**
     * Default value for this option (if not set by user).
     */
    defaultValue:any;

    /**
     * Returns an ordered list of available values.
     */
    availableValues:any[];

    /**
     * Indicates the "priority" of this option. Higher values (and therefore higher priority) of this value will result in the item being asked
     * earlier than items with a lower priority value.
     */
    priority:number;
}