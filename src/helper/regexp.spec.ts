import * as assert from 'assert';
import * as RegexHelpers from './regex';

describe('regex helpers', () => {
    it('test', () => {
        const regex = /foo bar/g;

        assert.strictEqual(regex.test('foo bar'), true);
        // Read to the end of the string
        assert.strictEqual(regex.lastIndex, 7);
        // Fails now as the lastIndex is 7
        assert.strictEqual(regex.test('foo bar'), false);

        // Resets last index before testing
        assert.strictEqual(RegexHelpers.test('foo bar', regex), true);
        // Resets last index after testing
        assert.strictEqual(regex.lastIndex, 0);

        // And keeps working
        assert.strictEqual(RegexHelpers.test('foo bar', regex), true);
        assert.strictEqual(RegexHelpers.test('foo bar', regex), true);
        assert.strictEqual(RegexHelpers.test('foo bar', regex), true);
    });

    it('testUri', () => {
        const regex = /.*\.html/;
        assert.strictEqual(RegexHelpers.testUri('index.html', regex), true);
        assert.strictEqual(RegexHelpers.testUri('foo/bar/index.html', regex), true);
        assert.strictEqual(RegexHelpers.testUri('c:\\temp\\index.html', regex), true);
        assert.strictEqual(RegexHelpers.testUri('file://c:\\temp\\index.html', regex), true);
    });
});