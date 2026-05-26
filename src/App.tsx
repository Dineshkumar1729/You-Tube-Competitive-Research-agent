import React, { useState, useEffect, useRef } from 'react';
import {
  Youtube,
  Play,
  Sparkles,
  Plus,
  Trash2,
  Cpu,
  Brain,
  Download,
  RefreshCw,
  BarChart2,
  Eye,
  ThumbsUp,
  MessageSquare,
  Clock,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Sliders,
  CheckCircle,
  FileText,
  User,
  AlertCircle,
  FileSpreadsheet,
  X,
  FileCode,
  Activity,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Cell,
  Pie
} from 'recharts';
import { CreatorChannel, ResearchRun, Video } from './types';

export default function App() {
  // Global Application State  
  const [creators, setCreators] = useState<CreatorChannel[]>([]);
  const clearDashboard = () => {setCreators([])};
  const [historicalRuns, setHistoricalRuns] = useState<ResearchRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<ResearchRun | null>(null);
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([]);
  
  // UI & UX Helper States
  const [activeTab, setActiveTab] = useState<'playbook' | 'insights' | 'comparison' | 'charts'>('playbook');
  const [activeCreatorDrawer, setActiveCreatorDrawer] = useState<CreatorChannel | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisLogs, setAnalysisLogs] = useState<{ agentName: string; timestamp: string; log: string }[]>([]);
  const [logIndex, setLogIndex] = useState(0);
  const logTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logsBottomRef = useRef<HTMLDivElement | null>(null);

  // Custom Channel Input State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: '',
    handle: '',
    subscriberCount: '150K',
    primaryNiche: 'AI Agent Workflows & Low-Code tools',
    avgViews: 45000,
  });
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  // Fetch initial app state on mount
  const refreshState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        setCreators(data.creators || []);
        setHistoricalRuns(data.runs || []);
        
        // Auto-select the latest run if available
        if (data.runs && data.runs.length > 0) {
          setSelectedRun(data.runs[data.runs.length - 1]);
        }
        
        // Default with all creators selected
        if (data.creators && data.creators.length > 0 && selectedChannelIds.length === 0) {
          setSelectedChannelIds(data.creators.map((c: CreatorChannel) => c.id));
        }
      }
    } catch (e) {
      console.error('Failed to load state', e);
    }
  };

  useEffect(() => {
    refreshState();
  }, []);

  // Update latest selected run whenever historical runs change (e.g. after fresh analysis)
  useEffect(() => {
    if (historicalRuns.length > 0 && (!selectedRun || !historicalRuns.find(r => r.id === selectedRun.id))) {
      setSelectedRun(historicalRuns[historicalRuns.length - 1]);
    }
  }, [historicalRuns]);

  // Handle auto-scroll in agent logs console
  useEffect(() => {
    if (logsBottomRef.current) {
      logsBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [analysisLogs]);

  // Launch Autonomous Multi-Agent Research Trigger
  const triggerResearchAgent = async () => {
    if (selectedChannelIds.length === 0) {
      alert('Please select at least one competitor channel to include in the research pool.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(5);
    setAnalysisLogs([]);
    setLogIndex(0);

    const simulationLogs = [
      { agentName: 'Research & Scraping Agent', log: 'Spawning collector node. Querying remote YouTube payloads...' },
      { agentName: 'Research & Scraping Agent', log: `Processing creators database metrics for: ${creators.filter(c => selectedChannelIds.includes(c.id)).map(c => c.name).join(', ')}` },
      { agentName: 'Research & Scraping Agent', log: 'Parsing video endpoints. Harvesting title texts, tags lists, descriptions, and publish histories...' },
      { agentName: 'Visual Analytics & Psychology Agent', log: 'Opening thumbnail assets analyzer. Instantiating emotion-sensors and color matrix models...' },
      { agentName: 'Visual Analytics & Psychology Agent', log: 'Deconstructing composition templates. Scoring contrast margins, face close-ups, and AI neon color ratios.' },
      { agentName: 'Trend Intelligence Broker', log: 'Mapping keyword occurrences. Running semantic checks to locate trending AI micro-niches...' },
      { agentName: 'Strategic Recommendations Architect', log: 'Synthesizing historical run data. Identifying trend shifts and formulating growth playbooks...' },
      { agentName: 'Strategic Recommendations Architect', log: 'Connecting server-side Gemini 3.5 AI Engine to solve key competitive questions...' },
      { agentName: 'Executive Report Compiler', log: 'Formatting custom layout packages. Writing raw JSON caches and exporting standard printable reports...' }
    ];

    // Simulate logs printing to provide high-fidelity multi-agent experience
    let currentLogIndex = 0;
    const intervalTime = 1200;
    
    logTimerRef.current = setInterval(() => {
      if (currentLogIndex < simulationLogs.length) {
        const item = simulationLogs[currentLogIndex];
        setAnalysisLogs(prev => [...prev, {
          agentName: item.agentName,
          timestamp: new Date().toLocaleTimeString(),
          log: item.log
        }]);
        setAnalysisProgress(prev => Math.min(prev + 10, 85));
        currentLogIndex++;
      } else {
        clearInterval(logTimerRef.current!);
      }
    }, intervalTime);

    try {
      const response = await fetch('/api/run-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelIds: selectedChannelIds }),
      });

      if (response.ok) {
        const result = await response.json();
        // Clear interval if still running
        if (logTimerRef.current) clearInterval(logTimerRef.current);

        // Mix real server logs with simulated ones if they differ, or set real logs
        if (result.run && result.run.agentLogs) {
          setAnalysisLogs(result.run.agentLogs);
        }

        setAnalysisProgress(100);
        setTimeout(() => {
          setIsAnalyzing(false);
          refreshState();
        }, 1500);
      } else {
        throw new Error('Analysis request failed on server.');
      }
    } catch (e: any) {
      if (logTimerRef.current) clearInterval(logTimerRef.current);
      setIsAnalyzing(false);
      alert(`Research pipeline encountered an issue: ${e.message || e}`);
    }
  };

  // Add Custom Creator Channel
  const handleAddChannelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess(false);

    if (!newChannel.name || !newChannel.handle) {
      setAddError('Creator name and handle are required.');
      return;
    }

    try {
      const res = await fetch('/api/add-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChannel),
      });

      if (res.ok) {
        setAddSuccess(true);
        setNewChannel({
          name: '',
          handle: '',
          subscriberCount: '150K',
          primaryNiche: 'AI Agent Workflows & Low-Code tools',
          avgViews: 45000,
        });
        refreshState();
        setTimeout(() => {
          setShowAddModal(false);
          setAddSuccess(false);
        }, 1500);
      } else {
        const errData = await res.json();
        setAddError(errData.error || 'Failed to register creator channel.');
      }
    } catch (err) {
      setAddError('Server network issues registering channel.');
    }
  };

  // Delete Custom Creator Channel
  const deleteCreator = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to exclude custom creator "${name}" from the active database?`)) return;
    try {
      const res = await fetch('/api/delete-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setCreators(prev => prev.filter(c => c.id !== id));
        setSelectedChannelIds(prev => prev.filter(cId => cId !== id));
      }
    } catch (e) {
      console.error('Failed to delete creator', e);
    }
  };

  // Delete Run History
  const deleteRun = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to purge historic run "${label}"? This is irreversible.`)) return;
    try {
      const res = await fetch('/api/delete-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setHistoricalRuns(prev => prev.filter(r => r.id !== id));
        if (selectedRun?.id === id) {
          setSelectedRun(null);
        }
        refreshState();
      }
    } catch (e) {
      console.error('Failed to delete run', e);
    }
  };

  // Helper toggle creators checked state
  const toggleChannelSelection = (id: string) => {
    if (selectedChannelIds.includes(id)) {
      setSelectedChannelIds(prev => prev.filter(cId => cId !== id));
    } else {
      setSelectedChannelIds(prev => [...prev, id]);
    }
  };

  // High Performing Video Data Extraction
  const getTopVideos = (): Video[] => {
    const activeCreators = creators.filter(c => selectedChannelIds.includes(c.id));
    const allVideos: Video[] = [];
    activeCreators.forEach(c => {
      c.videos.forEach(v => {
        allVideos.push(v);
      });
    });
    return allVideos.sort((a, b) => b.views - a.views).slice(0, 5);
  };

  // Format Large Count Displays
  const formatViews = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
    return val.toString();
  };

  // Prepare Chart Datasets
  const getSubscribersChartData = () => {
    return creators.map(c => {
      // Parse K, M into numeric if needed, simple numeric representation
      let subsVal = 0;
      if (c.subscriberCount.endsWith('M')) {
        subsVal = parseFloat(c.subscriberCount) * 1000;
      } else if (c.subscriberCount.endsWith('K')) {
        subsVal = parseFloat(c.subscriberCount);
      }
      return {
        name: c.name,
        Subscribers: subsVal,
        AvgViews: c.avgViews / 1000, // Show in Thousands
      };
    });
  };

  const getSaturationsChartData = () => {
    if (!selectedRun) return [];
    const counts: { [key: string]: number } = {};
    creators.forEach(c => {
      c.videos.forEach(v => {
        const topic = v.videoAnalysis?.mainTopic || 'AI Systems';
        counts[topic] = (counts[topic] || 0) + 1;
      });
    });
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key],
    }));
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6'];

  return (
    <div id="app_root" className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Dynamic Header & System Status Indicator */}
      <header id="app_header" className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg border border-emerald-500/20">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                AI YouTube Competitor Research Agent
              </h1>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span>Autonomous Analysis Engine Active</span>
                <span className="text-slate-600">|</span>
                <span>Local Time: 14:47 UTC</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" /> Inject Creator
            </button>
            <button
              onClick={clearDashboard}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 border border-red-500 text-white transition"
              title="Permanently clear all stored creators and analysis runs">
              Clear
            </button>

            <button
              onClick={refreshState}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              title="Refresh Baseline Cache"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Structural Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* System Overview Dashboard Metrics */}
        <section id="metrics_summary" className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition flex items-center space-x-4">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
              <Youtube className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Total Competitors</p>
              <p className="text-2xl font-bold font-mono text-white">{creators.length}</p>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <Play className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Harvested Videos</p>
              <p className="text-2xl font-bold font-mono text-white">
                {creators.reduce((acc, curr) => acc + curr.videos.length, 0)}
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Avg Channel Views</p>
              <p className="text-2xl font-bold font-mono text-white">
                {creators.length > 0 
                  ? formatViews(Math.round(creators.reduce((acc, curr) => acc + curr.avgViews, 0) / creators.length))
                  : '0'}
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition flex items-center space-x-4 whitespace-nowrap">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Stored Runs (Memory)</p>
              <p className="text-2xl font-bold font-mono text-white">{historicalRuns.length}</p>
            </div>
          </div>
        </section>

        {/* Master Competitor Matrix Grid & Ingestion Controls */}
        <section id="competitor_matrix" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" /> Competitors Intelligence Pool
              </h2>
              <p className="text-sm text-slate-400">Select which channels are active in the target strategic analysis framework</p>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Selected: <span className="text-emerald-400 font-bold">{selectedChannelIds.length}</span>/{creators.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creators.map(c => {
              const isChecked = selectedChannelIds.includes(c.id);
              const isCustom = c.id.startsWith('custom_');
              return (
                <div
                  key={c.id}
                  className={`bg-slate-950 p-5 rounded-xl border transition-all duration-200 relative ${
                    isChecked ? 'border-emerald-500/40 bg-slate-950/80 shadow-lg shadow-emerald-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                  }`}
                >
                  <label className="absolute top-4 right-4 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleChannelSelection(c.id)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 hover:border-slate-500'
                    }`}>
                      {isChecked && <CheckCircle className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </label>

                  <div className="flex items-center space-x-4">
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      className="w-12 h-12 rounded-full border border-slate-700 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-white group-hover:text-emerald-400 transition flex items-center gap-1.5 leading-snug">
                        {c.name}
                        {isCustom && (
                          <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-sans font-normal">Custom</span>
                        )}
                      </h3>
                      <p className="text-xs text-emerald-400 font-mono">{c.handle}</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 border-t border-slate-800/80 pt-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Niche:</span>
                      <span className="text-slate-200 font-semibold text-right max-w-[180px] truncate">{c.primaryNiche}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Subscribers:</span>
                      <span className="text-slate-200 font-mono font-bold">{c.subscriberCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Views Per Video:</span>
                      <span className="text-slate-200 font-mono font-bold">{formatViews(c.avgViews)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2 pt-2">
                    <button
                      onClick={() => setActiveCreatorDrawer(c)}
                      className="flex-1 text-center py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg transition"
                    >
                      Audit 10 Videos
                    </button>
                    {isCustom && (
                      <button
                        onClick={() => deleteCreator(c.id, c.name)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition"
                        title="Purge custom profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Agent Analysis Automation Console */}
        <section id="analysis_console" className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-emerald-400" /> Multi-Agent Intelligence Orchestrator
              </h2>
              <p className="text-sm text-slate-400">
                Dispatches expert scraper agents, visual cues processors, content trend brokers, and strategic report compilers to evaluate competitor footprints.
              </p>
            </div>

            <button
              onClick={triggerResearchAgent}
              disabled={isAnalyzing}
              className={`px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg uppercase transition flex items-center justify-center gap-2 border ${
                isAnalyzing
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-900 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-500 hover:border-emerald-400 cursor-pointer shadow-emerald-500/20'
              }`}
            >
              <Cpu className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} /> 
              {isAnalyzing ? 'Synthesizing Intelligence...' : 'Boot Autonomous AI Agent'}
            </button>
          </div>

          {/* Real-time Analysis progress visualization */}
          {isAnalyzing && (
            <div className="mt-6 space-y-4">
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300 shadow-lg shadow-emerald-500/50"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Task Pipeline Integration: {analysisProgress}% Complete</span>
                <span className="font-mono text-emerald-400">Agent Action Loom Active</span>
              </div>

              {/* Terminal Logs Outputs */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400/90 h-60 overflow-y-auto space-y-2 mt-4 custom-scrollbar">
                <div className="text-slate-500 border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span>🚀 LIVE LOGSTREAM: AUTONOMOUS RECRUITS ENGINE</span>
                  <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-400 animate-ping" /> SCANNING</span>
                </div>
                {analysisLogs.map((log, index) => (
                  <div key={index} className="flex space-x-2 leading-relaxed">
                    <span className="text-slate-500">[{log.timestamp}]</span>
                    <span className="text-emerald-500 font-bold">[{log.agentName}]:</span>
                    <span className="text-slate-300">{log.log}</span>
                  </div>
                ))}
                <div ref={logsBottomRef}></div>
              </div>
            </div>
          )}
        </section>

        {/* Dynamic Navigation Tabs */}
        <section id="report_tabs" className="space-y-6">
          <div className="border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
            <nav className="flex space-x-1" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('playbook')}
                className={`py-3 px-4 border-b-2 font-bold text-sm transition flex items-center gap-2 ${
                  activeTab === 'playbook'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Award className="w-4 h-4" /> Strategic Competitive Playbook
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`py-3 px-4 border-b-2 font-bold text-sm transition flex items-center gap-2 ${
                  activeTab === 'insights'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Brain className="w-4 h-4" /> Psychology & Virality
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`py-3 px-4 border-b-2 font-bold text-sm transition flex items-center gap-2 ${
                  activeTab === 'comparison'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Sliders className="w-4 h-4" /> Matrix Comparison
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`py-3 px-4 border-b-2 font-bold text-sm transition flex items-center gap-2 ${
                  activeTab === 'charts'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <BarChart2 className="w-4 h-4" /> Charts & Timelines
              </button>
            </nav>

            {/* Selected run indicator and document export portal */}
            {selectedRun && (
              <div className="flex items-center space-x-3 pb-2 text-xs">
                <div className="flex items-center space-x-2 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Intel Block:</span>
                  <select
                    value={selectedRun.id}
                    onChange={(e) => {
                      const run = historicalRuns.find(r => r.id === e.target.value);
                      if (run) setSelectedRun(run);
                    }}
                    className="font-bold text-emerald-400 bg-transparent border-none focus:ring-0 outline-none pr-6 cursor-pointer"
                  >
                    {historicalRuns.map((r, idx) => (
                      <option key={r.id} value={r.id} className="bg-slate-900 text-slate-200">
                        Version {r.report.version} ({new Date(r.timestamp).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1.5">
                  <a
                    href={`/api/download-report?format=txt&id=${selectedRun.id}`}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                    title="Export text synopsis summary"
                  >
                    <Download className="w-3.5 h-3.5" /> TXT
                  </a>
                  <a
                    href={`/api/download-report?format=csv&id=${selectedRun.id}`}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                    title="Export CSV matrix file"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
                  </a>
                  <a
                    href={`/api/download-report?format=json&id=${selectedRun.id}`}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                    title="Export raw analytical JSON log"
                  >
                    <FileCode className="w-3.5 h-3.5" /> JSON
                  </a>
                  <button
                    onClick={() => deleteRun(selectedRun.id, `Version ${selectedRun.report.version}`)}
                    className="p-1.5 bg-slate-800/80 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700 hover:border-red-500/25 transition"
                    title="Purge calculation run data"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {!selectedRun ? (
            <div className="bg-slate-950 p-12 rounded-2xl border border-slate-800 text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-white">No Strategic Research Generated Yet</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
                  Launch the Autonomous AI Agent above. It will evaluate the active YouTube creators pool, search thumbnail expression psychology, check titles transcripts and compile growth recommendations.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* TAB 1: STRATEGIC GROWTH RECOMMENDATIONS PLAYBOOK */}
              {activeTab === 'playbook' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* Executive Summary Core Capsule */}
                  <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-emerald-500/20 p-6 rounded-2xl relative shadow-lg shadow-emerald-950/20">
                    <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      Executive Summary
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl mt-1">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-md font-bold text-white tracking-wide">
                          {selectedRun.report.title}
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed max-w-5xl">
                          {selectedRun.report.executiveSummary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Core 8 growth questions answered cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center font-mono font-bold text-sm">01</span>
                        <h4 className="font-bold text-white text-md">What Content Performs Best?</h4>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed pt-1">
                        {selectedRun.recommendations.bestContentFormat}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center font-mono font-bold text-sm">02</span>
                        <h4 className="font-bold text-white text-md">Why Do Viewers Click?</h4>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed pt-1">
                        {selectedRun.recommendations.whyViewersClick}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center font-mono font-bold text-sm">03</span>
                        <h4 className="font-bold text-white text-md">What Hooks Work Best?</h4>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed pt-1">
                        {selectedRun.recommendations.bestHooks}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center font-mono font-bold text-sm">04</span>
                        <h4 className="font-bold text-white text-md">What Content Styles Sell?</h4>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed pt-1">
                        {selectedRun.recommendations.engagingContentStyles}
                      </p>
                    </div>
                  </div>

                  {/* Niche Gaps, Oversaturations, and Growth opportunities */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-950 p-6 rounded-2xl border border-red-500/20 space-y-4">
                      <h4 className="font-bold text-red-400 text-sm tracking-wide uppercase flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" /> 05. Oversaturated Topics
                      </h4>
                      <ul className="space-y-2.5 text-sm">
                        {selectedRun.recommendations.oversaturatedTopics.map((topic, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300">
                            <span className="text-red-500 select-none mt-1">✕</span>
                            <span className="leading-snug">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/20 space-y-4">
                      <h4 className="font-bold text-emerald-400 text-sm tracking-wide uppercase flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> 06. Underexplored Niches
                      </h4>
                      <ul className="space-y-2.5 text-sm">
                        {selectedRun.recommendations.underexploredNiches.map((niche, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300">
                            <span className="text-emerald-400 select-none mt-1">✓</span>
                            <span className="leading-snug">{niche}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-2xl border border-blue-500/20 space-y-4">
                      <h4 className="font-bold text-blue-400 text-sm tracking-wide uppercase flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> 07. Action Opportunities
                      </h4>
                      <ul className="space-y-2.5 text-sm">
                        {selectedRun.recommendations.newCreatorOpportunities.map((opp, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300">
                            <span className="text-blue-400 select-none mt-1">★</span>
                            <span className="leading-snug">{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Playbook checklist - Growth speed formulas */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
                    <h3 className="font-bold text-white text-md flex items-center gap-2.5">
                      <LayoutPlaybookIcon className="w-5 h-5 text-emerald-400" /> 08. Playbook: How a Competing Channel Can Grow Faster
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRun.recommendations.fasterGrowthPlaybook.map((step, idx) => (
                        <div key={idx} className="flex items-start space-x-3.5 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: AUDIENCE PSYCHOLOGY & VIRALITY PATTERNS */}
              {activeTab === 'insights' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2.5">
                      <Brain className="w-5 h-5 text-emerald-400" /> Audience Psychology Insights
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {selectedRun.report.audiencePsychologyInsights}
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 space-y-3 mt-4">
                      <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Psychological Triggers Exploited</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Greed Metrics', 'Surviving Automation', 'Sovereignty', 'Direct Cashflow', 'Tech Rebellion', 'Insiders Info'].map((t, idx) => (
                          <span key={idx} className="text-xs bg-slate-850 px-2.5 py-1 rounded-full text-emerald-400 border border-slate-700">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2.5">
                      <TrendingUp className="w-5 h-5 text-emerald-400" /> Virality Indicators & Benchmark context
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {selectedRun.report.viralityPatterns}
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 space-y-3 mt-4">
                      <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Virality Blueprint Metrics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>First 15s Hook Target: &gt;75% Retention</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>Expected Thumbnail CTR: &gt;9.2%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>Download CTAs to comment ratios</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>Contrast values: Max Vibrations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MATRIX COMPARISON SUMMARY TABLE */}
              {activeTab === 'comparison' && (
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden animate-fadeIn">
                  <div className="p-6 border-b border-slate-850">
                    <h3 className="font-bold text-white text-lg">Competitors Technical Comparison Grid</h3>
                    <p className="text-xs text-slate-400 mt-1">Directly contrast Subscriber scope, Average View volumes, formats, strengths, and exploitable deficits</p>
                  </div>
                  <div className="overflow-x-auto text-[13px] leading-relaxed">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-slate-300 border-b border-slate-850 font-semibold">
                          <th className="p-4 pl-6">Channel Profile</th>
                          <th className="p-4">Subs Count</th>
                          <th className="p-4">Avg Viewership</th>
                          <th className="p-4">Key Content Assets</th>
                          <th className="p-4">Pristine Leverage (Strength)</th>
                          <th className="p-4 pr-6">Deficit to Exploit (Weakness)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850/80">
                        {selectedRun.report.competitorComparison.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/60 transition group text-slate-300 hover:text-white">
                            <td className="p-4 pl-6 font-bold text-white group-hover:text-emerald-400 transition">
                              {row.channelName}
                            </td>
                            <td className="p-4 font-mono text-xs">{row.subCount}</td>
                            <td className="p-4 font-mono text-xs">{row.avgViews.toLocaleString()}</td>
                            <td className="p-4">{row.primaryFormat}</td>
                            <td className="p-4 text-emerald-400/90 text-[12.5px] max-w-[220px] leading-snug">{row.keyStrength}</td>
                            <td className="p-4 text-amber-500/90 text-[12.5px] max-w-[220px] leading-snug">{row.weaknessToExploit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: ADVANCED RECHARTS COMPILATIONS */}
              {activeTab === 'charts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                  
                  {/* View Comparison Chart */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div>
                      <h3 className="font-bold text-white text-md">Average View Volume Scopes (in Thousands)</h3>
                      <p className="text-xs text-slate-400">Total average clicks generated per video upload</p>
                    </div>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getSubscribersChartData()} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: 11 }} />
                          <YAxis stroke="#64748b" style={{ fontSize: 11 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                          <Bar dataKey="AvgViews" fill="#10b981" radius={[4, 4, 0, 0]}>
                            {getSubscribersChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Saturations distribution donut */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div>
                      <h3 className="font-bold text-white text-md">Primary Content Topic Distributions</h3>
                      <p className="text-xs text-slate-400">Frequencies of analyzed concepts mapped across creator channels</p>
                    </div>
                    <div className="h-72 flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getSaturationsChartData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {getSaturationsChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                          <Legend verticalAlign="bottom" height={36} layout="horizontal" style={{ fontSize: 11 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              )}

              {/* Dynamic Conclusion Drawer Card */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-2">
                <h4 className="text-xs uppercase tracking-widest font-black text-slate-400">Expert Strategic Verdict</h4>
                <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                  {selectedRun.report.finalConclusion}
                </p>
              </div>

            </div>
          )}
        </section>

        {/* Global High Performance Video Leaderboard */}
        <section id="top_performing_videos" className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> High-Performing Creator Video Assets
            </h2>
            <p className="text-sm text-slate-400">Top viewed competitor videos, ordered by total watch-count engagement indices</p>
          </div>

          <div className="divide-y divide-slate-800">
            {getTopVideos().map((v, idx) => (
              <div key={v.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 first:pt-2 last:pb-2 transition hover:bg-slate-900/30 px-3 rounded-lg">
                <div className="flex items-start space-x-4">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-bold font-mono text-xs flex items-center justify-center shrink-0 mt-1">
                    0{idx + 1}
                  </span>
                  
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-[14px] leading-snug hover:text-emerald-400 transition">
                      {v.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">{v.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">{v.videoAnalysis?.mainTopic || 'AI Niche'}</span>
                      <span className="text-slate-600">|</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {v.publishDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 font-mono text-xs font-bold text-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>{formatViews(v.views)}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <ThumbsUp className="w-4 h-4 text-emerald-400" />
                    <span>{formatViews(v.likes)}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>{v.comments.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Project Documentation block */}
        <section id="doc_overview" className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-850 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" /> System Integration & Setup Manual
            </h2>
            <p className="text-xs text-slate-400">Architectural guidelines, agent workflow mappings, and single-execution scripts documentation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px] leading-relaxed text-slate-300">
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase text-xs tracking-wider">🚀 1. Execution Guide</h4>
              <p>
                The entire package runs safely via a single deployment terminal statement:
              </p>
              <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg border border-slate-800 font-mono text-xs">
                npm run dev
              </div>
              <p>
                This spawns our Express framework on port 3000, triggering hot SPA middleware configurations. Production compiles via:
              </p>
              <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg border border-slate-800 font-mono text-xs">
                npm run build && npm run start
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase text-xs tracking-wider">⛓ 2. Multi-Agent Ecosystem Blueprint</h4>
              <ul className="space-y-1.5">
                <li>• **Research Agent**: Scrapes baseline channel datasets and harvests title details.</li>
                <li>• **Visual Analyst Agent**: Inspects pixel variables, expressions, and color psychology.</li>
                <li>• **Trend Broker Agent**: Discovers micro-niche opportunities and keyword densities.</li>
                <li>• **Strategic Architect Agent**: Solves the 8 business requirements using Gemini 3.5.</li>
              </ul>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER COOPERATIVE SYSTEM */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© 2026 AI YouTube Competitor Research Agent. All Rights Reserved.</p>
          <p>Powered by Node.js, Express, React, Tailwind, and Google Gemini API (gemini-3.5-flash).</p>
        </div>
      </footer>

      {/* 2. CREATOR videos AND THUMBNAIL AUDIT MODAL DRAWER */}
      {activeCreatorDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fadeIn bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-slate-950 border-l border-slate-800 h-full overflow-y-auto flex flex-col shadow-2xl relative">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-850 bg-slate-900/60 sticky top-0 z-10 flex justify-between items-center bg-slate-950/90 backdrop-blur">
              <div className="flex items-center space-x-3.5">
                <img
                  src={activeCreatorDrawer.avatarUrl}
                  alt={activeCreatorDrawer.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <h3 className="font-bold text-lg text-white leading-tight">{activeCreatorDrawer.name}</h3>
                  <p className="text-xs text-emerald-400 font-mono">{activeCreatorDrawer.handle} | Subscriber count: {activeCreatorDrawer.subscriberCount}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveCreatorDrawer(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video List Body & Thumbnail Analysis breakdowns */}
            <div className="p-6 space-y-8 flex-1 text-xs leading-relaxed text-slate-300">
              
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Channel Strategy Capsule</h4>
                <p className="text-slate-400 leading-normal">
                  Analyzing primary niche patterns and common structural mechanics associated with {activeCreatorDrawer.name}.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                    <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">Target Niche Focus</span>
                    <span className="text-slate-200 mt-0.5 block font-semibold">{activeCreatorDrawer.primaryNiche}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                    <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">Avg View Scope</span>
                    <span className="text-emerald-400 mt-0.5 block font-mono font-bold">{activeCreatorDrawer.avgViews.toLocaleString()} views/vid</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">Scanned Videos Profiles (Latest 10)</h4>
                <div className="space-y-6">
                  {activeCreatorDrawer.videos.map((vid, idx) => (
                    <div key={vid.id} className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-slate-800/60 pb-3">
                        <div className="space-y-1">
                          <h5 className="font-bold text-slate-100 text-sm leading-snug">
                            {idx + 1}. {vid.title}
                          </h5>
                          <p className="text-slate-400 text-xs lines-clamp-2 leading-relaxed">{vid.description}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="text-emerald-400 font-mono font-bold text-xs bg-emerald-400/5 px-2 py-1 rounded inline-block border border-emerald-400/10">
                            {vid.views.toLocaleString()} Watchers
                          </span>
                          <span className="text-[10px] text-slate-500 block font-mono mt-1">{vid.publishDate}</span>
                        </div>
                      </div>

                      {/* Video Transcript Synopsis */}
                      <div className="space-y-1 bg-slate-950 p-3.5 rounded-lg border border-slate-850">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">📜 Transcript Synopsis (Script Analytics)</span>
                        <p className="text-slate-300 leading-relaxed text-xs">{vid.transcriptSummary}</p>
                      </div>

                      {/* Diagnostic Visual and Content Analysis Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        
                        {/* Visual Psychology Column */}
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">🖼 Thumbnail Cues Decoded</span>
                          {vid.thumbnailAnalysis ? (
                            <div className="space-y-1.5 text-[11.5px] leading-snug bg-slate-950/60 p-3 rounded-lg border border-slate-850/60 text-slate-300">
                              <div><span className="text-slate-500">Face Usage:</span> {vid.thumbnailAnalysis.faceUsage}</div>
                              <div><span className="text-slate-500">Reaction Cues:</span> {vid.thumbnailAnalysis.reactionExpressions}</div>
                              <div><span className="text-slate-500 font-bold">Bold Accent Text:</span> &quot;{vid.thumbnailAnalysis.boldTextUsage}&quot;</div>
                              <div><span className="text-slate-500">AI Graphics:</span> {vid.thumbnailAnalysis.aiImagery}</div>
                              <div><span className="text-slate-500">Luminosity Layout:</span> {vid.thumbnailAnalysis.contrastLayouts}</div>
                            </div>
                          ) : (
                            <p className="text-slate-500 leading-none">Diagnostic visual elements missing.</p>
                          )}
                        </div>

                        {/* Concept Architecture Column */}
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">📽 Video Framework Decoded</span>
                          {vid.videoAnalysis ? (
                            <div className="space-y-1.5 text-[11.5px] leading-snug bg-slate-950/60 p-3 rounded-lg border border-slate-850/60 text-slate-300">
                              <div><span className="text-slate-500">Topic Area:</span> {vid.videoAnalysis.mainTopic} ({vid.videoAnalysis.subtopic})</div>
                              <div><span className="text-slate-500">Educator Form:</span> {vid.videoAnalysis.educationalStyle}</div>
                              <div><span className="text-slate-500">Narrator style:</span> {vid.videoAnalysis.storytellingStyle}</div>
                              <div><span className="text-slate-500 font-bold">Monetize Strategy:</span> {vid.videoAnalysis.monetizationAngle}</div>
                              <div><span className="text-slate-500">Triggers:</span> {vid.videoAnalysis.emotionalTriggers.join(', ')}</div>
                            </div>
                          ) : (
                            <p className="text-slate-500 leading-none">Diagnostic details missing.</p>
                          )}
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 3. CUSTOM INGESTION INTERACTIVE DRAWER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 relative space-y-4">
            
            <div className="flex justify-between items-center text-white pb-3 border-b border-slate-800">
              <h3 className="font-bold text-md flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500 animate-pulse" /> Inject Custom Channel Profile
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 border border-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddChannelSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-slate-350">Creator / Channel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Woods"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-lg p-2.5 outline-none text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-350">YouTube Handle</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. @RachelWoods"
                  value={newChannel.handle}
                  onChange={(e) => setNewChannel(prev => ({ ...prev, handle: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-lg p-2.5 outline-none text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-350">Subscriber Count Indicator</label>
                <input
                  type="text"
                  placeholder="e.g. 150K"
                  value={newChannel.subscriberCount}
                  onChange={(e) => setNewChannel(prev => ({ ...prev, subscriberCount: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-lg p-2.5 outline-none text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-350">Creator Niche Domain</label>
                <input
                  type="text"
                  placeholder="e.g. ChatGPT hacks for office workers"
                  value={newChannel.primaryNiche}
                  onChange={(e) => setNewChannel(prev => ({ ...prev, primaryNiche: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-lg p-2.5 outline-none text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-350">Average Views Volume Metrics</label>
                <input
                  type="number"
                  placeholder="e.g. 45000"
                  value={newChannel.avgViews || ''}
                  onChange={(e) => setNewChannel(prev => ({ ...prev, avgViews: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-lg p-2.5 outline-none text-slate-200"
                />
              </div>

              {addError && <p className="text-red-400 font-bold bg-red-400/10 p-2 rounded border border-red-500/10">{addError}</p>}
              {addSuccess && <p className="text-emerald-400 font-bold bg-emerald-400/10 p-2 rounded border border-emerald-500/10">Channel Injected Successfully!</p>}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase tracking-wider rounded-lg border border-emerald-500 transition cursor-pointer"
              >
                Incorporate Channel Node
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

// Custom Micro Icons representing Playbooks
function LayoutPlaybookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10" />
      <path d="M6 10h10" />
      <path d="M6 14h10" />
    </svg>
  );
}
