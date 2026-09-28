import React, { useState, useEffect } from 'react';
import { 
  Send, ChefHat, Utensils, MessageSquareWarning, Smile, Meh, Frown, Lightbulb, RefreshCw, Filter, Inbox, SearchX
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

// Types
type Category = 'food' | 'service' | 'hygiene' | 'ambiance' | 'price' | 'other';
type Sentiment = 'positive' | 'neutral' | 'negative';

interface Feedback {
  id: string;
  originalText: string;
  timestamp: number;
  analyzed: boolean;
  category?: Category;
  sentiment?: Sentiment;
  summary?: string;
  suggestion?: string | null;
}

export default function App() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const API_URL = 'http://localhost:3001/api/feedbacks';

  useEffect(() => {
    fetchFeedbacks();
    
    // Poll for new feedbacks every 5 seconds from the friend's website!
    const interval = setInterval(fetchFeedbacks, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch from API');
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the local server. Make sure the backend is running.');
    }
  };

  const analyzeAllPending = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/api/analyze-pending', {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to analyze pending feedbacks');
      
      // Re-fetch feedbacks to get the updated analysis
      await fetchFeedbacks();
    } catch (e: any) {
      console.error(e);
      setError('Failed to analyze feedbacks. Is the backend running?');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentIcon = (sentiment?: Sentiment) => {
    if (!sentiment) return null;
    switch (sentiment) {
      case 'positive': return <Smile className="text-emerald-500" size={24} />;
      case 'neutral': return <Meh className="text-amber-500" size={24} />;
      case 'negative': return <Frown className="text-rose-500" size={24} />;
    }
  };

  const getCategoryColor = (cat?: Category) => {
    switch (cat) {
      case 'food': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'service': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'hygiene': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'ambiance': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'price': return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const analyzedFeedbacks = feedbacks.filter(f => f.analyzed);
  const unanalyzedCount = feedbacks.filter(f => !f.analyzed).length;
  
  const displayFeedbacks = analyzedFeedbacks
    .filter(f => filterCategory === 'all' || f.category === filterCategory)
    .sort((a, b) => sortBy === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8">
        
        {/* Header */}
        <header className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="bg-indigo-500/10 p-4 rounded-2xl mb-6 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
            <ChefHat size={56} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Canteen <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Analyzer</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Automatically processing feedback from your local portal into actionable management insights.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          
          {/* Sidebar */}
          <aside className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-md text-rose-400 text-sm">
                {error}
              </div>
            )}

            {/* Inbox / Pending Status */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2">
                    <Inbox size={20} className="text-indigo-400" />
                    Incoming Queue
                  </span>
                  <Badge variant={unanalyzedCount > 0 ? 'default' : 'secondary'} className={unanalyzedCount > 0 ? "bg-indigo-500 hover:bg-indigo-600" : "bg-slate-800 text-slate-400 hover:bg-slate-800"}>
                    {unanalyzedCount} Pending
                  </Badge>
                </CardTitle>
                <CardDescription className="text-slate-400">Raw feedbacks collected from the external website.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={analyzeAllPending} 
                  disabled={isAnalyzing || unanalyzedCount === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 text-white"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw size={16} className="animate-spin" /> Analyzing via Gemini...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={16} /> Process Pending ({unanalyzedCount})
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            {analyzedFeedbacks.length > 0 && (
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Utensils size={20} className="text-indigo-400" />
                    Global Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Total Analyzed</span>
                    <span className="font-semibold text-lg">{analyzedFeedbacks.length}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-emerald-400">Positive</span>
                    <span className="font-semibold">{analyzedFeedbacks.filter(f => f.sentiment === 'positive').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-rose-400">Negative</span>
                    <span className="font-semibold">{analyzedFeedbacks.filter(f => f.sentiment === 'negative').length}</span>
                  </div>
                </CardContent>
              </Card>
            )}

          </aside>

          {/* Main Feedbacks Area */}
          <main className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageSquareWarning size={24} className="text-indigo-400" />
                Analyzed Feedbacks
              </h2>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val as any)}>
                  <SelectTrigger className="w-[160px] bg-slate-950 border-slate-800 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Filter size={14} className="text-slate-400" />
                      <SelectValue placeholder="Category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="hygiene">Hygiene</SelectItem>
                    <SelectItem value="ambiance">Ambiance</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
                  <SelectTrigger className="w-[140px] bg-slate-950 border-slate-800 text-slate-300">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* List */}
            <ScrollArea className="h-[700px] rounded-xl border border-slate-800 bg-slate-900/20 p-4">
              <div className="flex flex-col gap-4 pr-4">
                {displayFeedbacks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                    <SearchX size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm text-slate-600">Process incoming feedbacks or adjust your filters.</p>
                  </div>
                ) : (
                  displayFeedbacks.map((item) => (
                    <Card key={item.id} className="bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-colors backdrop-blur-sm group">
                      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={`uppercase tracking-wider ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-full border border-slate-800 shadow-sm" title={`Sentiment: ${item.sentiment}`}>
                          {getSentimentIcon(item.sentiment)}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <p className="text-slate-300 text-lg mb-4 italic leading-relaxed">"{item.originalText}"</p>
                        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50 mb-4">
                          <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider mb-1 block">Summary</span>
                          <span className="text-slate-300">{item.summary}</span>
                        </div>
                        {item.suggestion && (
                          <div className="bg-indigo-500/5 p-4 rounded-lg border-l-4 border-indigo-500 relative overflow-hidden group-hover:bg-indigo-500/10 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                              <Lightbulb size={64} />
                            </div>
                            <h4 className="text-indigo-400 font-semibold flex items-center gap-2 mb-1 text-sm">
                              <Lightbulb size={16} /> AI Suggestion
                            </h4>
                            <p className="text-slate-300 leading-relaxed text-sm relative z-10">{item.suggestion}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>

          </main>
        </div>
      </div>
    </div>
  );
}
