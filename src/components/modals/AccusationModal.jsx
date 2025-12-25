import { useState } from 'react'

const AccusationModal = ({ suspects, weapons, rooms, onAccuse, onCancel }) => {
  const [suspect1, setSuspect1] = useState('')
  const [suspect2, setSuspect2] = useState('')
  const [weapon, setWeapon] = useState('')
  const [room, setRoom] = useState('')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-4 border-red-600 rounded-lg p-6 max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-red-400">MAKE YOUR ACCUSATION</h2>
        <p className="text-sm text-yellow-400 mb-4">You only get ONE chance. Choose wisely!</p>
        <p className="text-xs text-gray-400 mb-4">Select a second suspect if you believe this was a conspiracy.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Primary Suspect</label>
            <select
              value={suspect1}
              onChange={(e) => setSuspect1(e.target.value)}
              className="w-full bg-gray-700 border-2 border-gray-600 rounded p-2"
            >
              <option value="">Select suspect...</option>
              {suspects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Second Suspect (Optional - if conspiracy)</label>
            <select
              value={suspect2}
              onChange={(e) => setSuspect2(e.target.value)}
              className="w-full bg-gray-700 border-2 border-gray-600 rounded p-2"
            >
              <option value="">None - solo killer</option>
              {suspects.filter(s => s !== suspect1).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">What weapon was used?</label>
            <select
              value={weapon}
              onChange={(e) => setWeapon(e.target.value)}
              className="w-full bg-gray-700 border-2 border-gray-600 rounded p-2"
            >
              <option value="">Select weapon...</option>
              {weapons.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Where did it happen?</label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full bg-gray-700 border-2 border-gray-600 rounded p-2"
            >
              <option value="">Select room...</option>
              {rooms.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-bold"
          >
            Cancel
          </button>
          <button
            onClick={() => onAccuse(suspect1, suspect2, weapon, room)}
            disabled={!suspect1 || !weapon || !room}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed py-3 rounded-lg font-bold"
          >
            ACCUSE!
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccusationModal
