#!/bin/bash
# Correct model comparison test

OPENROUTER_KEY="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"

echo "🧪 Kairos-SEB Model Comparison - CORRECT MODELS"
echo "=============================================="

declare -a SCENARIOS=(
  "1.1|1|I know God loves me because the Bible tells me so.|1"
  "1.2|1|I go to church every Sunday.|1"
  "1.3|1|My faith community is everything to me.|1"
  "2.1|2|I used to believe but I don't know what I believe anymore.|2"
  "2.2|2|Science contradicts what I was taught.|2"
  "2.3|2|I can't stay in my church anymore.|2"
  "3.1|3|I've taken what resonates and left what doesn't fit.|3"
  "3.2|3|I've studied many traditions and take what feels true.|3"
  "3.3|3|I hold two truths at once. I've made peace with mystery.|3"
  "4.1|4|I feel God's presence in nature.|4"
  "4.2|4|I don't distinguish between believers and others.|4"
  "4.3|4|My inner life has settled into quiet peace.|4"
)

# Test each model
test_model() {
    local MODEL=$1
    local NAME=$2
    local CORRECT=0
    local TOTAL=0
    
    echo ""
    echo "📋 Testing $NAME..."
    
    for scenario in "${SCENARIOS[@]}"; do
        IFS='|' read -r ID EXPECTED TEXT <<< "$scenario"
        
        RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
            -H "Authorization: Bearer $OPENROUTER_KEY" \
            -H "Content-Type: application/json" \
            -d "{\"model\": \"$MODEL\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with only a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 10}")
        
        PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
        
        if [ "$PREDICTED" = "$EXPECTED" ]; then
            CORRECT=$((CORRECT + 1))
            echo "✅"
        else
            echo "❌ (got $PREDICTED expected $EXPECTED)"
        fi
        TOTAL=$((TOTAL + 1))
    done
    
    ACC=$(echo "scale=1; $CORRECT * 100 / $TOTAL" | bc)
    echo "$NAME: $CORRECT/$TOTAL = $ACC%"
    
    echo "$CORRECT,$TOTAL,$ACC"
}

# Run tests
echo "Qwen results:"
test_model "qwen/qwen3.6-plus" "Qwen"

echo ""
echo "GPT-5.4 results:"
test_model "openai/gpt-5.4" "GPT-5.4"

echo ""
echo "Claude Opus results:"
test_model "anthropic/claude-opus-4.6" "Claude Opus"

echo ""
echo "Claude Sonnet results:"
test_model "anthropic/claude-sonnet-4.6" "Claude Sonnet"