#!/bin/bash
# Corrected model comparison test with proper settings

OPENROUTER_KEY="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"

echo "🧪 Kairos-SEB - CORRECTED Model Comparison"
echo "=============================================="

declare -a SCENARIOS=(
  "1.1|1|I know God loves me because the Bible tells me so.|1"
  "1.2|1|I go to church every Sunday.|1"
  "1.3|1|My faith community is everything to me.|1"
  "2.1|2|I used to believe but I don't know what I believe anymore.|2"
  "2.2|2|Science contradicts what I was taught. I have doubts.|2"
  "2.3|2|I cannot stay in my church anymore.|2"
  "3.1|3|I've taken what resonates and left what does not fit.|3"
  "3.2|3|I've studied many traditions and take what feels true.|3"
  "3.3|3|I hold two truths at once. I have made peace with mystery.|3"
  "4.1|4|I feel God is present in nature.|4"
  "4.2|4|I do not distinguish between believers and others.|4"
  "4.3|4|My inner life has settled into quiet peace.|4"
)

test_model() {
    local MODEL=$1
    local NAME=$2
    local MIN_TOKENS=$3
    local CORRECT=0
    local TOTAL=0
    local RESULTS=""
    
    echo "📋 Testing $NAME..."
    
    for scenario in "${SCENARIOS[@]}"; do
        IFS='|' read -r ID EXPECTED TEXT <<< "$scenario"
        
        RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
            -H "Authorization: Bearer $OPENROUTER_KEY" \
            -H "Content-Type: application/json" \
            -d "{\"model\": \"$MODEL\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with only a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": $MIN_TOKENS}")
        
        PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]' | grep -o '[1-4]' | head -1)
        
        if [ "$PREDICTED" = "$EXPECTED" ]; then
            CORRECT=$((CORRECT + 1))
            echo "✅ $ID"
        else
            RAW=$(echo "$RESPONSE" | head -c 100)
            echo "❌ $ID got '$PREDICTED' expected $EXPECTED"
        fi
        TOTAL=$((TOTAL + 1))
    done
    
    ACC=$(echo "scale=1; $CORRECT * 100 / $TOTAL" | bc)
    echo "➡️ $NAME: $CORRECT/$TOTAL = $ACC%"
    echo ""
}

# Run tests
test_model "qwen/qwen3.6-plus" "Qwen 3.6 Plus" 10
test_model "openai/gpt-5.4" "GPT-5.4" 16
test_model "anthropic/claude-opus-4.6" "Claude Opus 4.6" 16
test_model "anthropic/claude-sonnet-4.6" "Claude Sonnet 4.6" 16

echo "=============================================="
echo "📊 FINAL RESULTS"
echo "=============================================="