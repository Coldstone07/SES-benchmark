#!/usr/bin/env python3
"""Filter out coach speech (Jatin Alla / Kairos) and show clean client turns."""
import json, os

input_path = os.path.join(os.environ['HOME'], 'Desktop', 'SES-benchmark', 'workflow', 'extracted_client_turns.json')
output_path = os.path.join(os.environ['HOME'], 'Desktop', 'SES-benchmark', 'workflow', 'clean_client_turns.json')
index_path = os.path.join(os.environ['HOME'], 'Desktop', 'SES-benchmark', 'workflow', 'phase_real_candidates.md')

with open(input_path) as f:
    all_turns = json.load(f)

# Filter out coach speech
coach_names = ['Jatin Alla', 'Jatin', 'Kairos']
client_turns = [t for t in all_turns if t['client'] not in coach_names]

# Filter for rich turns
rich = [t for t in client_turns if t['words'] > 80]
rich.sort(key=lambda x: x['words'], reverse=True)

# Save clean turns
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(rich, f, indent=2, ensure_ascii=False)

# Count by client
by_client = {}
for t in rich:
    c = t['client']
    by_client[c] = by_client.get(c, 0) + 1

# Write candidate index
lines = ['# Phase Real — Clean Client Turn Candidates\n']
lines.append(f'**Total clean client turns:** {len(client_turns)}')
lines.append(f'**Rich turns (>80 words):** {len(rich)}')
lines.append(f'**Unique clients:** {len(by_client)}')
lines.append('')
lines.append('## By Client\n')
for c, n in sorted(by_client.items(), key=lambda x: -x[1]):
    lines.append(f'- **{c}**: {n} rich turns')
lines.append('')
lines.append('## Top 30 Candidates (by word count)\n')
lines.append('| # | Client | Words | Source | Preview |')
lines.append('|---|--------|-------|--------|---------|')
for i, t in enumerate(rich[:30]):
    preview = t['text'][:100].replace('|', '').replace('\n', ' ')
    lines.append(f'| {i+1} | {t["client"]} | {t["words"]} | `{t["source"]}` | {preview}... |')
lines.append('')
lines.append('## Full Top 30 (extended preview)\n')
for i, t in enumerate(rich[:30]):
    lines.append(f'### {i+1}. {t["client"]} ({t["words"]}w) — `{t["source"]}`\n')
    lines.append(f'> {t["text"][:250]}...\n')

with open(index_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Clean turns: {len(client_turns)}")
print(f"Rich turns: {len(rich)}")
print(f"Unique clients: {len(by_client)}")
print(f"\nBy client:")
for c, n in sorted(by_client.items(), key=lambda x: -x[1]):
    print(f"  {c}: {n}")
print(f"\nSaved to: {output_path}")
print(f"Index: {index_path}")
