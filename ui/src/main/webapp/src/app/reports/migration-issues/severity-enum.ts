// TypeScript doesn't support enums with string
// This is an ugly hack based on https://github.com/Microsoft/TypeScript/issues/3192
namespace Severity {
    export type MANDATORY = 'Mandatory';
    export type OPTIONAL = 'Optional';
    export type POTENTIAL_ISSUES = 'Potential Issues';

    export const MANDATORY: MANDATORY = 'Mandatory';
    export const OPTIONAL: OPTIONAL = 'Optional';
    export const POTENTIAL_ISSUES: POTENTIAL_ISSUES = 'Potential Issues';
}

type Severity = Severity.MANDATORY | Severity.OPTIONAL | Severity.POTENTIAL_ISSUES;

namespace Severity {
    export function toArray(): Severity[] {
        return [
            Severity.MANDATORY,
            Severity.OPTIONAL,
            Severity.POTENTIAL_ISSUES
        ];
    }
}
