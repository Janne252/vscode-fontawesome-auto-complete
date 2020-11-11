import * as assert from 'assert';
import { setCharacterCase } from './string';

describe('string helpers', () => {
    it('setCharacterCase', () => {
        
        // Standard
        assert.strictEqual(setCharacterCase('', 0, 'lower'), '');
        assert.strictEqual(setCharacterCase('A', 0, 'lower'), 'a');
        assert.strictEqual(setCharacterCase('a', 0, 'lower'), 'a');
        assert.strictEqual(setCharacterCase('a', 0, 'upper'), 'A');

        // Non-alphabets
        assert.strictEqual(setCharacterCase('_', 0, 'upper'), '_');
        assert.strictEqual(setCharacterCase('_', 0, 'lower'), '_');

        // Unicode
        assert.strictEqual(setCharacterCase('ä', 0, 'upper'), 'Ä');
        assert.strictEqual(setCharacterCase('Ö', 0, 'lower'), 'ö');
        assert.strictEqual(setCharacterCase('💩', 0, 'upper'), '💩');
        assert.strictEqual(setCharacterCase('💩', 0, 'lower'), '💩');

        // Words
        assert.strictEqual(setCharacterCase('fooBar', 0, 'lower'), 'fooBar');
        assert.strictEqual(setCharacterCase('fooBar', 0, 'upper'), 'FooBar');
    });
});