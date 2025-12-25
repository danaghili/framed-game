const EventsModal = ({ log, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border-4 border-gray-600 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-300">Recent Events</h2>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-bold"
          >
            Close
          </button>
        </div>
        <div className="space-y-2 overflow-y-auto flex-1">
          {[...log].reverse().map((entry, idx) => (
            <div key={idx} className="text-sm p-2 bg-gray-700 rounded text-gray-300">
              {entry}
            </div>
          ))}
          {log.length === 0 && (
            <div className="text-sm text-gray-500 italic text-center py-8">
              No events yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventsModal
