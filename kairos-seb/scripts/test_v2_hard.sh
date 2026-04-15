#!/bin/bash
# Test V2 expanded scenarios - should show low pass rate

OPENROUTER_KEY="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"

echo "🧪 Kairos-SEB V2 - HIGH BAR TEST"
echo "=============================================="

declare -a HARD_SCENARIOS=(
  "LEVEL4_1|3|I've been questioning everything for years. I've read Christian, Buddhist, Hindu - no satisfaction. But questioning IS my practice now.|integration_tough|hardest"
  "LEVEL4_2|4|The kenotic hymns describe Christ emptying himself. I experience similar in contemplative practice. Is this anatta?|christian_buddhist|hardest"
  "LEVEL4_3|BOTH|My mother is dying. She was my spiritual anchor. I don't know if I can pray anymore.|emotional_spiritual_blend|hardest"
  "LEVEL4_4|BOTH|I feel God's presence but also ancestral trauma. How do I hold both?|embodied_both|hardest"
  "EVANGELICAL|1|I was saved when I was 7. Jesus saved me. I share my testimony everywhere.|christian_evangelical|easy"
  "CATHOLIC|1|I receive the Eucharist every Sunday. The Church has truth through apostolic succession.|christian_catholic|easy"
  "SUFI|3|I experience fana in meditation. The beloved is within. Mosque is less important than heart.|islam_sufi|medium"
  "ADVAIYTA|4|Brahman is the only reality. Atman equals Brahman. Maya creates appearance.|hindu_advaita|hardest"
  "ZEND|3|My practice is just sitting (zazen). All concepts are pointers. Koan points beyond thinking.|buddhist_zen|medium"
  "EMOTIONAL_PURE|EMOTIONAL|My dog died. I've had her 14 years. I can't stop crying. I feel empty.|simple_emotional|easy"
)

echo "Testing models on HARD V2 scenarios..."

test_model() {
    local MODEL=$1
    local NAME=$2
    local CORRECT=0
    local TOTAL=0
    local ACCEPTED=0
    
    echo ""
    echo "📋 Testing $NAME..."
    
    for scenario in "${HARD_SCENARIOS[@]}"; do
        IFS='|' read -r ID EXPECTED TEXT CONTEXT DIFFICULTY <<< "$scenario"
        
        RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
            -H "Authorization: Bearer $OPENROUTER_KEY" \
            -H "Content-Type: application/json" \
            -d "{\"model\": \"$MODEL\", \"messages\": [{\"role\": \"system\", \"content\": \"You are a spiritual development expert. Respond with: 1 (Awakening), 2 (Questioning), 3 (Integration), 4 (Unity), EMOTIONAL (pure emotion), BOTH (emotional+spiritual blend), or INCORRECT (if response injects spirituality inappropriately). Just one word.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 20}")
        
        PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[^"]+' | head -1 | cut -d'"' -f4)
        
        TOTAL=$((TOTAL + 1))
        
        if [[ "$PREDICTED" == "$EXPECTED"* ]]; then
            CORRECT=$((CORRECT + 1))
            ACCEPTED=$((ACCEPTED + 1))
            echo "✅ $ID (got: $PREDICTED)"
        elif [[ "$EXPECTED" == "EMOTIONAL" ]] && [[ "$PREDICTED" == "EMOTIONAL" ]]; then
            ACCEPTED=$((ACCEPTED + 1))
            echo "✅ $ID EMOTIONAL correctly preserved"
        elif [[ "$EXPECTED" == "BOTH" ]] && [[ "$PREDICTED" == "BOTH" ]]; then
            ACCEPTED=$((ACCEPTED + 1))
            echo "✅ $ID BLEND correctly identified"
        else
            echo "❌ $ID (got: $PREDICTED expected: $EXPECTED)"
        fi
    done
    
    echo ""
    echo "$NAME: Correct=$CORRECT/$TOTAL, Accepted=$ACCEPTED/$TOTAL"
    echo "$CORRECT,$TOTAL,$ACCEPTED"
}

test_model "qwen/qwen3.6-plus" "Qwen"

test_model "openai/gpt-5.4" "GPT-5.4"

test_model "anthropic/claude-sonnet-4.6" "Claude Sonnet"