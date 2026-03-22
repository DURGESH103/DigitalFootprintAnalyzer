def detect_personality(scores: dict, top_languages: list[str], linkedin=None, twitter=None) -> str:
    consistency = scores.get("consistency", 0)
    engagement  = scores.get("engagement",  0)
    visibility  = scores.get("visibility",  0)
    growth      = scores.get("growth",      0)
    total_repos = scores.get("totalRepos",  0)

    if consistency >= 70 and engagement >= 50 and visibility >= 40:
        return "The Architect"
    if growth >= 70 and total_repos >= 20:
        return "The Explorer"
    if consistency >= 60 and total_repos < 15:
        return "The Specialist"
    if "Jupyter Notebook" in top_languages or "Python" in top_languages:
        return "The Data Scientist"
    if twitter and twitter.get("followers", 0) > 1000:
        return "The Influencer"
    if linkedin and linkedin.get("connections", 0) > 500:
        return "The Networker"
    return "The Builder"


def detect_behavior_tags(scores: dict, linkedin=None, twitter=None) -> list[str]:
    tags = []
    if scores.get("consistency", 0) >= 60:
        tags.append("Consistent Contributor")
    else:
        tags.append("Sporadic Coder")

    if scores.get("visibility", 0) >= 50:
        tags.append("High Visibility")
    else:
        tags.append("Low Visibility")

    if scores.get("growth", 0) >= 60:
        tags.append("Fast Grower")
    elif scores.get("growth", 0) < 30:
        tags.append("Stagnant Growth")

    if twitter and twitter.get("tweetsPerMonth", 0) >= 10:
        tags.append("Active on Social")
    else:
        tags.append("Silent Builder")

    if linkedin and linkedin.get("connections", 0) >= 300:
        tags.append("Well Networked")

    if scores.get("influence", 0) >= 50:
        tags.append("Community Influencer")

    return tags[:5]


def growth_verdict(scores: dict) -> str:
    growth = scores.get("growth", 0)
    if growth >= 70:
        return "Rapidly improving — strong upward trajectory"
    if growth >= 50:
        return "Steadily growing — consistent progress"
    if growth >= 30:
        return "Moderate growth — some momentum"
    return "Growth stalled — needs renewed focus"


def build_digital_persona(personality: str, scores: dict, tags: list[str]) -> str:
    consistency = scores.get("consistency", 0)
    visibility  = scores.get("visibility",  0)
    influence   = scores.get("influence",   0)

    depth = "strong technical depth" if consistency >= 60 else "developing technical foundation"
    vis   = "high visibility" if visibility >= 50 else "low public visibility"
    inf   = "growing influence" if influence >= 40 else "limited community influence"

    return f"You are a {personality.lower().replace('the ', '')} with {depth}, {vis}, and {inf}."


def rule_based_insights(data: dict) -> dict:
    scores     = data["scores"]
    languages  = data["top_languages"]
    linkedin   = data.get("linkedin")
    twitter    = data.get("twitter")
    stackoverflow = data.get("stackoverflow")

    consistency = scores.get("consistency", 0)
    engagement  = scores.get("engagement",  0)
    visibility  = scores.get("visibility",  0)
    growth      = scores.get("growth",      0)
    influence   = scores.get("influence",   0)
    activity    = scores.get("activityPattern", {})

    strengths, weaknesses, suggestions = [], [], []

    # Consistency
    if consistency >= 60:
        strengths.append("Highly consistent contributor — commits regularly")
    else:
        weaknesses.append("Inconsistent commit activity")
        suggestions.append("Commit daily, even small changes — consistency compounds over time")

    # Engagement
    if engagement >= 50:
        strengths.append("Strong community engagement (stars & forks)")
    else:
        weaknesses.append("Low community engagement on GitHub")
        suggestions.append("Share projects on social media and open-source communities")

    # Visibility
    if visibility >= 50:
        strengths.append("Good public visibility across platforms")
    else:
        weaknesses.append("Low cross-platform visibility")
        suggestions.append("Build a personal brand — write blogs, tweet about your work")

    # Growth
    if growth >= 60:
        strengths.append("Strong recent growth trajectory")
    elif growth < 30:
        weaknesses.append("Activity has slowed recently")
        suggestions.append("Set a 30-day challenge: contribute to one open-source project")

    # Languages
    if len(languages) >= 3:
        strengths.append(f"Polyglot developer: {', '.join(languages[:3])}")
    else:
        suggestions.append("Explore complementary languages to broaden your skill set")

    # Activity pattern
    if activity.get("night", 0) > 60:
        strengths.append("Night owl — highly productive in off-hours")

    # LinkedIn
    if linkedin:
        if linkedin.get("connections", 0) >= 300:
            strengths.append(f"Well-networked on LinkedIn ({linkedin['connections']} connections)")
        else:
            suggestions.append("Grow your LinkedIn network — connect with peers and mentors")
        if linkedin.get("postFrequency", 0) >= 4:
            strengths.append("Active LinkedIn presence")

    # Twitter
    if twitter:
        if twitter.get("followers", 0) >= 500:
            strengths.append(f"Twitter following of {twitter['followers']} — good reach")
        if twitter.get("tweetsPerMonth", 0) < 4:
            suggestions.append("Tweet more about your work — even 1 post/week builds visibility")

    # StackOverflow
    if stackoverflow:
        if stackoverflow.get("reputation", 0) >= 1000:
            strengths.append(f"Strong StackOverflow reputation ({stackoverflow['reputation']})")
        else:
            suggestions.append("Answer questions on StackOverflow to build credibility")

    # Influence
    if influence >= 50:
        strengths.append("Meaningful community influence")

    personality    = detect_personality(scores, languages, linkedin, twitter)
    behavior_tags  = detect_behavior_tags(scores, linkedin, twitter)
    verdict        = growth_verdict(scores)
    digital_persona = build_digital_persona(personality, scores, behavior_tags)

    summary = (
        f"{data['username']} is a {personality} with {scores.get('totalRepos', 0)} public repos, "
        f"hireability {scores.get('hireability', 0)}/100, consistency {consistency}/100, "
        f"and {scores.get('totalStars', 0)} total stars."
    )

    return {
        "personality_type": personality,
        "digital_persona":  digital_persona,
        "strengths":        strengths[:5],
        "weaknesses":       weaknesses[:3],
        "suggestions":      suggestions[:5],
        "summary":          summary,
        "behavior_tags":    behavior_tags,
        "growth_verdict":   verdict,
    }
