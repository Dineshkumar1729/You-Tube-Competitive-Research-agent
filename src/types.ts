export interface Video {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  views: number;
  likes: number;
  comments: number;
  thumbnailUrl: string;
  thumbnailAnalysis?: ThumbnailAnalysis;
  transcriptSummary: string;
  videoAnalysis?: VideoAnalysis;
}

export interface ThumbnailAnalysis {
  faceUsage: string; // e.g., "Close-up emotional face pointing at AI logos"
  reactionExpressions: string; // e.g., "Shock, focus, intense determination"
  boldTextUsage: string; // e.g., "3 Words max, bright yellow shadow'"
  aiImagery: string; // e.g., "ChatGPT avatars, neon neural nodes, futuristic grids"
  colorPsychology: string; // e.g., "Highly saturated blue and neon green accents"
  contrastLayouts: string; // e.g., "Dark background with bright glowing center elements"
}

export interface VideoAnalysis {
  mainTopic: string;
  subtopic: string;
  storytellingStyle: string;
  educationalStyle: string;
  audienceTargeting: string;
  emotionalTriggers: string[];
  monetizationAngle: string;
  engagementStrategy: string;
  viralityIndicators: string[];
}

export interface CreatorChannel {
  id: string;
  name: string;
  handle: string;
  subscriberCount: string;
  totalVideosCount: number;
  primaryNiche: string;
  avatarUrl: string;
  avgViews: number;
  videos: Video[];
}

export interface TrendIntelligence {
  recurringKeywords: string[];
  recurringTopics: string[];
  trendingNiches: string[];
  highPerformingContentPatterns: string[];
  commonTitlePatterns: string[];
  uploadFrequencyPatterns: string;
  successfulContentFrameworks: string[];
}

export interface StrategicRecommendations {
  bestContentFormat: string; // Answers Q1
  whyViewersClick: string; // Answers Q2
  bestHooks: string; // Answers Q3
  engagingContentStyles: string; // Answers Q4
  oversaturatedTopics: string[]; // Answers Q5
  underexploredNiches: string[]; // Answers Q6
  newCreatorOpportunities: string[]; // Answers Q7
  fasterGrowthPlaybook: string[]; // Answers Q8
}

export interface CompetitorComparisonRow {
  channelName: string;
  subCount: string;
  avgViews: number;
  primaryFormat: string;
  keyStrength: string;
  weaknessToExploit: string;
}

export interface FullReport {
  id: string;
  title: string;
  date: string;
  version: number;
  executiveSummary: string;
  competitorComparison: CompetitorComparisonRow[];
  audiencePsychologyInsights: string;
  viralityPatterns: string;
  finalConclusion: string;
}

export interface AgentLog {
  agentName: string;
  timestamp: string;
  log: string;
}

export interface ResearchRun {
  id: string;
  timestamp: string;
  channels: CreatorChannel[];
  trends: TrendIntelligence;
  recommendations: StrategicRecommendations;
  report: FullReport;
  agentLogs: AgentLog[];
}

export interface DBState {
  runs: ResearchRun[];
}
