// "use client";

// import { useState, useEffect } from "react";
// import React from "react";

// interface Column<T> {
//   header: string;
//   render: (item: T, idx?: number) => React.ReactNode;
//   className?: string;
//   headerClassName?: string;
// }

// interface CommonTableProps<T> {
//   columns: Column<T>[];
//   data: T[];
//   loading?: boolean;
//   emptyMessage?: string;
//   skeletonRows?: number;
//   showingText?: string;
//   currentPage?: number;
//   totalPages?: number;
//   onPrev?: () => void;
//   onNext?: () => void;
//   onSearch?: (value: string) => void;
//   searchPlaceholder?: string;
//   headerBg?: string;
//   footerBg?: string;
// }

// export default function CommonTable<T>({
//   columns,
//   data,
//   loading = false,
//   emptyMessage = "No records found.",
//   skeletonRows = 4,
//   showingText,
//   currentPage = 1,
//   totalPages = 1,
//   onPrev,
//   onNext,
//   onSearch,
//   searchPlaceholder = "Search...",
//   headerBg = "bg-gray-50",
//   footerBg = "bg-gray-50",
// }: CommonTableProps<T>) {
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     if (!onSearch) return;
//     const handler = setTimeout(() => onSearch(searchTerm), 500);
//     return () => clearTimeout(handler);
//   }, [searchTerm, onSearch]);

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//       {/* Search */}
//       {onSearch && (
//         <div className="p-4 border-b border-gray-200 bg-white">
//           <div className="relative w-full max-w-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder={searchPlaceholder}
//               className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-[#00A759] transition-colors"
//             />
//           </div>
//         </div>
//       )}

//       {/* Desktop Header */}
//       <div
//         className={`hidden md:grid px-6 py-3 ${headerBg} border-b border-gray-200`}
//         style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
//       >
//         {columns.map((col, idx) => (
//           <span key={idx} className={`text-xs font-semibold text-gray-500 tracking-wider uppercase ${col.headerClassName ?? ""}`}>
//             {col.header}
//           </span>
//         ))}
//       </div>

//       {/* Skeleton */}
//       {loading && (
//         <div className="divide-y divide-gray-100">
//           {Array.from({ length: skeletonRows }).map((_, i) => (
//             <div key={i} className="hidden md:grid px-6 py-4 animate-pulse gap-4"
//               style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
//               {columns.map((_, ci) => <div key={ci} className="h-4 bg-gray-100 rounded w-3/4" />)}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Empty */}
//       {!loading && data.length === 0 && (
//         <div className="px-6 py-14 text-center">
//           <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
//             <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
//             </svg>
//           </div>
//           <p className="text-sm text-gray-400 font-medium">{emptyMessage}</p>
//         </div>
//       )}

//       {/* Desktop Rows */}
//       {!loading && data.map((item, idx) => (
//         <div key={idx}
//           className={`hidden md:grid px-6 py-3 items-center hover:bg-gray-50/60 transition-colors ${idx !== data.length - 1 ? "border-b border-gray-100" : ""}`}
//           style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
//           {columns.map((col, ci) => (
//             <div key={ci} className={`text-sm text-gray-700 ${col.className ?? ""}`}>
//               {col.render(item, idx)}
//             </div>
//           ))}
//         </div>
//       ))}

//       {/* Mobile Cards */}
//       {!loading && (
//         <div className="md:hidden divide-y divide-gray-100">
//           {data.map((item, idx) => (
//             <div key={idx} className="p-4 space-y-2">
//               {columns.map((col, ci) => (
//                 <div key={ci} className="flex justify-between items-center gap-4">
//                   <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider shrink-0">{col.header}</span>
//                   <div className="text-sm text-gray-700 text-right">{col.render(item, idx)}</div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Footer */}
//       <div className={`flex items-center justify-between px-6 py-3 ${footerBg} border-t border-gray-200`}>
//         <span className="text-sm text-gray-500">{showingText ?? `Showing ${data.length} records`}</span>
//         <div className="flex items-center gap-1">
//           <button onClick={onPrev} disabled={currentPage === 1}
//             className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm">‹</button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button key={page}
//               className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "text-white border" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"}`}
//               style={currentPage === page ? { backgroundColor: "#00A759", borderColor: "#00A759" } : {}}>
//               {page}
//             </button>
//           ))}
//           <button onClick={onNext} disabled={currentPage === totalPages}
//             className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm">›</button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import React from "react";

