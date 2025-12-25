import { useState, Component } from 'react'

// Hooks
import { useGameState } from './hooks/useGameState'
import { useOpponentAI } from './hooks/useOpponentAI'
import { useDeductionBoard } from './hooks/useDeductionBoard'
import { useIsMobile } from './hooks/useIsMobile'

// Mobile Components
import MobileNav from './components/mobile/MobileNav'

// Data
import { SUSPECTS, SUSPECT_PROFILES } from './data/suspects'
import { WEAPONS, WEAPON_DETAILS } from './data/weapons'
import { ROOMS } from './data/rooms'
import { RELATIONSHIP_TYPES } from './data/relationships'
import { GAME_PHASE } from './data/constants'

// Components
import StartScreen from './components/StartScreen'
import GameHeader from './components/GameHeader'
import FloorplanMap from './components/FloorplanMap'
import ActionPanel from './components/ActionPanel'
import EvidencePanel from './components/EvidencePanel'
import GameOverScreen from './components/GameOverScreen'

// Modals
import DossierModal from './components/modals/DossierModal'
import AccusationModal from './components/modals/AccusationModal'
import EventsModal from './components/modals/EventsModal'
import RelationshipsModal from './components/modals/RelationshipsModal'
import TimelineModal from './components/modals/TimelineModal'
import WitnessModal from './components/modals/WitnessModal'
import DeductionBoardModal from './components/modals/DeductionBoardModal'
import EvidenceJournalModal from './components/modals/EvidenceJournalModal'
import DocumentsListModal from './components/modals/DocumentsListModal'

// Panels
import InterrogationPanel from './components/panels/InterrogationPanel'
import WeaponExaminationPanel from './components/panels/WeaponExaminationPanel'

