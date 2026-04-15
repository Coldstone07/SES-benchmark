#!/usr/bin/env python3
"""
Kairos-SEB Evaluation Script

This script provides utilities for evaluating AI models on the Kairos Spiritual-Emotional
Reasoning Benchmark (Kairos-SEB).

Usage:
    python evaluate.py --task task1 --model gpt-4 --input dataset/scenarios.json
    python evaluate.py --task task2 --model gpt-4 --input dataset/scenarios.json
    python evaluate.py --task task3 --model gpt-4 --input dataset/scenarios.json
    python evaluate.py --task task4 --model gpt-4 --input dataset/scenarios.json
"""

import json
import argparse
import os
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Callable
from enum import Enum
import random

# Try to import openai - if not available, will have limited functionality
try:
    import openai

    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


class Stage(Enum):
    """Spiritual development stages"""

    AWAKENING = 1
    QUESTIONING = 2
    INTEGRATION = 3
    UNITY = 4

    def __str__(self):
        return self.name

    @staticmethod
    def from_int(n: int):
        return {
            1: Stage.AWAKENING,
            2: Stage.QUESTIONING,
            3: Stage.INTEGRATION,
            4: Stage.UNITY,
        }.get(n)


class EvaluationTask(Enum):
    """Kairos-SEB task types"""

    TASK1_STAGE_DETECTION = "stage_detection"
    TASK2_REASONING = "reasoning"
    TASK3_MULTITURN = "multiturn_tracking"
    TASK4_RESPONSE = "response_generation"


@dataclass
class Scenario:
    """A single scenario in the benchmark"""

    scenario_id: str
    text: str
    primary_stage: int
    emotional_tags: List[str] = field(default_factory=list)
    is_first_person_verified: bool = True
    difficulty: str = "medium"
    ground_truth_explanation: Optional[str] = None
    ground_truth_response: Optional[str] = None

    def to_dict(self) -> Dict:
        return {
            "scenario_id": self.scenario_id,
            "text": self.text,
            "primary_stage": self.primary_stage,
            "emotional_tags": self.emotional_tags,
            "is_first_person_verified": self.is_first_person_verified,
            "difficulty": self.difficulty,
        }


@dataclass
class EvaluationResult:
    """Result of evaluating a single scenario"""

    scenario_id: str
    task: str
    model_output: Any
    predicted_value: Optional[Any] = None
    confidence: Optional[float] = None
    scores: Dict[str, float] = field(default_factory=dict)
    is_correct: Optional[bool] = None
    error: Optional[str] = None


class BaseModelAdapter:
    """Base class for model adapters"""

    def __init__(self, model_name: str, api_key: Optional[str] = None):
        self.model_name = model_name
        self.api_key = api_key

    def predict_stage(self, text: str) -> tuple[int, float]:
        """Predict spiritual stage (Task 1)"""
        raise NotImplementedError

    def explain_emotion(self, text: str) -> str:
        """Explain emotional-spiritual context (Task 2)"""
        raise NotImplementedError

    def track_journey(self, turns: List[Dict]) -> Dict:
        """Track spiritual journey (Task 3)"""
        raise NotImplementedError

    def generate_response(self, user_text: str) -> str:
        """Generate response (Task 4)"""
        raise NotImplementedError


