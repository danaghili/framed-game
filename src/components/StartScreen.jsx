import { useState } from 'react'
import { Siren, Clock, MessageSquare, Microscope, Users } from 'lucide-react'
import { DIFFICULTY, DIFFICULTY_CONFIG } from '../data/constants'
import { useIsMobile } from '../hooks/useIsMobile'

const DifficultyCard = ({ difficulty, config, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(difficulty)}
      className={`p-4 rounded-lg border-2 text-left transition-all ${
        isSelected
          ? 'border-white bg-gray-600'
          : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg" style={{ color: config.color }}>
          {config.label}
        </span>
        {isSelected && (
          <span className="text-xs bg-white text-gray-900 px-2 py-0.5 rounded">Selected</span>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-3">{config.description}</p>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {config.turns} turns
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          {config.interrogations} interrogations
        </div>
        <div className="flex items-center gap-1">
          <Microscope className="w-3 h-3" />
          {config.forensicsUses} forensics
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {Math.round(config.conspiracyChance * 100)}% conspiracy
        </div>
      </div>
    </button>
  )
}

const StartScreen = ({ onStart }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY.NORMAL)
  const isMobile = useIsMobile()

  const handleStart = () => {
    onStart(selectedDifficulty)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-gray-100 ${isMobile ? 'p-4' : 'p-8'} flex items-center justify-center`}>
      <div className={`max-w-3xl w-full bg-gray-800 border-4 border-red-600 rounded-lg ${isMobile ? 'p-4' : 'p-8'}`}>
        <div className="text-center mb-6 md:mb-8">
          <Siren className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} mx-auto mb-3 md:mb-4 text-red-500 animate-pulse`} />
          <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold text-red-400 mb-2`}>FRAMED</h1>
          <p className={`${isMobile ? 'text-base' : 'text-xl'} text-gray-300`}>A Murder at Ravencrest Manor</p>
        </div>

        <div className={`bg-gray-700 rounded-lg ${isMobile ? 'p-4' : 'p-6'} mb-4 md:mb-6`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-3 md:mb-4 text-blue-400`}>THE STORY</h2>
          <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
            A prestigious guest has been murdered at Ravencrest Manor. Five suspects remain, each with secrets, motives, and connections.
            You are a private detective—but so is your rival. Race to solve the murder before they do!
          </p>
          <p className="text-yellow-400 font-bold text-sm md:text-base">
            TWIST: Sometimes killers work in pairs. Uncover conspiracies by studying relationships!
          </p>
        </div>

        <div className={`bg-gray-700 rounded-lg ${isMobile ? 'p-4' : 'p-6'} mb-4 md:mb-6`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-3 md:mb-4 text-orange-400`}>SELECT DIFFICULTY</h2>
          <div className={`grid gap-3 md:gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
              <DifficultyCard
                key={key}
                difficulty={key}
                config={config}
                isSelected={selectedDifficulty === key}
                onSelect={setSelectedDifficulty}
              />
            ))}
          </div>
        </div>

        <div className={`bg-gray-700 rounded-lg ${isMobile ? 'p-4' : 'p-6'} mb-4 md:mb-6`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-3 md:mb-4 text-purple-400`}>SUSPECTS</h2>
          <div className={`grid gap-2 text-sm text-gray-300 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div>Lady Blackwood (Botanist)</div>
            <div>Colonel Ashford (Retired Officer)</div>
            <div>Dr. Sterling (Physician)</div>
            <div>Miss Hartley (Governess)</div>
            <div>Lord Ravencrest (Manor Owner)</div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-4 rounded-lg font-bold text-lg md:text-xl shadow-lg transform hover:scale-105 transition-all touch-active"
        >
          BEGIN INVESTIGATION
        </button>
      </div>
    </div>
  )
}

export default StartScreen
