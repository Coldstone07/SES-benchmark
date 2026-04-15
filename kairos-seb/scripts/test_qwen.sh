#!/bin/bash
# Kairos-SEB Evaluation using Qwen via OpenRouter

API_KEY="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"
MODEL="qwen/qwen3.6-plus"

CORRECT=0
TOTAL=0
RESULTS=()

echo "🧪 Kairos-SEB Evaluation with Qwen 3.6 Plus"
echo "=================================================="

test_scenario() {
    local id=$1 expected=$2 text=$3
    
    RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"model\": \"$MODEL\", \"messages\": [{\"role\": \"system\", \"content\": \"You are a spiritual development expert. Classify: Stage 1=Awakening, 2=Questioning, 3=Integration, 4=Unity. Respond with ONLY the number.\"}, {\"role\": \"user\", \"content\": \"$text\"}], \"max_tokens\": 5}")
    
    PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
    
    [ "$PREDICTED" = "$expected" ] && result="✅" || result="❌"
    [ "$PREDICTED" = "$expected" ] && CORRECT=$((CORRECT + 1))
    TOTAL=$((TOTAL + 1))
    
    echo "$result $id: Predicted=$PREDICTED Expected=$expected"
    RESULTS+=("{\"id\":\"$id\",\"expected\":$expected,\"predicted\":\"$PREDICTED\"}")
}

# Stage 1 - Awakening
test_scenario "1.1" 1 "I know God loves me because the Bible tells me so. I've never doubted that."
test_scenario "1.2" 1 "I go to church every Sunday and tithe 10%. I follow the rules."
test_scenario "1.3" 1 "My faith community is everything to me. I'd be lost without it."

# Stage 2 - Questioning  
test_scenario "2.1" 2 "I used to believe but my mom died young. I don't know what I believe anymore."
test_scenario "2.2" 2 "Science contradicts what I was taught. I want to believe but can't."
test_scenario "2.3" 2 "The church voted against LGBTQ members. I can't stay. I don't know where I belong."

# Stage 3 - Integration
test_scenario "3.1" 3 "I've taken what resonates and left what doesn't fit. My spirituality feels mine."
test_scenario "3.2" 3 "I've studied many traditions and take what feels true. I don't fit in any box."
test_scenario "3.3" 3 "I hold two truths at once. I've made peace with the mystery."

# Stage 4 - Unity
test_scenario "4.1" 4 "I feel God's presence in nature. The sacred is ordinary life seen rightly."
test_scenario "4.2" 4 "I don't distinguish between believers and others. Every person is sacred."
test_scenario "4.3" 4 "My inner life has settled into quiet. The peace I sought is now my default."

# Calculate accuracy
ACCURACY=$(echo "scale=1; $CORRECT * 100 / $TOTAL" | bc)

echo ""
echo "=================================================="
echo "📊 Qwen Results: $CORRECT/$TOTAL = $ACCURACY% accuracy"
echo "=================================================="

# Save
cat > "/Users/jatinalla/Desktop/Kairos Technical/benchmarks/kairos-seb/results/qwen_results.json" << EOF
{
  "model": "$MODEL",
  "accuracy": $ACCURACY,
  "correct": $CORRECT,
  "total": $TOTAL,
  "timestamp": "$(date -u +%Y-%m-%dT%H:%MZ)",
  "results": [$(IFS=,; echo "${RESULTS[*]}")]
}
EOF

echo "✅ Results saved!"