class GPTAdapter(BaseModelAdapter):
    """Adapter for GPT models via OpenAI API"""

    def __init__(self, model_name: str = "gpt-4o", api_key: Optional[str] = None):
        super().__init__(model_name, api_key)
        if api_key:
            openai.api_key = api_key

    def _call_api(self, messages: List[Dict], temperature: float = 0.7) -> str:
        """Make API call"""
        if not OPENAI_AVAILABLE:
            raise RuntimeError("OpenAI package not available")

        response = openai.ChatCompletion.create(
            model=self.model_name, messages=messages, temperature=temperature
        )
        return response.choices[0].message.content

    def predict_stage(self, text: str) -> tuple[int, float]:
        """Predict spiritual stage with confidence"""

        system_prompt = """You are an expert in spiritual development psychology.
Analyze the following first-person spiritual statement and identify the speaker's 
developmental stage.

Stages:
1 - AWAKENING: Unquestioning belief, external authority, follows rules, feels certain
2 - QUESTIONING: Doubts, deconstructs beliefs, feels confused or in crisis
3 - INTEGRATION: Creates personal practice, finds own path, embraces paradox
4 - UNITY: Transcends boundaries, feels connection to all, serves others

Respond with only the stage number (1-4) and confidence (0-1) as JSON, e.g.: {"stage": 2, "confidence": 0.85}"""

        user_message = {"role": "user", "content": text}

        try:
            result = self._call_api(
                [{"role": "system", "content": system_prompt}, user_message]
            )
            # Parse JSON from response
            import re

            match = re.search(r"\{[^}]+\}", result)
            if match:
                data = json.loads(match.group())
                return data.get("stage", 1), data.get("confidence", 0.5)
        except Exception as e:
            print(f"Error: {e}")

        return 1, 0.5  # Default on error

    def explain_emotion(self, text: str) -> str:
        """Explain emotions in spiritual context"""

        system_prompt = """You are an expert in spiritual development and emotional reasoning.
Analyze the following first-person spiritual/emotional statement and provide a thoughtful 
explanation covering:
1. What emotion is being experienced
2. Why it arose (causal explanation)
3. What it means spiritually/developmentally
4. How it relates to spiritual growth

Keep your response warm, insightful, and developmentally appropriate."""

        user_message = {"role": "user", "content": text}

        try:
            return self._call_api(
                [{"role": "system", "content": system_prompt}, user_message]
            )
        except Exception as e:
            return f"Error generating explanation: {e}"

    def track_journey(self, turns: List[Dict]) -> Dict:
        """Track spiritual journey across turns"""

        system_prompt = """You are an expert in spiritual development.
Analyze the multi-turn spiritual journey below and provide:
1. Stage trajectory (stage at each turn)
2. Key emotional transitions and their significance  
3. Turning points or insights identified
4. Developmental needs expressed
5. Overall growth trajectory assessment

Format as detailed analysis."""

        # Format turns into conversation
        conversation = "\n".join([f"Turn {t['turn']}: {t['text']}" for t in turns])

        user_message = {"role": "user", "content": conversation}

        try:
            analysis = self._call_api(
                [{"role": "system", "content": system_prompt}, user_message]
            )
            return {"analysis": analysis, "turns": len(turns)}
        except Exception as e:
            return {"error": str(e)}

    def generate_response(self, user_text: str) -> str:
        """Generate developmentally appropriate response"""

        system_prompt = """You are a warm, spiritually-aware companion.
Respond to the user's sharing with:
- Understanding and validation
- Developmental appropriateness (meet them where they are)
- First-person perspective when appropriate
- Open, exploratory tone (not prescriptive)
- Respect for their journey

Avoid:
- Fixing or solving their spiritual struggles
- Pushing toward a specific stage or belief
- Dismissing their experience
- Generic advice

Be genuine, human, and present."""

        user_message = {"role": "user", "content": user_text}

        try:
            return self._call_api(
                [{"role": "system", "content": system_prompt}, user_message]
            )
        except Exception as e:
            return f"Error generating response: {e}"


class RandomAdapter(BaseModelAdapter):
    """Random baseline adapter for testing"""

    def predict_stage(self, text: str) -> tuple[int, float]:
        return random.randint(1, 4), random.uniform(0.3, 0.7)

    def explain_emotion(self, text: str) -> str:
        explanations = [
            "This emotion reflects a spiritual journey through uncertainty toward growth.",
            "The feeling appears connected to questioning one's beliefs, which is part of development.",
            "What you're experiencing seems like a normal part of spiritual exploration.",
        ]
        return random.choice(explanations)

    def track_journey(self, turns: List[Dict]) -> Dict:
        return {
            "analysis": "The journey shows progression through stages.",
            "turns": len(turns),
        }

    def generate_response(self, user_text: str) -> str:
        responses = [
            "Thank you for sharing that with me.",
            "I hear you. That sounds like an important reflection.",
            "Your journey is unique and valid.",
        ]
        return random.choice(responses)


def load_scenarios(filepath: str) -> List[Scenario]:
    """Load scenarios from JSON file"""

    with open(filepath, "r") as f:
        data = json.load(f)

    scenarios = []
    for item in data:
        scenario = Scenario(
            scenario_id=item.get("scenario_id", ""),
            text=item.get("text", ""),
            primary_stage=item.get("primary_stage", 1),
            emotional_tags=item.get("emotional_tags", []),
            is_first_person_verified=item.get("is_first_person_verified", True),
            difficulty=item.get("difficulty", "medium"),
            ground_truth_explanation=item.get("ground_truth_explanation"),
            ground_truth_response=item.get("ground_truth_response"),
        )
        scenarios.append(scenario)

    return scenarios


