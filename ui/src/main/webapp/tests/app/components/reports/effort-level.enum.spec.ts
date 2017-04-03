import { EffortLevelPipe } from "../../../../src/app/reports/effort-level.enum";

describe('EffortLevelPipe', () => {
    let pipe: EffortLevelPipe;
    beforeEach(() => {
        pipe = new EffortLevelPipe();
    });
    it('transforms "0" to "Info"', () => {
        expect(pipe.transform(0)).toEqual('Info');
    });
    it('transforms "1" to "Trivial"', () => {
        expect(pipe.transform(1)).toEqual('Trivial');
    });
});