// Error Boundary
class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold"
            >
              Restart Game
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const FramedGame = () => {
  const { state, actions } = useGameState()
  const { makeMove, shouldAccuse } = useOpponentAI()
  const { state: deductionState, actions: deductionActions, summary: deductionSummary } = useDeductionBoard()
  const isMobile = useIsMobile()

  // Mobile navigation state
  const [activeTab, setActiveTab] = useState('map')

  // Modal visibility state
  const [showAccuseModal, setShowAccuseModal] = useState(false)
  const [showDossier, setShowDossier] = useState(false)
  const [showEventsModal, setShowEventsModal] = useState(false)
  const [showRelationshipsModal, setShowRelationshipsModal] = useState(false)
  const [showTimelineModal, setShowTimelineModal] = useState(false)
  const [showWitnessModal, setShowWitnessModal] = useState(false)
  const [showDeductionModal, setShowDeductionModal] = useState(false)
  const [showEvidenceJournal, setShowEvidenceJournal] = useState(false)
  const [showDocuments, setShowDocuments] = useState(false)

  const gameOver = state.phase === GAME_PHASE.GAME_OVER

  // Handle opponent moves after player actions
  const handleOpponentMove = () => {
    const move = makeMove(state)
    if (move.moveType !== 'none') {
      actions.opponentMove(move)
    }

    // Check if opponent should accuse
    const accuseCheck = shouldAccuse(state)
    if (accuseCheck.shouldAccuse) {
      setTimeout(() => {
        actions.opponentMove({
          moveType: 'accuse',
          accusation: { correct: accuseCheck.correct }
        })
      }, 1000)
    }
  }

  // Wrapped action handlers that trigger opponent moves
  const handleSearchRoom = (room) => {
    if (state.selectedAction === 'search') {
      actions.searchRoom(room)
      handleOpponentMove()
    } else if (state.selectedAction === 'block') {
      actions.blockRoom(room)
      handleOpponentMove()
    }
  }

  const handleInterrogate = (suspect) => {
    actions.interrogate(suspect)
    handleOpponentMove()
  }

  const handleExamineWeapon = (weapon) => {
    actions.examineWeapon(weapon)
    handleOpponentMove()
  }

  const handleAccusation = (suspect1, suspect2, weapon, room) => {
    actions.makeAccusation(suspect1, suspect2, weapon, room)
    setShowAccuseModal(false)
  }

  // Start screen
  if (state.phase === GAME_PHASE.START) {
    return <StartScreen onStart={actions.startGame} />
  }

  // Handle mobile tab changes that open modals
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'evidence') {
      setShowEvidenceJournal(true)
    } else if (tab === 'board') {
      setShowDeductionModal(true)
    } else if (tab === 'menu') {
      // Show a menu with additional options
      setShowEventsModal(true)
    }
  }

  const showBottomNav = isMobile && state.phase === GAME_PHASE.PLAYING

  // Main game UI
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-gray-100 p-4 ${
      showBottomNav ? 'has-bottom-nav' : ''
    }`}>
      <div className="max-w-7xl mx-auto">
        <GameHeader
          turn={state.turn}
          playerClues={state.playerClues.length}
          opponentClues={state.opponentClues.length}
        />

        {/* Game Over Screen */}
        {gameOver && (
          <GameOverScreen
            winner={state.winner}
            solution={state.solution}
            onRestart={() => window.location.reload()}
          />
        )}

        {/* Action Buttons - Responsive Grid */}
        <div className={`grid gap-2 mb-2 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <button
            onClick={() => setShowAccuseModal(true)}
            disabled={gameOver}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-700 disabled:to-gray-700 text-white py-3 md:py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all disabled:scale-100 disabled:cursor-not-allowed text-sm md:text-xs touch-active"
          >
            ACCUSE
          </button>

          <button
            onClick={() => setShowDossier(true)}
            disabled={gameOver}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 text-white py-3 md:py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all disabled:scale-100 disabled:cursor-not-allowed text-sm md:text-xs touch-active"
          >
            DOSSIERS
          </button>

          <button
            onClick={() => setShowTimelineModal(true)}
            disabled={gameOver}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 text-white py-3 md:py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all disabled:scale-100 disabled:cursor-not-allowed text-sm md:text-xs touch-active"
          >
            TIMELINE
          </button>

          <button
            onClick={() => setShowWitnessModal(true)}
            disabled={gameOver}
            className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 disabled:from-gray-700 disabled:to-gray-700 text-white py-3 md:py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all disabled:scale-100 disabled:cursor-not-allowed text-sm md:text-xs touch-active"
          >
            WITNESSES
          </button>
        </div>

        {/* Action Buttons - Row 2 */}
        <div className={`grid gap-2 mb-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <button
            onClick={() => setShowEvidenceJournal(true)}
            disabled={gameOver}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 text-white py-3 md:py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all disabled:scale-100 disabled:cursor-not-allowed text-sm md:text-xs touch-active"
          >
            EVIDENCE
          </button>

          <button
            onClick={() => setShowDocuments(true)}
            disabled={gameOver}
            className="bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-700 hover:to-orange-600 disabled:from-gray-700 disabled:to-gray-700 text-white py-3 md:py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all disabled:scale-100 disabled:cursor-not-allowed text-sm md:text-xs touch-active"
          >
            DOCUMENTS
          </button>

          <button
            onClick={() => setShowDeductionModal(true)}
            disabled={gameOver}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-700 disabled:to-gray-700 text-white py-3 md:py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all disabled:scale-100 disabled:cursor-not-allowed text-sm md:text-xs touch-active"
          >
            DEDUCTIONS
          </button>

          <button
            onClick={() => setShowRelationshipsModal(true)}
            disabled={gameOver}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-700 text-white py-3 md:py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all disabled:scale-100 disabled:cursor-not-allowed text-sm md:text-xs touch-active"
          >
            RELATIONSHIPS
          </button>
        </div>

        {/* Main Game Area - Responsive Grid */}
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {/* Map - Full width on mobile, show when on map tab or desktop */}
          {(!isMobile || activeTab === 'map' || activeTab === 'search') && (
            <div className={isMobile ? 'col-span-1' : 'col-span-1'}>
              <FloorplanMap
                playerPosition={state.playerPosition}
                opponentPosition={state.opponentPosition}
                blockedRooms={state.blockedRooms}
                evidence={state.evidence}
                gameOver={gameOver}
                onRoomClick={handleSearchRoom}
              />
            </div>
          )}

          {/* Interrogation Panel */}
          {state.selectedAction === 'interrogate' && (
            <div className={isMobile ? 'col-span-1' : 'col-span-2'}>
              <InterrogationPanel
                suspects={SUSPECTS}
                suspectProfiles={SUSPECT_PROFILES}
                interrogated={state.interrogated}
                interrogationsLeft={state.interrogationsLeft}
                gameOver={gameOver}
                onInterrogate={handleInterrogate}
              />
            </div>
          )}

          {/* Weapon Examination Panel */}
          {state.selectedAction === 'examine' && (
            <div className={isMobile ? 'col-span-1' : 'col-span-2'}>
              <WeaponExaminationPanel
                weapons={WEAPONS}
                weaponDetails={WEAPON_DETAILS}
                examinedWeapons={state.examinedWeapons}
                hasForensicsKit={state.hasForensicsKit}
                forensicsUsesLeft={state.forensicsUsesLeft}
                gameOver={gameOver}
                onExamine={handleExamineWeapon}
              />
            </div>
          )}

          {/* Action & Evidence Panels - Show on desktop or when not in specialized view on mobile */}
          {(!isMobile || (activeTab === 'map' || activeTab === 'search')) && (
            <div className="space-y-4">
              <ActionPanel
                selectedAction={state.selectedAction}
                onActionChange={actions.setSelectedAction}
                interrogationsLeft={state.interrogationsLeft}
                hasForensicsKit={state.hasForensicsKit}
                forensicsUsesLeft={state.forensicsUsesLeft}
                hasMasterKey={state.hasMasterKey}
                blockedRoomsCount={state.blockedRooms.length}
                gameOver={gameOver}
              />

              <EvidencePanel
                clues={state.playerClues}
                onShowEvents={() => setShowEventsModal(true)}
              />
            </div>
          )}
        </div>

        {/* Modals */}
        {showAccuseModal && (
          <AccusationModal
            suspects={SUSPECTS}
            weapons={WEAPONS}
            rooms={ROOMS}
            onAccuse={handleAccusation}
            onCancel={() => setShowAccuseModal(false)}
          />
        )}

        {showDossier && (
          <DossierModal
            suspects={SUSPECTS}
            suspectProfiles={SUSPECT_PROFILES}
            discoveredTraits={state.discoveredTraits}
            onClose={() => setShowDossier(false)}
            onShowRelationships={() => {
              setShowDossier(false)
              setShowRelationshipsModal(true)
            }}
          />
        )}

        {showEventsModal && (
          <EventsModal
            log={state.gameLog}
            onClose={() => setShowEventsModal(false)}
          />
        )}

        {showRelationshipsModal && state.relationships && (
          <RelationshipsModal
            suspects={SUSPECTS}
            relationships={state.relationships}
            relationshipTypes={RELATIONSHIP_TYPES}
            onClose={() => setShowRelationshipsModal(false)}
          />
        )}

        {showTimelineModal && state.timelines && (
          <TimelineModal
            suspects={SUSPECTS}
            timelines={state.timelines}
            onClose={() => setShowTimelineModal(false)}
          />
        )}

        {showWitnessModal && state.witnesses && (
          <WitnessModal
            suspects={SUSPECTS}
            witnesses={state.witnesses}
            onClose={() => setShowWitnessModal(false)}
          />
        )}

        {showDeductionModal && (
          <DeductionBoardModal
            suspects={SUSPECTS}
            weapons={WEAPONS}
            rooms={ROOMS}
            deductionState={deductionState}
            deductionActions={deductionActions}
            summary={deductionSummary}
            onClose={() => setShowDeductionModal(false)}
          />
        )}

        {showEvidenceJournal && (
          <EvidenceJournalModal
            clues={state.playerClues}
            suspects={SUSPECTS}
            onClose={() => setShowEvidenceJournal(false)}
          />
        )}

        {showDocuments && (
          <DocumentsListModal
            documents={state.foundDocuments || []}
            onClose={() => setShowDocuments(false)}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {showBottomNav && (
        <MobileNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          disabled={gameOver}
        />
      )}
    </div>
  )
}

const App = () => (
  <ErrorBoundary>
    <FramedGame />
  </ErrorBoundary>
)

export default App
