import * as vscode from 'vscode';
import { FontAwesomeVersion } from '.';
import { InsertionTemplate } from './transformation';

export const configurationSection = 'fontAwesomeAutocomplete';

export enum ConfigKey {
    Version = 'version',
    TriggerWord = 'triggerWord',
    PreviewBackgroundColor = 'preview.backgroundColor',
    PreviewForegroundColor = 'preview.foregroundColor',
    DisableTriggerWordAutoClearPatterns = 'disableTriggerWordAutoClearPatterns',
    InsertionTemplate = 'insertionTemplate',
}

/** Loads and validates the extension configuration. */
export function loadConfiguration() {
    const config = vscode.workspace.getConfiguration(configurationSection);
    const version = config.get(ConfigKey.Version) as FontAwesomeVersion;
    let triggerWord = config.get(ConfigKey.TriggerWord) as string;

    const triggerWordSetting = config.inspect(ConfigKey.TriggerWord);
    const disableTriggerWordAutoClearPatterns = config.get(ConfigKey.DisableTriggerWordAutoClearPatterns) as string[];
    const insertionTemplatesConfig = config.get(ConfigKey.InsertionTemplate) as {[key: string]: string};

    const insertionTemplates: InsertionTemplate[] = [];
    for (const pattern in insertionTemplatesConfig) {
        insertionTemplates.push(new InsertionTemplate(pattern, insertionTemplatesConfig[pattern]));
    }

    let defaultTriggerWord = 'fa-';

    if (triggerWordSetting != null && triggerWordSetting.defaultValue != null) {
        defaultTriggerWord = triggerWordSetting.defaultValue as string;
    } else {
        defaultTriggerWord = 'fa-';
    }
        // Turn loaded glob patterns into DocumentFilters
        const patterns = (config.get('patterns') as string[])
        .map(pattern => <vscode.DocumentFilter> {
            pattern,
            scheme: 'file',
        });

    const previewStyle = {
        backgroundColor: config.get(ConfigKey.PreviewBackgroundColor) as string,
        foregroundColor: config.get(ConfigKey.PreviewForegroundColor) as string,
    };

    if (config.triggerWord.length == 0) {
        vscode.window.showErrorMessage(
            `Setting ${configurationSection}.${ConfigKey.TriggerWord} cannot be empty - falling back to "${defaultTriggerWord}"!`,
            'Restore'
        ).then(value => {
            if (value == 'Restore') {
                config.update(ConfigKey.TriggerWord, defaultTriggerWord);
            }
        });

        triggerWord = defaultTriggerWord;
    }

    const triggerCharacter = triggerWord[triggerWord.length - 1];

    return {
        version, triggerWord, disableTriggerWordAutoClearPatterns, patterns, previewStyle, insertionTemplates, triggerCharacter
    }
}
