import * as assert from 'assert';
import { IconStyle, iconStylePrefix, prefix } from '.';
import { InsertionTemplate, InsertionTemplateTokenFormat } from './transformation';

describe('transformation', () => {
    it('InsertionTemplate.matches', () => {
        assert.strictEqual(new InsertionTemplate('**/*.html', '').matches({fileName: 'foo/bar/index.html'}), true);
        assert.strictEqual(new InsertionTemplate('**/*.vue', '').matches({fileName: 'foo/bar/index.html'}), false);
        assert.strictEqual(new InsertionTemplate('**/*.*', '').matches({fileName: 'foo/bar/index.html'}), true);
    });

    it('InsertionTemplate.format', () => {
        const icon = {
            name: 'sort-numeric-up-alt',
            prefix: prefix,
            style: iconStylePrefix[IconStyle.solid],
            styleName: IconStyle.solid,
        };

        assert.strictEqual(
            new InsertionTemplate('', `{prefix} {name} {style} {styleName}`).render(icon),
            `fa- sort-numeric-up-alt fas solid`
        );
        assert.strictEqual(
            new InsertionTemplate('', `{name:${InsertionTemplateTokenFormat.CamelCase}}`).render(icon),
            `sortNumericUpAlt`
        );
        assert.strictEqual(
            new InsertionTemplate('', `{name:${InsertionTemplateTokenFormat.KebabCase}}`).render(icon),
            `sort-numeric-up-alt`
        );
        assert.strictEqual(
            new InsertionTemplate('', `{name:${InsertionTemplateTokenFormat.PascalCase}}`).render(icon),
            `SortNumericUpAlt`
        );
        assert.strictEqual(
            new InsertionTemplate('', `{name:${InsertionTemplateTokenFormat.SnakeCase}}`).render(icon),
            `sort_numeric_up_alt`
        );
        assert.strictEqual(
            new InsertionTemplate('', `{name:foobar}`).render(icon),
            `sort-numeric-up-alt`
        );

        assert.strictEqual(
            new InsertionTemplate('', `import {fa{name:pascalCase}} from '@fortawesome/free-{styleName}-svg-icons';`).render(icon),
            `import {faSortNumericUpAlt} from '@fortawesome/free-solid-svg-icons';`
        );
    });
});