interface Column<T> {
  header: string;
  render: (item: T, idx?: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface CommonTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  skeletonRows?: number;
  showingText?: string;
  currentPage?: number;
  totalPages?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  headerBg?: string;
  footerBg?: string;
  /** Override the CSS grid-template-columns. e.g. "2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr" */
  gridTemplateColumns?: string;
}

export default function CommonTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No records found.",
  skeletonRows = 4,
  showingText,
  currentPage = 1,
  totalPages = 1,
  onPrev,
  onNext,
  onSearch,
  searchPlaceholder = "Search...",
  headerBg = "bg-gray-50",
  footerBg = "bg-gray-50",
  gridTemplateColumns,
}: CommonTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  // derive grid: use override if provided, else equal columns
  const gridCols = gridTemplateColumns ?? `repeat(${columns.length}, minmax(0, 1fr))`;

  useEffect(() => {
    if (!onSearch) return;
    const handler = setTimeout(() => onSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Search */}
      {onSearch && (
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-[#00A759] transition-colors"
            />
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <div
        className={`hidden md:grid px-6 py-3 ${headerBg} border-b border-gray-200`}
        style={{ gridTemplateColumns: gridCols }}
      >
        {columns.map((col, idx) => (
          <span key={idx} className={`text-xs font-semibold text-gray-500 tracking-wider uppercase ${col.headerClassName ?? ""}`}>
            {col.header}
          </span>
        ))}
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="divide-y divide-gray-100">
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div key={i} className="hidden md:grid px-6 py-4 animate-pulse gap-4"
              style={{ gridTemplateColumns: gridCols }}>
              {columns.map((_, ci) => <div key={ci} className="h-4 bg-gray-100 rounded w-3/4" />)}
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && data.length === 0 && (
        <div className="px-6 py-14 text-center">
          <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 font-medium">{emptyMessage}</p>
        </div>
      )}

      {/* Desktop Rows */}
      {!loading && data.map((item, idx) => (
        <div key={idx}
          className={`hidden md:grid px-6 py-3 items-center hover:bg-gray-50/60 transition-colors ${idx !== data.length - 1 ? "border-b border-gray-100" : ""}`}
          style={{ gridTemplateColumns: gridCols }}>
          {columns.map((col, ci) => (
            <div key={ci} className={`text-sm text-gray-700 ${col.className ?? ""}`}>
              {col.render(item, idx)}
            </div>
          ))}
        </div>
      ))}

      {/* Mobile Cards */}
      {!loading && (
        <div className="md:hidden divide-y divide-gray-100">
          {data.map((item, idx) => (
            <div key={idx} className="p-4 space-y-2">
              {columns.map((col, ci) => (
                <div key={ci} className="flex justify-between items-center gap-4">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider shrink-0">{col.header}</span>
                  <div className="text-sm text-gray-700 text-right">{col.render(item, idx)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className={`flex items-center justify-between px-6 py-3 ${footerBg} border-t border-gray-200`}>
        <span className="text-sm text-gray-500">{showingText ?? `Showing ${data.length} records`}</span>
        <div className="flex items-center gap-1">
          <button onClick={onPrev} disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "text-white border" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"}`}
              style={currentPage === page ? { backgroundColor: "#00A759", borderColor: "#00A759" } : {}}>
              {page}
            </button>
          ))}
          <button onClick={onNext} disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm">›</button>
        </div>
      </div>
    </div>
  );
}