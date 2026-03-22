import os
from dotenv import load_dotenv
from .nlp import rule_based_insights

load_dotenv()

USE_OPENAI = os.getenv("USE_OPENAI", "false").lower() == "true"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


async def run_analysis(data: dict) -> dict:
    if USE_OPENAI and OPENAI_API_KEY:
        return await _openai_analysis(data)
    return rule_based_insights(data)


async def _openai_analysis(data: dict) -> dict:
    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=OPENAI_API_KEY)

    prompt = f"""
You are a developer profile analyst. Analyze this GitHub profile and return a JSON object with:
- personality_type (string)
- strengths (list of strings)
- weaknesses (list of strings)
- suggestions (list of strings)
- summary (string)

Profile data:
Username: {data['username']}
Bio: {data.get('bio', 'N/A')}
Public Repos: {data['public_repos']}
Followers: {data['followers']}
Top Languages: {', '.join(data['top_languages'])}
Consistency Score: {data['scores']['consistency']}/100
Engagement Score: {data['scores']['engagement']}/100
Activity Pattern: {data['scores']['activityPattern']}
Sample Commits: {'; '.join(data['sample_commits'][:5])}

Respond ONLY with valid JSON.
"""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )

    import json
    return json.loads(response.choices[0].message.content)
