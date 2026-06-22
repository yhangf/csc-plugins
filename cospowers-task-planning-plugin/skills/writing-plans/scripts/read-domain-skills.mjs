#!/usr/bin/env node

/**
 * read-domain-skills.mjs
 *
 * Read cospowers.config.json from the plugin root and print entries under
 * "domain-skills" in a human-readable format.
 *
 * Usage:
 *   node read-domain-skills.mjs
 *   node read-domain-skills.mjs <plugin-root-or-config>
 *
 * Environment:
 *   CLAUDE_PLUGIN_ROOT - plugin root used when no argument is provided
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { join, resolve } from 'path';

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
    // If stat fails, treat the resolved path as a file path.
  }

  return resolved;
}

function main() {
  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || '.';

  const configPath =
    resolveConfigPath(process.argv[2])
    || resolveConfigPath(join(process.argv[2] || pluginRoot, 'cospowers.config.json'))
    || join(pluginRoot, 'cospowers.config.json');

  const resolvedPath = resolve(configPath);

  if (!existsSync(resolvedPath)) {
    console.error(`[read-domain-skills] config file not found: ${resolvedPath}`);
    process.exit(1);
  }

  try {
    const raw = readFileSync(resolvedPath, 'utf-8');
    const config = JSON.parse(raw);
    const domainSkills = config['domain-skills'];

    if (!domainSkills || typeof domainSkills !== 'object' || Object.keys(domainSkills).length === 0) {
      console.log('[read-domain-skills] Extension skill does not exist');
      return;
    }

    const keys = Object.keys(domainSkills).filter(key => !key.startsWith('_'));
    if (keys.length === 0) {
      console.log('[read-domain-skills] Extension skill does not exist');
      return;
    }

    console.log(`[read-domain-skills] Found ${keys.length} domain skill(s):\n`);

    for (const key of keys) {
      const entry = domainSkills[key];
      const name = entry.name || '(no name)';
      const skill = entry.skill || '(no skill)';
      const description = entry.description || '(no description)';

      console.log(`  [${key}]`);
      console.log(`    name        : ${name}`);
      console.log(`    skill       : ${skill}`);
      console.log(`    description : ${description}`);
      console.log('');
    }
  } catch (err) {
    console.error(`[read-domain-skills] failed to read or parse config: ${err.message}`);
    process.exit(1);
  }
}

main();