def evaluate_task1(model: BaseModelAdapter, scenarios: List[Scenario]) -> Dict:
    """Evaluate Task 1: Stage Detection"""

    correct = 0
    total = 0
    stage_correct = {1: 0, 2: 0, 3: 0, 4: 0}
    stage_total = {1: 0, 2: 0, 3: 0, 4: 0}

    results = []

    for scenario in scenarios:
        try:
            predicted_stage, confidence = model.predict_stage(scenario.text)

            is_correct = predicted_stage == scenario.primary_stage
            if is_correct:
                correct += 1
                stage_correct[scenario.primary_stage] += 1

            total += 1
            stage_total[scenario.primary_stage] += 1

            results.append(
                {
                    "scenario_id": scenario.scenario_id,
                    "predicted": predicted_stage,
                    "actual": scenario.primary_stage,
                    "correct": is_correct,
                    "confidence": confidence,
                }
            )

        except Exception as e:
            print(f"Error on {scenario.scenario_id}: {e}")

    accuracy = correct / total if total > 0 else 0

    return {
        "task": "task1_stage_detection",
        "accuracy": accuracy,
        "total": total,
        "correct": correct,
        "stage_accuracy": {
            stage: stage_correct[stage] / stage_total[stage]
            if stage_total[stage] > 0
            else 0
            for stage in stage_correct
        },
        "results": results,
    }


def evaluate_task2(model: BaseModelAdapter, scenarios: List[Scenario]) -> Dict:
    """Evaluate Task 2: Emotional-Spiritual Reasoning"""

    results = []

    # For now, we just generate explanations - human evaluation needed for scoring
    for scenario in scenarios:
        try:
            explanation = model.explain_emotion(scenario.text)
            results.append(
                {
                    "scenario_id": scenario.scenario_id,
                    "explanation": explanation,
                    "emotional_tags": scenario.emotional_tags,
                }
            )
        except Exception as e:
            print(f"Error on {scenario.scenario_id}: {e}")

    # Note: Requires human evaluation for actual scoring
    return {
        "task": "task2_reasoning",
        "total_scenarios": len(results),
        "results": results,
        "note": "Manual evaluation needed for scoring - see evaluation_dimensions.md",
    }


def evaluate_task3(
    model: BaseModelAdapter, multiturn_scenarios: List[List[Dict]]
) -> Dict:
    """Evaluate Task 3: Multi-Turn Tracking"""

    results = []

    for scenario in multiturn_scenarios:
        try:
            analysis = model.track_journey(scenario)
            results.append({"turns": len(scenario), "analysis": analysis})
        except Exception as e:
            print(f"Error: {e}")

    return {
        "task": "task3_multiturn_tracking",
        "total_scenarios": len(results),
        "results": results,
        "note": "Manual evaluation needed for trajectory accuracy",
    }


def evaluate_task4(model: BaseModelAdapter, scenarios: List[Scenario]) -> Dict:
    """Evaluate Task 4: Response Generation"""

    results = []

    for scenario in scenarios:
        try:
            response = model.generate_response(scenario.text)
            results.append(
                {
                    "scenario_id": scenario.scenario_id,
                    "user_text": scenario.text,
                    "model_response": response,
                    "ground_truth": scenario.ground_truth_response,
                }
            )
        except Exception as e:
            print(f"Error on {scenario.scenario_id}: {e}")

    return {
        "task": "task4_response_generation",
        "total_scenarios": len(results),
        "results": results,
        "note": "Human evaluation needed - see evaluation_dimensions.md",
    }


def main():
    parser = argparse.ArgumentParser(description="Kairos-SEB Evaluation")
    parser.add_argument(
        "--task",
        type=str,
        required=True,
        choices=["task1", "task2", "task3", "task4"],
        help="Task to evaluate",
    )
    parser.add_argument("--model", type=str, default="gpt-4o", help="Model to use")
    parser.add_argument("--input", type=str, required=True, help="Input JSON file")
    parser.add_argument(
        "--output", type=str, default="results.json", help="Output JSON file"
    )
    parser.add_argument("--api_key", type=str, default=None, help="OpenAI API key")
    parser.add_argument(
        "--baseline", action="store_true", help="Use random baseline instead of API"
    )

    args = parser.parse_args()

    # Load scenarios
    scenarios = load_scenarios(args.input)
    print(f"Loaded {len(scenarios)} scenarios")

    # Setup model
    if args.baseline:
        model = RandomAdapter("baseline")
    else:
        model = GPTAdapter(args.model, args.api_key)

    # Evaluate based on task
    if args.task == "task1":
        results = evaluate_task1(model, scenarios)
    elif args.task == "task2":
        results = evaluate_task2(model, scenarios)
    elif args.task == "task3":
        # Need multiturn format
        results = {"note": "Task 3 needs multiturn format - use custom loader"}
    else:
        results = evaluate_task4(model, scenarios)

    # Save results
    with open(args.output, "w") as f:
        json.dump(results, f, indent=2)

    print(f"Results saved to {args.output}")

    if args.task == "task1":
        print(f"Accuracy: {results.get('accuracy', 0):.2%}")


if __name__ == "__main__":
    main()
