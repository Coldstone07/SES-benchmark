#!/bin/bash
# Compare Qwen, Claude, and GPT on Kairos-SEB benchmark

OPENROUTER_KEY="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"
ANTHROPIC_KEY="sk-ant-api03-KkE3bH0lZK2QaZQF2N7X4Y5Z-FqDtUqJqZ3K5W1X9Y2Z-FqDtUqJqZ3K5W1X9Y2Z-FqDtUqJqZ3K5W1X9Y2Z"  # Placeholder

echo "🧪 Kairos-SEB Model Comparison Test"
echo "=============================================="

# Test scenarios with expected stages
declare -a SCENARIOS=(
  "1.1|1|I know God loves me because the Bible tells me so.|1"
  "1.2|1|I go to church every Sunday and tithe 10%.|1"
  "1.3|1|My faith community is everything to me.|1"
  "2.1|2|I used to believe but my mom died young. I don't know what I believe anymore.|2"
  "2.2|2|Science contradicts what I was taught. I want to believe but can't.|2"
  "2.3|2|The church voted against LGBTQ members. I can't stay. I don't know where I belong.|2"
  "3.1|3|I've taken what resonates and left what doesn't fit. My spirituality feels mine.|3"
  "3.2|3|I've studied many traditions and take what feels true. I don't fit in any box.|3"
  "3.3|3|I hold two truths at once. I've made peace with the mystery.|3"
  "4.1|4|I feel God's presence in nature. The sacred is ordinary life seen rightly.|4"
  "4.2|4|I don't distinguish between believers and others. Every person is sacred.|4"
  "4.3|4|My inner life has settled into quiet. The peace I sought is now my default.|4"
)

# Initialize counters
QWEN_CORRECT=0; QWEN_TOTAL=0
CLAUDE_CORRECT=0; CLAUDE_TOTAL=0
GPT_CORRECT=0; GPT_TOTAL=0

echo ""
echo "📋 Testing Qwen 3.6 Plus..."
echo "--------------------------------------"

for scenario in "${SCENARIOS[@]}"; do
  IFS='|' read -r ID EXPECTED TEXT <<< "$scenario"
  
  RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
    -H "Authorization: Bearer $OPENROUTER_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"model\": \"qwen/qwen3.6-plus\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with only a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 5}")
  
  PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
  
  [ "$PREDICTED" = "$EXPECTED" ] && QWEN_CORRECT=$((QWEN_CORRECT + 1))
  QWEN_TOTAL=$((QWEN_TOTAL + 1))
  [ "$PREDICTED" = "$EXPECTED" ] && echo "✅" || echo "❌"
done

QWEN_ACC=$(echo "scale=1; $QWEN_CORRECT * 100 / $QWEN_TOTAL" | bc)
echo "Qwen Score: $QWEN_CORRECT/$QWEN_TOTAL = $QWEN_ACC%"

echo ""
echo "📋 Testing GPT-4o..."
echo "--------------------------------------"

for scenario in "${SCENARIOS[@]}"; do
  IFS='|' read -r ID EXPECTED TEXT <<< "$scenario"
  
  RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
    -H "Authorization: Bearer $OPENROUTER_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"model\": \"openai/gpt-4o\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with only a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 5}")
  
  PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
  
  [ "$PREDICTED" = "$EXPECTED" ] && GPT_CORRECT=$((GPT_CORRECT + 1))
  GPT_TOTAL=$((GPT_TOTAL + 1))
  [ "$PREDICTED" = "$EXPECTED" ] && echo "✅" || echo "❌"
done

GPT_ACC=$(echo "scale=1; $GPT_CORRECT * 100 / $GPT_TOTAL" | bc)
echo "GPT Score: $GPT_CORRECT/$GPT_TOTAL = $GPT_ACC%"

echo ""
echo "📋 Testing Claude 3.7 Sonnet..."
echo "--------------------------------------"

for scenario in "${SCENARIOS[@]}"; do
  IFS='|' read -r ID EXPECTED TEXT <<< "$scenario"
  
  RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
    -H "Authorization: Bearer $OPENROUTER_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"model\": \"anthropic/claude-3.7-sonnet\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with only a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 5}")
  
  PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
  
  [ "$PREDICTED" = "$EXPECTED" ] && CLAUDE_CORRECT=$((CLAUDE_CORRECT + 1))
  CLAUDE_TOTAL=$((CLAUDE_TOTAL + 1))
  [ "$PREDICTED" = "$EXPECTED" ] && echo "✅" || echo "❌"
done

CLAUDE_ACC=$(echo "scale=1; $CLAUDE_CORRECT * 100 / $CLAUDE_TOTAL" | bc)
echo "Claude Score: $CLAUDE_CORRECT/$CLAUDE_TOTAL = $CLAUDE_ACC%"

echo ""
echo "=============================================="
echo "📊 FINAL COMPARISON"
echo "=============================================="
echo "Qwen 3.6 Plus:    $QWEN_CORRECT/$QWEN_TOTAL = $QWEN_ACC%"
echo "GPT-4o:          $GPT_CORRECT/$GPT_TOTAL = $GPT_ACC%"
echo "Claude 3.7:       $CLAUDE_CORRECT/$CLAUDE_TOTAL = $CLAUDE_ACC%"
echo "=============================================="

# Save results
cat > "/Users/jatinalla/Desktop/Kairos Technical/benchmarks/kairos-seb/results/model_comparison.json" << EOF
{
  "test": "Kairos-SEB Core Benchmark",
  "scenarios": $QWEN_TOTAL,
  "models": [
    {"name": "qwen/qwen3.6-plus", "correct": $QWEN_CORRECT, "accuracy": $QWEN_ACC},
    {"name": "openai/gpt-4o", "correct": $GPT_CORRECT, "accuracy": $GPT_ACC},
    {"name": "anthropic/claude-3.7-sonnet", "correct": $CLAUDE_CORRECT, "accuracy": $CLAUDE_ACC}
  ],
  "timestamp": "$(date -u +%Y-%m-%dT%H:%MZ)"
}
EOF

echo ""
echo "✅ Results saved to results/model_comparison.json"