import os
import json
from dotenv import load_dotenv
from .nlp import rule_based_insights

load_dotenv()

USE_OPENAI    = os.getenv("USE_OPENAI", "false").lower() == "true"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


async def run_analysis(data: dict) -> dict:
    if USE_OPENAI and OPENAI_API_KEY:
        try:
            return await _openai_analysis(data)
        except Exception:
            pass
    return rule_based_insights(data)


async def run_chat(context: str, history: list, message: str) -> str:
    if USE_OPENAI and OPENAI_API_KEY:
        try:
            return await _openai_chat(context, history, message)
        except Exception:
            pass
    return _fallback_chat(message)


async def _openai_analysis(data: dict) -> dict:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=OPENAI_API_KEY)

    linkedin_ctx = ""
    if data.get("linkedin"):
        li = data["linkedin"]
        linkedin_ctx = f"\nLinkedIn: {li.get('headline','')}, {li.get('connections',0)} connections, Skills: {', '.join(li.get('skills',[]))}"

    twitter_ctx = ""
    if data.get("twitter"):
        tw = data["twitter"]
        twitter_ctx = f"\nTwitter: {tw.get('followers',0)} followers, {tw.get('tweetsPerMonth',0)} tweets/month, Topics: {', '.join(tw.get('topTopics',[]))}"

    so_ctx = ""
    if data.get("stackoverflow"):
        so = data["stackoverflow"]
        so_ctx = f"\nStackOverflow: {so.get('reputation',0)} reputation, {so.get('answers',0)} answers"

    prompt = f"""You are an expert developer profile analyst. Analyze this multi-platform developer profile and return a JSON object with exactly these keys:
- personality_type (string: one of "The Architect", "The Explorer", "The Specialist", "The Data Scientist", "The Builder", "The Influencer", "The Networker")
- digital_persona (string: 1-2 sentence description like "You are a consistent builder with low visibility but strong technical depth")
- strengths (list of 3-5 strings)
- weaknesses (list of 2-3 strings)
- suggestions (list of 3-5 actionable strings)
- summary (string: 2-3 sentences)
- behavior_tags (list of 3-5 short tags like "Consistent Contributor", "Night Owl", "Silent Builder")
- growth_verdict (string: one sentence about growth trajectory)

Profile:
Username: {data['username']}
Bio: {data.get('bio', 'N/A')}
Public Repos: {data['public_repos']}
Followers: {data['followers']}
Top Languages: {', '.join(data['top_languages'])}
Hireability: {data['scores']['hireability']}/100
Consistency: {data['scores']['consistency']}/100
Visibility: {data['scores']['visibility']}/100
Growth: {data['scores']['growth']}/100
Influence: {data['scores']['influence']}/100
Total Stars: {data['scores']['totalStars']}
Activity: {data['scores']['activityPattern']}{linkedin_ctx}{twitter_ctx}{so_ctx}
Sample Commits: {'; '.join(data['sample_commits'][:5])}

Respond ONLY with valid JSON."""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )
    return json.loads(response.choices[0].message.content)


async def _openai_chat(context: str, history: list, message: str) -> str:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=OPENAI_API_KEY)

    messages = [
        {"role": "system", "content": f"You are a helpful career coach and developer advisor. Here is the user's profile data:\n\n{context}\n\nGive concise, actionable advice based on their actual data."},
        *[{"role": m["role"], "content": m["content"]} for m in history[-8:]],
        {"role": "user", "content": message},
    ]

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=400,
    )
    return response.choices[0].message.content


def _fallback_chat(message: str) -> str:
    return "I'm here to help! Please make sure your analysis is complete so I can give you personalized advice based on your actual data."
