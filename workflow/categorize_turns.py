#!/usr/bin/env python3
"""Show categorized index of rich client turns for Phase Real selection."""
import json, os

input_path = os.path.join(os.environ['HOME'], 'Desktop', 'SES-benchmark', 'workflow', 'extracted_client_turns.json')
output_path = os.path.join(os.environ['HOME'], 'Desktop', 'SES-benchmark', 'workflow', 'phase_real_index.md')

with open(input_path) as f:
    all_turns = json.load(f)

rich = [t for t in all_turns if t['words'] > 80]
rich.sort(key=lambda x: x['words'], reverse=True)

# Categorize by keyword heuristics
categories = {
    'SOCIAL - belonging_exile': ['belong', 'exile', 'outsider', 'fit in', 'don\'t belong', 'mixed', 'identity crisis', 'code switch'],
    'SOCIAL - betrayal_rupture': ['betray', 'trust', 'lie', 'cheat', 'broken promise', 'backstab', 'deceit'],
    'SOCIAL - caretaking_burden': ['care', 'take care', 'responsible', 'burden', 'parent', 'look after', 'sandwich'],
    'SOCIAL - cultural_obligation': ['family expect', 'should do', 'duty', 'obligation', 'culture', 'tradition', 'parents want', 'samaj', 'community'],
    'SOCIAL - estrangement': ['estranged', 'cut off', 'no contact', 'haven\'t spoken', 'distance', 'drifted', 'don\'t talk'],
    'SOCIAL - power_hierarchy': ['boss', 'workplace', 'power', 'hierarchy', 'authority', 'discriminat', 'fair', 'unequal'],
    'SOCIAL - relational_grief': ['grief', 'loss', 'miss', 'lonely', 'alone', 'empty', 'mourning', 'funeral'],
    'EMOTIONAL - mixed_emotion': ['conflicted', 'ambivalent', 'both', 'paradox', 'relief and', 'happy but', 'guilty', 'shame'],
    'EMOTIONAL - ambivalence': ['don\'t know', 'torn', 'pull', 'want to but', 'should I', 'unsure', 'uncertain'],
    'EMOTIONAL - grief': ['hurt', 'pain', 'sorrow', 'cry', 'tears', 'hard to', 'struggle with'],
    'SPIRITUAL - secular': ['meaning', 'purpose', 'existential', 'why', 'point of', 'nothing matters', 'void', 'awe', 'transcend', 'mystery'],
    'SPIRITUAL - tradition': ['spiritual', 'meditation', 'prayer', 'chakra', 'energy', 'guides', 'higher self', 'soul', 'divine', 'awakening', 'practice', 'yoga', 'shaman', 'ceremony', 'journey', 'clearing'],
}

# Categorize each turn
categorized = {k: [] for k in categories}
uncategorized = []

for t in rich:
    text_lower = t['text'].lower()
    best_cat = None
    best_score = 0
    for cat, keywords in categories.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > best_score:
            best_score = score
            best_cat = cat
    if best_cat:
        categorized[best_cat].append((best_score, t))
    else:
        uncategorized.append(t)

# Write markdown index
lines = ['# Phase Real — Client Turn Index\n']
lines.append(f'**Source:** 38 Kairos coaching transcripts')
lines.append(f'**Total rich turns (>80 words):** {len(rich)}')
lines.append(f'**Categorized:** {len(rich) - len(uncategorized)}')
lines.append(f'**Uncategorized:** {len(uncategorized)}')
lines.append('')
lines.append('## Top Candidates by Category\n')

for cat in sorted(categorized.keys()):
    items = categorized[cat]
    if not items:
        continue
    lines.append(f'### {cat} ({len(items)} turns)\n')
    # Sort by score desc, then word count desc
    items.sort(key=lambda x: (-x[0], -x[1]['words']))
    for score, t in items[:10]:  # Top 10 per category
        lines.append(f'- **{t["client"]}** ({t["words"]}w, score:{score}) — `{t["source"]}`')
        lines.append(f'  > {t["text"][:180]}...')
        lines.append('')

# Show uncategorized top 20
if uncategorized:
    lines.append('### Uncategorized (potential cross-cutting)\n')
    uncategorized.sort(key=lambda x: x['words'], reverse=True)
    for t in uncategorized[:20]:
        lines.append(f'- **{t["client"]}** ({t["words"]}w) — `{t["source"]}`')
        lines.append(f'  > {t["text"][:180]}...')
        lines.append('')

with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Index written to: {output_path}")
print(f"\nCategory distribution:")
for cat in sorted(categorized.keys()):
    if categorized[cat]:
        print(f"  {cat}: {len(categorized[cat])}")
print(f"  Uncategorized: {len(uncategorized)}")
