import * as vscode from 'vscode';
import { FontAwesomeVersion } from '.';
import { AutoClearTriggerWordRule, InsertionTemplate } from './transformation';
export const configurationSection = 'fontAwesomeAutocomplete';

export interface ExtensionConfiguration {
    readonly version: FontAwesomeVersion;
    readonly triggerWord: string;
    /** A list of regex patterns for which the extension should NOT auto-remove the trigger word when a font class name is inserted from the autocompletion list. */
    readonly disableTriggerWordAutoClearRules: AutoClearTriggerWordRule[];
    readonly patterns: vscode.DocumentFilter[];
    readonly previewStyle: {
        readonly backgroundColor: string;
        readonly foregroundColor: string;
    };
    readonly insertionTemplates: InsertionTemplate[];
    readonly triggerCharacter: string;
    readonly enableElevatedSortPriority: boolean;
}

export enum ConfigKey {
    Version = 'version',
    TriggerWord = 'triggerWord',
    PreviewBackgroundColor = 'preview.backgroundColor',
    PreviewForegroundColor = 'preview.foregroundColor',
    DisableTriggerWordAutoClearPatterns = 'disableTriggerWordAutoClearPatterns',
    InsertionTemplate = 'insertionTemplate',
    EnableElevatedSortPriority = 'enableElevatedSortPriority',
}

/** Loads and validates the extension configuration. */
export function loadConfiguration(): ExtensionConfiguration {
    const config = vscode.workspace.getConfiguration(configurationSection);
    const version = config.get(ConfigKey.Version) as FontAwesomeVersion;
    const triggerWord = config.get(ConfigKey.TriggerWord) as string;

    // Convert loaded glob patterns into regular expressions
    const disableTriggerWordAutoClearRules = (config.get(ConfigKey.DisableTriggerWordAutoClearPatterns) as string[]).map(
        pattern => new AutoClearTriggerWordRule(pattern)
    );
    const insertionTemplatesConfig = config.get(ConfigKey.InsertionTemplate) as {[key: string]: string};

    const insertionTemplates: InsertionTemplate[] = [];
    for (const pattern in insertionTemplatesConfig) {
        insertionTemplates.push(new InsertionTemplate(pattern, insertionTemplatesConfig[pattern]));
    }

    // Convert loaded glob patterns into DocumentFilters
    const patterns = (config.get('patterns') as string[]).map(pattern => <vscode.DocumentFilter> {
        pattern,
        scheme: 'file',
    });

    const previewStyle = {
        backgroundColor: config.get(ConfigKey.PreviewBackgroundColor) as string,
        foregroundColor: config.get(ConfigKey.PreviewForegroundColor) as string,
    };

    const triggerCharacter = triggerWord[triggerWord.length - 1];

    return {
        version, 
        triggerWord, 
        disableTriggerWordAutoClearRules, 
        patterns, 
        previewStyle, 
        insertionTemplates, 
        triggerCharacter,
        enableElevatedSortPriority: config.get(ConfigKey.EnableElevatedSortPriority) as boolean,
    }
}
