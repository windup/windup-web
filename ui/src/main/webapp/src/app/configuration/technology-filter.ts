import {RuleProviderEntity, Technology} from "../generated/windup-services";
import {utils} from "../shared/utils";
import {FilterOption} from "../shared/filter/text-filter.component";

function filterByNameAndVersion(filter: FilterOption<Technology>, provider: RuleProviderEntity): boolean {
    const propertyValues: Technology[] = provider[filter.field];

    return propertyValues.some(item => {
        return item === filter.value || item.name === filter.value.name && item.versionRange === filter.value.versionRange;
    });
}

function filterByName(filter: FilterOption<string>, provider: RuleProviderEntity): boolean {
    const propertyValues: Technology[] = provider[filter.field];

    return propertyValues.some(item => {
        return item.name === filter.value;
    });
}

export function getAvailableFilters(ruleProviders: RuleProviderEntity[], field: 'sources'|'targets') {
    const allTechnologies = utils.Arrays.flatMap<RuleProviderEntity, Technology>(ruleProviders, provider => provider[field]);

    const filteredTechnologies: Technology[] = allTechnologies.filter((item: Technology, index, array) => {
        // remove duplicities from array (keep only first occurrence of item)
        return array.findIndex((indexItem: Technology) => indexItem.id === item.id) === index;
    }).sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else {
            return 0;
        }
    });

    const technologyVersions = utils.Arrays.flatMap<Technology, FilterOption>(filteredTechnologies, technology => getAllTechnologyVersionsFilters(technology))
        // remove duplicities from array (keep only first occurrence of item)
        .filter((item: FilterOption, index, array) => array.findIndex(indexItem => indexItem.name === item.name) === index);
    technologyVersions.forEach(item => item.field = field);

    return technologyVersions;
}

function getAllTechnologyVersionsFilters(technology: Technology): FilterOption[] {
    const nameOption = {
        name: technology.name,
        value: technology.name,
        field: '',
        callback: function(provider: RuleProviderEntity) {
            return filterByName(this, provider);
        }
    };

    if (technology.versionRange === null || technology.versionRange.length === 0) {
        return [ nameOption ];
    }

    const versionRanges = technology.versionRange.replace(/[(\[\])]/g, '').split(',').filter(version => version !== '');

    return [
        nameOption,
        ...versionRanges.map(version => {
            return {
                name: `${technology.name} ${version}`,
                value: technology,
                field: '',
                callback: function(provider: RuleProviderEntity) {
                    return filterByNameAndVersion(this, provider);
                }
            };
        })
    ];
}

function advancedFilter(technology: Technology) {
    if (technology.versionRange === null || technology.versionRange.length === 0) {
        return [ technology.name ];
    }

    let technologyVersions = [ ];
    const versionRanges = technology.versionRange.replace(/[(\[\])]/g, '').split(',');

    if (versionRanges.length > 2) {
        // treat version ranges as set
        technologyVersions = [ technology.name, ...versionRanges.map(version => `${technology.name} ${version}`) ];
    } else {
        let versionFrom = '';

        if (technology.versionRange[0] === '[') {
            versionFrom = versionRanges[0];
        } else if (technology.version) {
        }
    }
}
