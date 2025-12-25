import { Clock, Eye, Target, Siren, HelpCircle } from 'lucide-react'

const GameHeader = ({ turn, playerClues, opponentClues, onHelpClick }) => {
  return (
    <div className="bg-gray-800 border-4 border-red-600 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Siren className="w-8 h-8 text-red-500 animate-pulse" />
          <div>
            <h1 className="text-3xl font-bold text-red-400">FRAMED</h1>
            <p className="text-sm text-gray-400">Ravencrest Manor Murder</p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-center" data-tour="turns-counter">
            <Clock className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
            <div className="text-2xl font-bold text-yellow-400">{turn}</div>
            <div className="text-xs text-gray-400">Turns Left</div>
          </div>
          <div className="text-center">
            <Eye className="w-6 h-6 mx-auto mb-1 text-blue-400" />
            <div className="text-xl font-bold text-blue-400">{playerClues}</div>
            <div className="text-xs text-gray-400">Your Clues</div>
          </div>
          <div className="text-center">
            <Target className="w-6 h-6 mx-auto mb-1 text-purple-400" />
            <div className="text-xl font-bold text-purple-400">{opponentClues}</div>
            <div className="text-xs text-gray-400">Opponent</div>
          </div>
          {onHelpClick && (
            <button
              onClick={onHelpClick}
              className="w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-500 flex items-center justify-center transition-colors"
              title="How to Play"
            >
              <HelpCircle className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameHeader
