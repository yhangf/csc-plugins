#!/usr/bin/env node

/**
 * read-skill-supplement.mjs
 *
 * Reads supplemental prompts for a skill from cospowers.config.json and prints
 * them for SKILL.md extension-point injection.
 *
 * Config format (cospowers.config.json -> skillSupplements):
 *   - null / missing -> no supplemental content
 *   - string -> print directly as markdown
 *   - { "file": "path/to/supplement.md" } -> read file relative to plugin root
 *
 * Usage:
 *   node read-skill-supplement.mjs <skill-name>
 *   node read-skill-supplement.mjs <skill-name> <plugin-root-or-config-path>
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';

function resolveConfigPath(inputPath) {
  if (!inputPath) return null;

  const resolved = resolve(inputPath);

  if (!existsSync(resolved)) {
    return null;
  }

  try {
    const stat = statSync(resolved);
    if (stat.isDirectory()) {
      return join(resolved, 'cospowers.config.json');
    }
  } catch {
    // Treat stat failures as file-path handling below.
  }

  return resolved;
}

function loadConfig(configPath) {
  const resolvedPath = resolve(configPath);

  if (!existsSync(resolvedPath)) {
    console.error(`[read-skill-supplement] Config file not found: ${resolvedPath}`);
    process.exit(1);
  }

  try {
    const raw = readFileSync(resolvedPath, 'utf-8');
    return { config: JSON.parse(raw), configDir: dirname(resolvedPath) };
  } catch (error) {
    console.error(`[read-skill-supplement] Failed to read or parse config: ${error.message}`);
    process.exit(1);
  }
}

function resolveSupplement(value, configDir) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && value.file && typeof value.file === 'string') {
    const filePath = resolve(configDir, value.file);
    if (!existsSync(filePath)) {
      console.error(`[read-skill-supplement] Supplemental file not found: ${filePath}`);
      process.exit(1);
    }

    try {
      return readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`[read-skill-supplement] Failed to read supplemental file: ${error.message}`);
      process.exit(1);
    }
  }

  console.error(`[read-skill-supplement] Unsupported supplement format, skipped (type: ${typeof value})`);
  return null;
}

function main() {
  const skillName = process.argv[2];
  if (!skillName) {
    console.error('[read-skill-supplement] Usage: node read-skill-supplement.mjs <skill-name> [plugin-root]');
    process.exit(1);
  }

  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || '.';
  const configPath =
    resolveConfigPath(process.argv[3])
    || resolveConfigPath(join(process.argv[3] || pluginRoot, 'cospowers.config.json'))
    || join(pluginRoot, 'cospowers.config.json');

  const { config, configDir } = loadConfig(configPath);
  const supplements = config.skillSupplements;

  if (!supplements || typeof supplements !== 'object') {
    console.log(' ');
    process.exit(0);
  }

  const content = resolveSupplement(supplements[skillName], configDir);
  if (content === null) {
    console.log(' ');
    process.exit(0);
  }

  console.log(`## Additional Requirements\n\n${content}`);
}

main();
