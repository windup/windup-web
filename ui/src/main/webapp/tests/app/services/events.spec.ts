import {
    ExecutionUpdatedEvent, ExecutionCompletedEvent,
    WindupEvent, ApplicationGroupEvent
} from "../../../src/app/core/events/windup-event";

describe('events test', () => {

    describe('hierarchical evaluation of isTypeOf should work, ExecutionCompletedEvent', () => {
        let event: WindupEvent;

        beforeEach(() => {
            event = new ExecutionCompletedEvent(null, null, null);
        });

        it('should be typeOf ExecutionCompletedEvent', () => {
            expect(event.isTypeOf(ExecutionCompletedEvent)).toBe(true);
        });

        it('should be typeOf ExecutionUpdatedEvent', () => {
            expect(event.isTypeOf(ExecutionUpdatedEvent)).toBe(true);
        });

        it('should be typeOf ExecutionEvent', () => {
            expect(event.isTypeOf(ExecutionUpdatedEvent)).toBe(true);
        });

        it('should be typeOf ApplicationGroupEvent', () => {
            expect(event.isTypeOf(ApplicationGroupEvent)).toBe(true);
        });

        it('should be typeOf WindupEvent', () => {
            expect(event.isTypeOf(WindupEvent)).toBe(true);
        });
    });
});
