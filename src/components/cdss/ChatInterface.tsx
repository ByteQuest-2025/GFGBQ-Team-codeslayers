import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, FileText, Activity, BookOpen, Share2, Printer, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { DiagnosisResult, PatientData } from '@/types/clinical';
import { chatWithCDSS, ChatMessage } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChatInterfaceProps {
    patientData: PatientData;
    diagnosisResult: DiagnosisResult;
}

export function ChatInterface({ patientData, diagnosisResult }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showGraph, setShowGraph] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mock data for the graph - in a real app this would come from the AI or patient data
    const vitalTrends = [
        { time: '08:00', heartRate: 72, temp: 98.6 },
        { time: '12:00', heartRate: 75, temp: 98.8 },
        { time: '16:00', heartRate: 78, temp: 99.1 },
        { time: '20:00', heartRate: 74, temp: 98.7 },
        { time: '24:00', heartRate: 70, temp: 98.4 },
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatWithCDSS(input, messages, patientData, diagnosisResult);
            // Ensure response is not empty
            const safeResponse = response || "I apologize, but I couldn't generate a response. Please try again.";
            setMessages(prev => [...prev, { role: 'model', content: safeResponse }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I encountered an error while processing your request. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const suggestedQuestions = [
        "Explain the treatment plan rationale",
        "What are the alternative diagnoses?",
        "Show related clinical guidelines",
        "Risk factors analysis"
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[800px] print:h-auto">
            {/* Main Chat Area */}
            <Card className="flex-1 flex flex-col shadow-xl border-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10">
                <CardHeader className="border-b px-6 py-4 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-opacity-60">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600/10 rounded-xl">
                                <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Clinical Assistant
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    AI-Powered Medical Decision Support
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                                onClick={() => setShowGraph(!showGraph)}
                                title={showGraph ? "Hide Trends" : "Show Vital Trends"}
                            >
                                <Activity className={`h-4 w-4 ${showGraph ? "text-blue-600" : "text-slate-500"}`} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                                onClick={handlePrint}
                                title="Export/Print"
                            >
                                <Printer className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 p-0 flex flex-col min-h-0 relative">
                    {/* Graph Overlay (Optional Interactive Element) */}
                    {showGraph && (
                        <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 dark:bg-slate-950/95 p-4 border-b animate-in slide-in-from-top-4 shadow-sm">
                            <div className="h-[200px] w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Vitals Trend</p>
                                    <Button variant="ghost" size="sm" onClick={() => setShowGraph(false)} className="h-6 text-xs text-muted-foreground">Close</Button>
                                </div>
                                <ResponsiveContainer width="100%" height="80%">
                                    <BarChart data={vitalTrends}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ fill: 'transparent' }}
                                        />
                                        <Bar dataKey="heartRate" name="Heart Rate" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    <ScrollArea className="flex-1 px-4 py-6">
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {messages.length === 0 && (
                                <div className="text-center py-12 px-4 transition-all duration-500 ease-in-out">
                                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="h-8 w-8 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">How can I help you today?</h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
                                        Ask about diagnosis details, treatment options, or request appropriate citations for the findings.
                                    </p>
                                </div>
                            )}

                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex gap-4 animate-in slide-in-from-bottom-2 duration-300",
                                        message.role === 'user' ? "flex-row-reverse" : ""
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium shadow-sm ring-1 ring-inset",
                                            message.role === 'user'
                                                ? "bg-blue-600 text-white ring-blue-600"
                                                : "bg-white dark:bg-slate-800 text-blue-600 ring-slate-200 dark:ring-slate-700"
                                        )}
                                    >
                                        {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-5 w-5" />}
                                    </div>
                                    <div
                                        className={cn(
                                            "flex-1 px-5 py-3.5 rounded-2xl text-sm sm:text-base shadow-sm leading-relaxed max-w-[85%]",
                                            message.role === 'user'
                                                ? "bg-blue-600 text-white rounded-tr-sm"
                                                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-700"
                                        )}
                                    >
                                        {message.role === 'user' ? (
                                            message.content
                                        ) : (
                                            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:mb-3 prose-headings:mt-4 prose-strong:text-blue-600 dark:prose-strong:text-blue-400 prose-ul:my-2 prose-li:my-0.5">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-4 animate-pulse">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <Bot className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-sm flex items-center gap-2">
                                        <span className="text-xs text-slate-400 font-medium">Analyzing...</span>
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-20">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex gap-3 max-w-3xl mx-auto"
                        >
                            <Input
                                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 pl-4 py-6 shadow-sm transition-all text-base"
                                placeholder="Type your follow-up question..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 shrink-0 transition-all hover:scale-105 active:scale-95"
                                disabled={isLoading || !input.trim()}
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>

            {/* Sidebar / Citaions Panel */}
            <div className="w-full lg:w-[320px] shrink-0 space-y-4 print:hidden">
                <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm overflow-hidden h-full flex flex-col ring-1 ring-slate-900/5 dark:ring-white/10">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 pb-4 pt-5">
                        <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <BookOpen className="h-3.5 w-3.5" />
                            Clinical Context
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1 overflow-y-auto px-4 py-4">
                        {/* Suggested Questions */}
                        <div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-2">
                                <Sparkles className="h-3 w-3 text-amber-500" />
                                Suggested Queries
                            </h4>
                            <div className="space-y-2">
                                {suggestedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(q)}
                                        className="w-full text-left text-xs p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:border-blue-800 transition-all group flex items-center justify-between shadow-sm"
                                    >
                                        <span className="line-clamp-2 text-slate-600 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">{q}</span>
                                        <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Citations/References (Mocked) */}
                        <div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-2">
                                <FileText className="h-3 w-3 text-blue-500" />
                                Relevant Guidelines
                            </h4>
                            <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-start gap-2 mb-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">Infectious Disease Society of America (IDSA)</p>
                                    </div>
                                    <p className="text-[10px] text-slate-500 pl-3.5">2024 Guidelines for Antimicrobial Stewardship</p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-start gap-2 mb-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">WHO Diagnostic Standards</p>
                                    </div>
                                    <p className="text-[10px] text-slate-500 pl-3.5">Laboratory Safety Manual, 4th Edition</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                            <Button variant="outline" className="w-full h-9 text-xs justify-start gap-2 text-slate-600 dark:text-slate-300" onClick={handlePrint}>
                                <Share2 className="h-3.5 w-3.5" />
                                Export Consultation Record
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
