const PayloadPanel: React.FC<{ payload: object | null; onClose: () => void }> = ({ payload, onClose }) => {
    return (
        <div
            className={`fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg transition-transform transform ${
                payload ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="p-4 border-b flex justify-between items-center bg-gray-200">
                <h2 className="text-lg font-semibold">Event Payload</h2>
                <button className="text-red-500 hover:text-red-700" onClick={onClose}>✕</button>
            </div>
            <div className="p-4 overflow-auto max-h-[90vh]">
                <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
                    {payload ? JSON.stringify(payload, null, 2) : "Select an event to view the payload."}
                </pre>
            </div>
        </div>
    );
};

export default PayloadPanel;
