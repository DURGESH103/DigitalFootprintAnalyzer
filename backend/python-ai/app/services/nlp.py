def detect_personality(scores: dict, top_languages: list[str]) -> str:
    consistency = scores.get("consistency", 0)
    engagement = scores.get("engagement", 0)
    total_repos = scores.get("totalRepos", 0)

    if consistency >= 70 and engagement >= 50:
        return "The Architect"
    if total_repos >= 30 and engagement >= 40:
        return "The Explorer"
    if consistency >= 50 and total_repos < 10:
        return "The Specialist"
    if "Jupyter Notebook" in top_languages or "Python" in top_languages:
        return "The Data Scientist"
    return "The Builder"


def rule_based_insights(data: dict) -> dict:
    scores = data["scores"]
    languages = data["top_languages"]
    consistency = scores.get("consistency", 0)
    engagement = scores.get("engagement", 0)
    activity = scores.get("activityPattern", {})

    strengths, weaknesses, suggestions = [], [], []

    if consistency >= 60:
        strengths.append("Highly consistent contributor")
    else:
        weaknesses.append("Inconsistent commit activity")
        suggestions.append("Try committing daily, even small changes count")

    if engagement >= 50:
        strengths.append("Strong community engagement (stars & forks)")
    else:
        weaknesses.append("Low community engagement")
        suggestions.append("Share your projects on social media and open-source communities")

    if len(languages) >= 3:
        strengths.append(f"Polyglot developer: {', '.join(languages[:3])}")
    else:
        suggestions.append("Explore new programming languages to broaden your skill set")

    night_pct = activity.get("night", 0)
    if night_pct > 60:
        strengths.append("Night owl — productive in off-hours")

    personality = detect_personality(scores, languages)
    summary = (
        f"{data['username']} is a {personality} with {scores.get('totalRepos', 0)} public repos, "
        f"a consistency score of {consistency}/100, and {scores.get('totalStars', 0)} total stars."
    )

    return {
        "personality_type": personality,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggestions": suggestions,
        "summary": summary,
    }
