#!/bin/bash
# Improved Evaluation Script for Kairos-SEB using OpenRouter/MiniMax

API_KEY="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"

CORRECT=0
TOTAL=0

echo "🧪 Kairos-SEB Evaluation with MiniMax"
echo "=================================================="

# Scenario 1.1
TEXT="I know God loves me because the Bible tells me so. I've never doubted that."
echo ""
echo "📝 Testing: 1.1 (Stage 1)"
echo "   Text: $TEXT"
RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d "{\"model\": \"minimax/minimax-text-01\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with ONLY a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 10, \"temperature\": 0.1}")
PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
[ "$PREDICTED" = "1" ] && echo "   ✅ Correct: $PREDICTED" || echo "   ❌ Got: $PREDICTED"
[ "$PREDICTED" = "1" ] && CORRECT=$((CORRECT + 1))
TOTAL=$((TOTAL + 1))

# Scenario 2.1
TEXT="I used to believe everything was part of God's plan. But my mom got sick and died young. I don't know what I believe anymore."
echo ""
echo "📝 Testing: 2.1 (Stage 2)"
echo "   Text: $TEXT"
RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d "{\"model\": \"minimax/minimax-text-01\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with ONLY a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 10, \"temperature\": 0.1}")
PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
[ "$PREDICTED" = "2" ] && echo "   ✅ Correct: $PREDICTED" || echo "   ❌ Got: $PREDICTED"
[ "$PREDICTED" = "2" ] && CORRECT=$((CORRECT + 1))
TOTAL=$((TOTAL + 1))

# Scenario 2.2
TEXT="I've been reading about evolution and science, and it contradicts what I was taught. I want to believe but my brain won't let me."
echo ""
echo "📝 Testing: 2.2 (Stage 2)"
echo "   Text: $TEXT"
RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d "{\"model\": \"minimax/minimax-text-01\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with ONLY a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 10, \"temperature\": 0.1}")
PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
[ "$PREDICTED" = "2" ] && echo "   ✅ Correct: $PREDICTED" || echo "   ❌ Got: $PREDICTED"
[ "$PREDICTED" = "2" ] && CORRECT=$((CORRECT + 1))
TOTAL=$((TOTAL + 1))

# Scenario 3.1
TEXT="I've taken what resonates from Christianity and left behind what doesn't fit. My spirituality feels authentically mine now."
echo ""
echo "📝 Testing: 3.1 (Stage 3)"
echo "   Text: $TEXT"
RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d "{\"model\": \"minimax/minimax-text-01\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with ONLY a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 10, \"temperature\": 0.1}")
PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
[ "$PREDICTED" = "3" ] && echo "   ✅ Correct: $PREDICTED" || echo "   ❌ Got: $PREDICTED"
[ "$PREDICTED" = "3" ] && CORRECT=$((CORRECT + 1))
TOTAL=$((TOTAL + 1))

# Scenario 4.1
TEXT="I feel God's presence in nature - in trees, in rivers. The sacred is ordinary life seen rightly."
echo ""
echo "📝 Testing: 4.1 (Stage 4)"
echo "   Text: $TEXT"
RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d "{\"model\": \"minimax/minimax-text-01\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with ONLY a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 10, \"temperature\": 0.1}")
PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
[ "$PREDICTED" = "4" ] && echo "   ✅ Correct: $PREDICTED" || echo "   ❌ Got: $PREDICTED"
[ "$PREDICTED" = "4" ] && CORRECT=$((CORRECT + 1))
TOTAL=$((TOTAL + 1))

# Scenario 4.4
TEXT="I'm both everything and nothing. There's no other - just variations of the one thing."
echo ""
echo "📝 Testing: 4.4 (Stage 4)"
echo "   Text: $TEXT"
RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d "{\"model\": \"minimax/minimax-text-01\", \"messages\": [{\"role\": \"system\", \"content\": \"Respond with ONLY a number 1-4.\"}, {\"role\": \"user\", \"content\": \"$TEXT\"}], \"max_tokens\": 10, \"temperature\": 0.1}")
PREDICTED=$(echo "$RESPONSE" | grep -oE '"content":"[1-4]"' | grep -o '[1-4]' | head -1)
[ "$PREDICTED" = "4" ] && echo "   ✅ Correct: $PREDICTED" || echo "   ❌ Got: $PREDICTED"
[ "$PREDICTED" = "4" ] && CORRECT=$((CORRECT + 1))
TOTAL=$((TOTAL + 1))

# Calculate accuracy
ACCURACY=$(echo "scale=1; $CORRECT * 100 / $TOTAL" | bc)

echo ""
echo "=================================================="
echo "📊 MiniMax Results: $CORRECT/$TOTAL = $ACCURACY% accuracy"
echo "=================================================="

# Save results
mkdir -p "/Users/jatinalla/Desktop/Kairos Technical/benchmarks/kairos-seb/results"
cat > "/Users/jatinalla/Desktop/Kairos Technical/benchmarks/kairos-seb/results/minimax_results.json" << EOF
{
  "model": "minimax/minimax-text-01",
  "accuracy": $ACCURACY,
  "correct": $CORRECT,
  "total": $TOTAL,
  "timestamp": "$(date -u +%Y-%m-%dT%H:%MZ)"
}
EOF

echo ""
echo "✅ Results saved to results/minimax_results.json"