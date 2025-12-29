"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Trace {
  ID: string;
  Steps: any[];
  Name: string; // Added Name property
  CreatedAt: string; // Added CreatedAt property
}

export default function Home() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/traces')
      .then((res) => res.json())
      .then((data) => {
        setTraces(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-full flex flex-col">
       {/* Top Bar */}
       <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-3 min-h-[50px]">
          <div className="flex items-center gap-2">
             <h1 className="text-sm font-medium text-foreground">Recent Traces</h1>
             <span className="text-muted-foreground/50">/</span>
             <span className="text-xs text-muted-foreground font-mono">{traces.length} executions</span>
          </div>
          {/* Controls placeholder */}
          <div className="flex items-center gap-2">
          </div>
       </header>

       {/* Main Content Area */}
       <div className="flex-1 p-0">
          {loading ? (
            <div className="flex justify-center mt-24">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="w-full">
              <Table className="table-fixed">
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="w-[140px] pl-6 h-9 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Status</TableHead>
                    <TableHead className="h-9 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground w-auto">Workflow Name</TableHead>
                    <TableHead className="h-9 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground w-[120px]">Trace ID</TableHead>
                    <TableHead className="h-9 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-right pr-6 w-[180px]">Start Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-sm font-sans">
                  {traces.length === 0 ? (
                      <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center text-muted-foreground text-xs">
                              No traces found. Run the demo app to generate data.
                          </TableCell>
                      </TableRow>
                  ) : traces.map((trace) => (
                    <TableRow key={trace.ID} className="group hover:bg-muted/40 transition-colors cursor-pointer border-b border-border/50" onClick={() => window.location.href=`/traces/${trace.ID}`}>
                      <TableCell className="pl-6 py-2 h-9 font-medium align-middle">
                         <div className="flex items-center gap-2">
                            <div className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </div>
                            <span className="text-[13px] font-medium text-foreground">Completed</span>
                         </div>
                      </TableCell>
                      <TableCell className="py-2 h-9 font-medium text-foreground/90 align-middle text-[13px] truncate">
                        {trace.Name || 'Untitled Workflow'}
                      </TableCell>
                      <TableCell className="py-2 h-9 font-mono text-[11px] text-muted-foreground align-middle truncate" title={trace.ID}>
                        {trace.ID.substring(0, 8)}
                      </TableCell>
                      <TableCell className="py-2 h-9 text-right pr-6 text-muted-foreground text-[11px] align-middle tabular-nums">
                        {new Date(trace.CreatedAt).toLocaleString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
       </div>
    </div>
  );
}
