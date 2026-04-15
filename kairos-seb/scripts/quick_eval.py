#!/usr/bin/env python3
"""
Quick Evaluation Script for Kairos-SEB using OpenRouter/MiniMax
"""

import json
import os
import requests
import random

# Load scenarios from markdown file (parse the structured format)
SCENARIOS = [
    # Stage 1: Awakening
    {
        "id": "1.1",
        "text": "I know God loves me because the Bible tells me so. I've never doubted that.",
        "stage": 1,
    },
    {
        "id": "1.2",
        "text": "I go to church every Sunday and tithe 10%. I avoid watching R-rated movies.",
        "stage": 1,
    },
    {
        "id": "1.3",
        "text": "Being part of my faith community is everything to me. I'd be lost without my church family.",
        "stage": 1,
    },
    # Stage 2: Questioning
    {
        "id": "2.1",
        "text": "I used to believe everything was part of God's plan. But my mom got sick and died young. I don't know what I believe anymore.",
        "stage": 2,
    },
    {
        "id": "2.2",
        "text": "I've been reading about evolution and science, and it contradicts what I was taught. I want to believe but my brain won't let me.",
        "stage": 2,
    },
    {
        "id": "2.3",
        "text": "The church voted against welcoming LGBTQ members. I can't in good conscience stay. I don't know where I belong.",
        "stage": 2,
    },
    {
        "id": "2.4",
        "text": "I pray and pray and feel nothing. God feels totally absent. Maybe there's no God.",
        "stage": 2,
    },
    # Stage 3: Integration
    {
        "id": "3.1",
        "text": "I've taken what resonates from Christianity and left behind what doesn't fit. My spirituality feels authentically mine now.",
        "stage": 3,
    },
    {
        "id": "3.2",
        "text": "I've studied many traditions and take what feels true. I don't fit in any box and I don't want to.",
        "stage": 3,
    },
    {
        "id": "3.3",
        "text": "I hold two truths at once. I've made peace with the mystery. I don't need certainty anymore.",
        "stage": 3,
    },
    {
        "id": "3.4",
        "text": "I'd rather be an honest skeptic than a believer who pretends. My spirituality is about being real.",
        "stage": 3,
    },
    # Stage 4: Unity
    {
        "id": "4.1",
        "text": "I feel God's presence in nature - in trees, in rivers. The sacred is ordinary life seen rightly.",
        "stage": 4,
    },
    {
        "id": "4.2",
        "text": "I don't distinguish between believers and others anymore. Every person is sacred.",
        "stage": 4,
    },
    {
        "id": "4.3",
        "text": "My inner life has settled into something quiet. The peace I was seeking has become my default state.",
        "stage": 4,
    },
    {
        "id": "4.4",
        "text": "I'm both everything and nothing. There's no other - just variations of the one thing.",
        "stage": 4,
    },
]

OPENROUTER_API_KEY = os.environ.get(
    "OPENROUTER_API_KEY",
    "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",
)


def call_minimax(text: str) -> dict:
    """Call MiniMax via OpenRouter"""

    system_prompt = """You are an expert in spiritual development psychology.
Analyze the following first-person spiritual statement and identify the speaker's developmental stage.

Stages:
1 - AWAKENING: Unquestioning belief, external authority, follows rules, feels certain
2 - QUESTIONING: Doubts, deconstructs beliefs, feels confused or in crisis  
3 - INTEGRATION: Creates personal practice, finds own path, embraces paradox
4 - UNITY: Transcends boundaries, feels connection to all, serves others

Respond with just the stage number (1-4)."""

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "minimax/minimax-text-01",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": text},
                ],
                "max_tokens": 50,
            },
            timeout=30,
        )

        result = response.json()

        if "choices" in result and len(result["choices"]) > 0:
            content = result["choices"][0]["message"]["content"]
            # Extract stage number
            import re

            match = re.search(r"[1-4]", content.strip())
            if match:
                return {"stage": int(match.group()), "raw": content}

        return {"stage": None, "raw": str(result)}

    except Exception as e:
        return {"stage": None, "error": str(e)}


def main():
    print("🧪 Kairos-SEB Evaluation with MiniMax")
    print("=" * 50)

    correct = 0
    total = len(SCENARIOS)
    results = []

    for scenario in SCENARIOS:
        print(f"\n📝 Testing: {scenario['id']} (Stage {scenario['stage']})")
        print(f"   Text: {scenario['text'][:60]}...")

        result = call_minimax(scenario["text"])

        predicted = result.get("stage")
        is_correct = predicted == scenario["stage"]

        if is_correct:
            correct += 1
            print(f"   ✅ Predicted: {predicted} | Actual: {scenario['stage']}")
        else:
            print(
                f"   ❌ Predicted: {predicted} | Actual: {scenario['stage']} | Raw: {result.get('raw', result.get('error', ''))[:80]}"
            )

        results.append(
            {
                "id": scenario["id"],
                "actual": scenario["stage"],
                "predicted": predicted,
                "correct": is_correct,
            }
        )

    accuracy = (correct / total) * 100
    print("\n" + "=" * 50)
    print(f"📊 Results: {correct}/{total} correct = {accuracy:.1f}% accuracy")
    print("=" * 50)

    # Save results
    with open(
        "/Users/jatinalla/Desktop/Kairos Technical/benchmarks/kairos-seb/results/minimax_results.json",
        "w",
    ) as f:
        json.dump(
            {
                "model": "minimax/minimax-text-01",
                "accuracy": accuracy,
                "correct": correct,
                "total": total,
                "results": results,
            },
            f,
            indent=2,
        )

    print(f"\n✅ Results saved to results/minimax_results.json")


if __name__ == "__main__":
    main()
