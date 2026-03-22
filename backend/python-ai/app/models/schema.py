from pydantic import BaseModel
from typing import Optional


class LanguageCount(BaseModel):
    lang: str
    count: int


class Scores(BaseModel):
    consistency: int
    engagement: int
    totalRepos: int
    totalStars: int
    totalForks: int
    topLanguages: list[LanguageCount]
    activityPattern: dict


class AnalyzeRequest(BaseModel):
    username: str
    bio: Optional[str] = None
    public_repos: int
    followers: int
    scores: Scores
    top_languages: list[str]
    sample_commits: list[str]


class AnalyzeResponse(BaseModel):
    personality_type: str
    strengths: list[str]
    weaknesses: list[str]
    suggestions: list[str]
    summary: str
