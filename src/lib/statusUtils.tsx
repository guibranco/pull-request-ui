export const getStatusBadge = (status?: string, conclusion?: string) => {
    if (!status) return <span className="text-gray-500">-</span>;
  
    const statusStyles: Record<string, string> = {
      queued: "bg-yellow-500 text-white px-2 py-1 rounded",
      in_progress: "bg-blue-500 text-white px-2 py-1 rounded",
      completed: "bg-green-500 text-white px-2 py-1 rounded",
    };
  
    const conclusionStyles: Record<string, { text: string; color: string }> = {
      success: { text: "✅ Success", color: "bg-green-600 text-white" },
      failure: { text: "❌ Failure", color: "bg-red-600 text-white" },
      cancelled: { text: "⚠️ Cancelled", color: "bg-gray-500 text-white" },
    };
  
    if (status === "completed" && conclusion) {
      return (
        <span className={`px-2 py-1 rounded ${conclusionStyles[conclusion]?.color}`}>
          {conclusionStyles[conclusion]?.text}
        </span>
      );
    }
  
    return <span className={statusStyles[status] || "bg-gray-500 text-white px-2 py-1 rounded"}>{status}</span>;
  };
  