from pydantic import BaseModel
from typing import Optional, List


class LanguageCount(BaseModel):
    lang: str
    count: int


class ActivityPattern(BaseModel):
    day: int
    night: int


class WeeklyTrend(BaseModel):
    week: str
    count: int


class Scores(BaseModel):
    consistency:   int
    engagement:    int
    visibility:    int
    growth:        int
    influence:     int
    hireability:   int
    totalRepos:    int
    totalStars:    int
    totalForks:    int
    totalCommits:  int
    topLanguages:  List[LanguageCount]
    activityPattern: ActivityPattern
    weeklyTrend:   List[WeeklyTrend]


class LinkedInContext(BaseModel):
    headline:    Optional[str] = None
    connections: Optional[int] = None
    skills:      Optional[List[str]] = None


class TwitterContext(BaseModel):
    followers:      Optional[int] = None
    tweetsPerMonth: Optional[int] = None
    topTopics:      Optional[List[str]] = None


class StackOverflowContext(BaseModel):
    reputation: Optional[int] = None
    answers:    Optional[int] = None


class AnalyzeRequest(BaseModel):
    username:      str
    bio:           Optional[str] = None
    public_repos:  int
    followers:     int
    scores:        Scores
    top_languages: List[str]
    sample_commits: List[str]
    linkedin:      Optional[LinkedInContext] = None
    twitter:       Optional[TwitterContext]  = None
    stackoverflow: Optional[StackOverflowContext] = None


class AnalyzeResponse(BaseModel):
    personality_type: str
    digital_persona:  str
    strengths:        List[str]
    weaknesses:       List[str]
    suggestions:      List[str]
    summary:          str
    behavior_tags:    List[str]
    growth_verdict:   str


class ChatMessage(BaseModel):
    role:    str
    content: str


class ChatRequest(BaseModel):
    context:  str
    history:  List[ChatMessage]
    message:  str


class ChatResponse(BaseModel):
    reply: str
