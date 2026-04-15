#!/bin/bash
# Test Qwen on Kairos Framework scenarios

API_KEY="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"
MODEL="qwen/qwen3.6-plus"

echo "🧪 Testing Qwen on Kairos Framework Scenarios"
echo "=============================================="

test_framework() {
    local id=$1 expected=$2 text=$3 framework=$4
    
    RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"model\": \"$MODEL\", \"messages\": [{\"role\": \"system\", \"content\": \"You are a spiritual development expert. Classify the user. Respond with ONLY the number.\"}, {\"role\": \"user\", \"content\": \"$text\"}], \"max_tokens\": 5}")
    
    PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
    
    [ "$PREDICTED" = "$expected" ] && result="✅" || result="❌"
    
    echo "$result $id ($framework): Predicted=$PREDICTED Expected=$expected"
    [ "$PREDICTED" = "$expected" ] && CORRECT=$((CORRECT + 1))
    TOTAL=$((TOTAL + 1))
}

CORRECT=0
TOTAL=0

# Enneagram Tests
test_framework "E1" 1 "I need things to be right. If it's not correct, I cannot rest." "Enneagram Type 1"
test_framework "E3" 2 "I have achieved so much but wonder if anyone's ever seen the real me." "Enneagram Type 3"
test_framework "E4" 2 "I have always felt different. Like I am missing something others have." "Enneagram Type 4"
test_framework "E9" 1 "I tune out conflict to stay peaceful. My needs get lost in keeping the peace." "Enneagram Type 9"

# Gene Keys Tests  
test_framework "GK1" 3 "I have always known I was meant for something special. But now I see my gift is about being present." "Gene Key 1"
test_framework "GK25" 4 "I used to think I had to save everyone. Now I see we are all interconnected." "Gene Key 25"

# IFS Tests
test_framework "IFS1" 2 "A part of me aggressively fixes problems before they happen. It is actually terrified of failure." "IFS Protector"
test_framework "IFS2" 3 "When I am with my angry part and can just notice it without being it - I feel calm and curious." "IFS Self"

# Somatics Tests
test_framework "SOM1" 3 "I notice my breath catches when I talk about my father. My body knows things before my mind catches up." "Somatics"

# Buddhist Tests
test_framework "BUD1" 3 "I notice my anger arises automatically. When I observe it without reacting, it passes through like a wave." "Buddhist"

# Leadership Tests
test_framework "LD1" 1 "I led through authority - my way or the highway. Results were what mattered." "Leadership Stage 1"
test_framework "LD3" 3 "My role shifted to developing others. The more I empower them, the less I need to." "Leadership Stage 3"
test_framework "LD4" 4 "I do not need to be the smartest anymore. I hold the vision and help others find their voice." "Leadership Stage 4"

# Human Design Tests
test_framework "HD1" 3 "I am built to create. When I am engaged in meaningful work, I feel alive." "Human Design Generator"
test_framework "HD3" 3 "I take time to absorb before decisions. My clarity comes through waiting and watching." "Human Design Reflector"

ACCURACY=$(echo "scale=1; $CORRECT * 100 / $TOTAL" | bc)

echo ""
echo "=============================================="
echo "📊 Framework Results: $CORRECT/$TOTAL = $ACCURACY% accuracy"
echo "=============================================="

# Save
cat > "/Users/jatinalla/Desktop/Kairos Technical/benchmarks/kairos-seb/results/qwen_framework_results.json" << EOF
{
  "model": "$MODEL",
  "accuracy": $ACCURACY,
  "correct": $CORRECT,
  "total": $TOTAL,
  "timestamp": "$(date -u +%Y-%m-%dT%H:%MZ)",
  "framework_test": true
}
EOF

echo "✅ Results saved!"