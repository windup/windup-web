/**
 * Provides a way for a component to indicate that it has been modified for the user.
 *
 * CanDeactivate rules may use this to determine whether to show a confirmation dialog or prevent navigation away
 * from the page.
 */
export interface IsDirty {
    dirty: boolean;
}
