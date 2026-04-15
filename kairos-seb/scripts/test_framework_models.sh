#!/bin/bash
# Test models on Kairos Framework-specific scenarios

OPENROUTER_KEY="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"

echo "🧪 Framework-Specific Model Comparison"
echo "=============================================="

declare -a FRAMEWORK_SCENARIOS=(
  "E1|1|I need things to be right.|Enneagram Type 1"
  "E2|1|I naturally put others first.|Enneagram Type 2"
  "E3|2|My worth feels tied to achievement.|Enneagram Type 3"
  "E4|2|I've always felt different.|Enneagram Type 4"
  "E6|2|I scan for threats.|Enneagram Type 6"
  "E8|1|I'm strong and protective.|Enneagram Type 8"
  "IFS1|2|A part of me aggressively fixes problems.|IFS Protector"
  "IFS2|3|When I'm with my angry part I feel calm.|IFS Self"
  "SOM1|3|I notice my breath catches.|Somatics"
  "BUD1|3|I notice my anger arises automatically.|Buddhist"
  "LD1|1|I led through authority.|Leadership Stage 1"
  "LD3|3|My role shifted to developing others.|Leadership Stage 3"
  "LD4|4|I hold the vision and help others find their voice.|Leadership Stage 4"
  "HD1|3|I'm built to create.|Human Design"
)

QWEN_CORRECT=0; QWEN_TOTAL=0
GPT_CORRECT=0; GPT_TOTAL=0
CLAUDE_CORRECT=0; CLAUDE_TOTAL=0

echo ""
echo "📋 Qwen 3.6 Plus..."
for scenario in "${FRAMEWORK_SCENARIOS[@]}"; do
  IFS='|' read -r ID EXPECTED TEXT FRAMEWORK <<< "$scenario"
  
  RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
    -H "Authorization: Bearer $OPENROUTER_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"model\": \"qwen/qwen3.6-plus\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with only a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 5}")
  
  PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
  
  [ "$PREDICTED" = "$EXPECTED" ] && QWEN_CORRECT=$((QWEN_CORRECT + 1))
  QWEN_TOTAL=$((QWEN_TOTAL + 1))
  [ "$PREDICTED" = "$EXPECTED" ] && echo "✅ $ID" || echo "❌ $ID (got $PREDICTED)"
done

QWEN_ACC=$(echo "scale=1; $QWEN_CORRECT * 100 / $QWEN_TOTAL" | bc)
echo "Qwen: $QWEN_CORRECT/$QWEN_TOTAL = $QWEN_ACC%"

echo ""
echo "📋 GPT-4o..."
for scenario in "${FRAMEWORK_SCENARIOS[@]}"; do
  IFS='|' read -r ID EXPECTED TEXT FRAMEWORK <<< "$scenario"
  
  RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
    -H "Authorization: Bearer $OPENROUTER_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"model\": \"openai/gpt-4o\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with only a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 5}")
  
  PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
  
  [ "$PREDICTED" = "$EXPECTED" ] && GPT_CORRECT=$((GPT_CORRECT + 1))
  GPT_TOTAL=$((GPT_TOTAL + 1))
  [ "$PREDICTED" = "$EXPECTED" ] && echo "✅ $ID" || echo "❌ $ID (got $PREDICTED)"
done

GPT_ACC=$(echo "scale=1; $GPT_CORRECT * 100 / $GPT_TOTAL" | bc)
echo "GPT: $GPT_CORRECT/$GPT_TOTAL = $GPT_ACC%"

echo ""
echo "📋 Claude 3.7 Sonnet..."
for scenario in "${FRAMEWORK_SCENARIOS[@]}"; do
  IFS='|' read -r ID EXPECTED TEXT FRAMEWORK <<< "$scenario"
  
  RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
    -H "Authorization: Bearer $OPENROUTER_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"model\": \"anthropic/claude-3.7-sonnet\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with only a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 5}")
  
  PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
  
  [ "$PREDICTED" = "$EXPECTED" ] && CLAUDE_CORRECT=$((CLAUDE_CORRECT + 1))
  CLAUDE_TOTAL=$((CLAUDE_TOTAL + 1))
  [ "$PREDICTED" = "$EXPECTED" ] && echo "✅ $ID" || echo "❌ $ID (got $PREDICTED)"
done

CLAUDE_ACC=$(echo "scale=1; $CLAUDE_CORRECT * 100 / $CLAUDE_TOTAL" | bc)
echo "Claude: $CLAUDE_CORRECT/$CLAUDE_TOTAL = $CLAUDE_ACC%"

echo ""
echo "=============================================="
echo "📊 FRAMEWORK COMPARISON"
echo "=============================================="
echo "Qwen 3.6 Plus:    $QWEN_CORRECT/$QWEN_TOTAL = $QWEN_ACC%"
echo "GPT-4o:          $GPT_CORRECT/$GPT_TOTAL = $GPT_ACC%"
echo "Claude 3.7:       $CLAUDE_CORRECT/$CLAUDE_TOTAL = $CLAUDE_ACC%"
echo "=============================================="

# Save
cat > "/Users/jatinalla/Desktop/Kairos Technical/benchmarks/kairos-seb/results/framework_comparison.json" << EOF
{
  "test": "Kairos-SEB Framework",
  "scenarios": $QWEN_TOTAL,
  "models": [
    {"name": "qwen/qwen3.6-plus", "correct": $QWEN_CORRECT, "accuracy": $QWEN_ACC},
    {"name": "openai/gpt-4o", "correct": $GPT_CORRECT, "accuracy": $GPT_ACC},
    {"name": "anthropic/claude-3.7-sonnet", "correct": $CLAUDE_CORRECT, "accuracy": $CLAUDE_ACC}
  ],
  "timestamp": "$(date -u +%Y-%m-%dT%H:%MZ)"
}
EOF

echo "✅ Results saved!"