#!/usr/bin/env python3
"""Extract client turns from Kairos coaching transcripts."""
import os, re, json, sys

transcript_dir = os.path.join(os.environ['HOME'], '.openclaw', 'workspace', 'cohort-data', 'transcripts')
output_path = os.path.join(os.environ['HOME'], 'Desktop', 'SES-benchmark', 'workflow', 'extracted_client_turns.json')

# Which files to process (from command line args or all)
files_to_process = sys.argv[1:] if len(sys.argv) > 1 else []

all_turns = []

for fname in sorted(os.listdir(transcript_dir)):
    if not fname.endswith('.txt'):
        continue
    # Skip the comprehensive analysis file
    if fname == 'ALL_ComprehensiveJourneyAnalysis.txt':
        continue
    # Filter by requested files
    if files_to_process and fname not in files_to_process:
        continue
    
    fpath = os.path.join(transcript_dir, fname)
    with open(fpath, encoding='utf-8') as f:
        content = f.read()
    
    # Parse transcript section (after "Transcript" header)
    transcript_match = re.search(r'Transcript\s*\n.*?00:00:00', content)
    if not transcript_match:
        continue
    
    transcript_text = content[transcript_match.end():]
    lines = transcript_text.split('\n')
    
    # Extract client turns
    current_client = None
    current_turn = []
    
    for line in lines:
        line_stripped = line.strip()
        # Skip timestamps
        if re.match(r'^\d{2}:\d{2}:\d{2}$', line_stripped):
            continue
        
        # Match speech: "Name: text"
        match = re.match(r'^([A-Za-z][A-Za-z\s]+?):\s+(.+)$', line_stripped)
        if match:
            name = match.group(1).strip()
            text = match.group(2).strip()
            
            # Save previous client turn if exists
            if current_client and current_turn:
                full_text = ' '.join(current_turn)
                if len(full_text.split()) > 40:  # Skip very short turns
                    all_turns.append({
                        'source': fname,
                        'client': current_client,
                        'text': full_text,
                        'words': len(full_text.split())
                    })
            
            # Start new turn if not Kairos
            if 'Kairos' not in name:
                current_client = name
                current_turn = [text]
            else:
                current_client = None
                current_turn = []
        elif current_turn and line_stripped:
            # Continuation of current speaker
            current_turn.append(line_stripped)
    
    # Save last turn in file
    if current_client and current_turn:
        full_text = ' '.join(current_turn)
        if len(full_text.split()) > 40:
            all_turns.append({
                'source': fname,
                'client': current_client,
                'text': full_text,
                'words': len(full_text.split())
            })

# Save results
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(all_turns, f, indent=2, ensure_ascii=False)

# Print summary
rich = [t for t in all_turns if t['words'] > 80]
print(f"Processed {len(files_to_process) or 'all'} files")
print(f"Total client turns: {len(all_turns)}")
print(f"Rich turns (>80 words): {len(rich)}")
print(f"Saved to: {output_path}")

# Show top 5
for t in sorted(rich, key=lambda x: x['words'], reverse=True)[:5]:
    print(f"\n--- {t['source']} - {t['client']} ({t['words']}w) ---")
    print(t['text'][:200] + '...')
