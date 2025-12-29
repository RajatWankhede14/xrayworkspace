"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, ArrowLeft, Clock, Boxes, Activity, AlertCircle } from "lucide-react";

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

export default function TraceDetail() {
  const params = useParams();
  const [trace, setTrace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    
    fetch(`http://localhost:8080/api/traces/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setTrace(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (!trace) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Trace not found</div>;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Header Breadcrumb Style */}
      <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-3 min-h-[50px]">
         <div className="flex items-center gap-3 text-sm">
             <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                Traces
             </Link>
             <span className="text-muted-foreground/30">/</span>
             <h1 className="font-medium text-foreground">{trace.Name}</h1>
             <Badge className="bg-emerald-500/10 text-emerald-500 border-none hover:bg-emerald-500/10 h-5 px-1.5 text-[10px] uppercase font-bold tracking-wide">
                Completed
             </Badge>
         </div>
         <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
             <span>{trace.ID}</span>
             <span className="text-muted-foreground/30">|</span>
             <span>{new Date(trace.CreatedAt).toLocaleString()}</span>
         </div>
      </header>

      {/* Main Content split */}
      <div className="flex-1 overflow-hidden flex">
          {/* Main Timeline Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
             <div className="max-w-4xl mx-auto">
                <Tabs defaultValue="timeline">
                    <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 mb-8 space-x-6">
                        <TabsTrigger value="timeline" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-0 py-2 bg-transparent">Timeline</TabsTrigger>
                        <TabsTrigger value="json" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-0 py-2 bg-transparent">JSON</TabsTrigger>
                    </TabsList>

                    <TabsContent value="timeline" className="space-y-0 relative pl-2">
                        {/* Continuous Vertical Line */}
                        <div className="absolute left-[20px] top-2 bottom-6 w-px bg-border -z-10"></div>

                        {trace.Steps && trace.Steps.map((step: any, index: number) => (
                            <div key={step.ID} className="group relative pb-8 last:pb-0">
                                <div className="flex items-start gap-4">
                                    {/* Node Dot */}
                                    <div className="relative mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-sm z-10">
                                        <div className="text-xs font-medium text-muted-foreground">{index + 1}</div>
                                    </div>
                                    
                                    {/* Content Card */}
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="mb-2 flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-foreground tracking-tight">{step.Name}</h3>
                                            <span className="text-[10px] font-mono text-muted-foreground/50">{step.ID.split('-')[0]}</span>
                                        </div>

                                        {/* Minimal Details Box */}
                                        <div className="border border-border rounded-md bg-card/40 overflow-hidden">
                                            {/* Header/Reasoning */}
                                            {step.Reasoning && (
                                                <div className="p-3 border-b border-border bg-muted/10 text-xs text-muted-foreground leading-relaxed">
                                                    {step.Reasoning}
                                                </div>
                                            )}
                                            
                                            {/* Inputs/Outputs */}
                                            {(step.Inputs || step.Outputs) && (
                                                <div className="flex divide-x divide-border">
                                                    <div className="flex-1 p-0 min-w-0">
                                                        <div className="px-3 py-1.5 border-b border-border text-[10px] font-medium uppercase text-muted-foreground bg-muted/5">Inputs</div>
                                                        <div className="p-0">
                                                             {/* @ts-ignore */}
                                                            <ReactJson src={step.Inputs || {}} theme="monokai" style={{padding: '12px', backgroundColor: 'transparent', fontSize: '11px'}} name={false} displayDataTypes={false} collapsed={true} enableClipboard={false} />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 p-0 min-w-0">
                                                        <div className="px-3 py-1.5 border-b border-border text-[10px] font-medium uppercase text-muted-foreground bg-muted/5">Outputs</div>
                                                        <div className="p-0">
                                                             {/* @ts-ignore */}
                                                            <ReactJson src={step.Outputs || {}} theme="monokai" style={{padding: '12px', backgroundColor: 'transparent', fontSize: '11px'}} name={false} displayDataTypes={false} collapsed={true} enableClipboard={false} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Evals */}
                                            {step.Evaluations && step.Evaluations.length > 0 && (
                                                <div className="border-t border-border p-3 space-y-2">
                                                    <div className="text-[10px] font-medium uppercase text-muted-foreground">Evaluations</div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {step.Evaluations.map((evalItem: any) => (
                                                            <div key={evalItem.ID} className="rounded border border-border bg-background p-2">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-xs font-medium truncate">{evalItem.ReferenceName}</span>
                                                                    <div className={evalItem.Qualified ? "h-1.5 w-1.5 rounded-full bg-emerald-500" : "h-1.5 w-1.5 rounded-full bg-red-500"}></div>
                                                                </div>
                                                                {evalItem.Checks && (
                                                                    <div className="space-y-1">
                                                                        {evalItem.Checks.map((check: any) => (
                                                                            <div key={check.ID} className="flex gap-2 text-[10px] text-muted-foreground items-start">
                                                                                 {check.Passed ? (
                                                                                     <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                                                 ) : (
                                                                                     <XCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                                                                                 )}
                                                                                 <span className="leading-tight">{check.Key}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="json">
                        <div className="rounded-md border border-border bg-card p-4">
                            {/* @ts-ignore */}
                            <ReactJson src={trace} theme="brewer" style={{backgroundColor: 'transparent', fontSize: '12px'}} displayDataTypes={false} />
                        </div>
                    </TabsContent>
                </Tabs>
             </div>
          </div>
          
          {/* Metadata Sidebar (Optional right pane) - removed for cleaner single column view but kept structure if needed */}
      </div>
    </div>
  );
}
