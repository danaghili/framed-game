import { useIsMobile } from '../hooks/useIsMobile'

const RoomButton = ({
  room,
  isPlayerPosition,
  isOpponentPosition,
  isBlocked,
  hasUnfoundEvidence,
  gameOver,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      disabled={gameOver || isPlayerPosition}
      className={`
        relative rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105
        flex items-center justify-center p-2 border-2 w-full h-full
        ${isPlayerPosition ? 'bg-blue-600 border-blue-300 text-white' : ''}
        ${isOpponentPosition && !isPlayerPosition ? 'bg-purple-600 border-purple-300 text-white' : ''}
        ${!isPlayerPosition && !isOpponentPosition ? 'bg-gray-700 border-gray-500 text-gray-200 hover:bg-gray-600' : ''}
        ${isBlocked ? 'bg-red-900 border-red-600' : ''}
        ${hasUnfoundEvidence && !isPlayerPosition && !isOpponentPosition ? 'shadow-lg shadow-yellow-400/50' : ''}
      `}
    >
      <div className="flex flex-col items-center gap-1">
        <span>{room}</span>
        {hasUnfoundEvidence && (
          <span className="text-yellow-400 text-xs">*</span>
        )}
      </div>
    </button>
  )
}

const FloorplanMap = ({
  playerPosition,
  opponentPosition,
  blockedRooms,
  evidence,
  gameOver,
  onRoomClick
}) => {
  const isMobile = useIsMobile()

  const renderRoom = (room, style) => {
    const isPlayerPosition = room === playerPosition
    const isOpponentPosition = room === opponentPosition
    const isBlocked = blockedRooms.includes(room)
    const hasUnfoundEvidence = evidence[room] && !evidence[room].found

    return (
      <div className="absolute" style={style}>
        <RoomButton
          room={room}
          isPlayerPosition={isPlayerPosition}
          isOpponentPosition={isOpponentPosition}
          isBlocked={isBlocked}
          hasUnfoundEvidence={hasUnfoundEvidence}
          gameOver={gameOver}
          onClick={() => onRoomClick(room)}
        />
      </div>
    )
  }

  return (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-300">Ravencrest Manor Floorplan</h2>

      {/* GROUND FLOOR */}
      <div className="mb-4 bg-gray-900 border-2 border-gray-700 rounded-lg p-3">
        <div className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2">
          <span className="text-green-400">*</span> GROUND FLOOR
        </div>
        <div className="relative bg-gray-950 border border-gray-800 rounded" style={{ height: isMobile ? '200px' : '260px' }}>
          {/* Hallways/corridors background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-0 right-0 h-12 bg-gray-700 transform -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-12 bg-gray-700 transform -translate-x-1/2"></div>
          </div>

          {renderRoom('Library', { top: '5%', left: '5%', width: '28%', height: '38%' })}
          {renderRoom('Grand Hall', { top: '5%', left: '36%', width: '28%', height: '50%' })}
          {renderRoom('Dining Room', { top: '5%', right: '5%', width: '28%', height: '38%' })}
          {renderRoom('Billiard Room', { bottom: '5%', left: '5%', width: '28%', height: '38%' })}
          {renderRoom('Kitchen', { bottom: '5%', left: '36%', width: '28%', height: '38%' })}
          {renderRoom('Conservatory', { bottom: '5%', right: '5%', width: '28%', height: '38%' })}
        </div>
      </div>

      {/* FIRST FLOOR */}
      <div className="mb-4 bg-gray-900 border-2 border-gray-700 rounded-lg p-3">
        <div className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2">
          <span className="text-blue-400">*</span> FIRST FLOOR
        </div>
        <div className="relative bg-gray-950 border border-gray-800 rounded" style={{ height: isMobile ? '160px' : '200px' }}>
          {/* Horizontal hallway */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-0 right-0 h-12 bg-gray-700 transform -translate-y-1/2"></div>
          </div>

          {renderRoom('Master Bedroom', { top: '10%', left: '5%', width: '22%', height: '35%' })}
          {renderRoom('Study', { bottom: '10%', left: '5%', width: '22%', height: '35%' })}
          {renderRoom('Gallery', { top: '10%', left: '35%', width: '25%', height: '80%' })}
          {renderRoom('Ballroom', { top: '10%', right: '5%', width: '30%', height: '80%' })}
        </div>
      </div>

      {/* BASEMENT & ATTIC */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-3">
          <div className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2">
            <span className="text-purple-400">*</span> BASEMENT
          </div>
          <div className="relative bg-gray-950 border border-gray-800 rounded" style={{ height: isMobile ? '80px' : '120px' }}>
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <RoomButton
                room="Wine Cellar"
                isPlayerPosition={playerPosition === 'Wine Cellar'}
                isOpponentPosition={opponentPosition === 'Wine Cellar'}
                isBlocked={blockedRooms.includes('Wine Cellar')}
                hasUnfoundEvidence={evidence['Wine Cellar'] && !evidence['Wine Cellar'].found}
                gameOver={gameOver}
                onClick={() => onRoomClick('Wine Cellar')}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-3">
          <div className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2">
            <span className="text-yellow-400">*</span> ATTIC
          </div>
          <div className="relative bg-gray-950 border border-gray-800 rounded" style={{ height: isMobile ? '80px' : '120px' }}>
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <RoomButton
                room="Servant Quarters"
                isPlayerPosition={playerPosition === 'Servant Quarters'}
                isOpponentPosition={opponentPosition === 'Servant Quarters'}
                isBlocked={blockedRooms.includes('Servant Quarters')}
                hasUnfoundEvidence={evidence['Servant Quarters'] && !evidence['Servant Quarters'].found}
                gameOver={gameOver}
                onClick={() => onRoomClick('Servant Quarters')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="mt-4 bg-gray-700 border-2 border-gray-600 rounded-lg p-3">
        <div className="text-xs font-bold text-gray-400 mb-2">MAP LEGEND</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 border border-blue-300 rounded"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-600 border border-purple-300 rounded"></div>
            <span>Rival Detective</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span>Evidence Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-900 border border-red-600 rounded"></div>
            <span>Blocked Room</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FloorplanMap
