import ResponsiveModal from '../responsive/ResponsiveModal'

const EventsModal = ({ log, onClose }) => {
  return (
    <ResponsiveModal
      isOpen={true}
      onClose={onClose}
      title="Recent Events"
      size="md"
      borderColor="border-gray-600"
    >
      <div className="space-y-2">
        {[...log].reverse().map((entry, idx) => (
          <div key={idx} className="text-sm p-3 bg-gray-700 rounded text-gray-300">
            {entry}
          </div>
        ))}
        {log.length === 0 && (
          <div className="text-sm text-gray-500 italic text-center py-8">
            No events yet.
          </div>
        )}
      </div>
    </ResponsiveModal>
  )
}

export default EventsModal
