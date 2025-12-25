import { useState, useEffect, useRef, Component } from 'react'

// Hooks
import { useGameState } from './hooks/useGameState'
import { useOpponentAI } from './hooks/useOpponentAI'
import { useDeductionBoard } from './hooks/useDeductionBoard'
import { useIsMobile } from './hooks/useIsMobile'
import { useToast } from './hooks/useToast'

// Mobile Components
import MobileNav from './components/mobile/MobileNav'

// Inline Components (Desktop)
import InlineDeductionBoard from './components/InlineDeductionBoard'
import InlineEvidencePanel from './components/InlineEvidencePanel'

// Toast
import { ToastContainer } from './components/Toast'

// Data
import { SUSPECTS, SUSPECT_PROFILES } from './data/suspects'
import { WEAPONS } from './data/weapons'
import { ROOMS } from './data/rooms'
import { RELATIONSHIP_TYPES } from './data/relationships'
import { GAME_PHASE } from './data/constants'

// Components
import StartScreen from './components/StartScreen'
import GameHeader from './components/GameHeader'
import FloorplanMap from './components/FloorplanMap'
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
import MoreMenuModal from './components/modals/MoreMenuModal'
import RoomActionModal from './components/modals/RoomActionModal'

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
  const { toasts, removeToast, addToast } = useToast()

  // Mobile navigation state
  const [activeTab, setActiveTab] = useState('search')

  // Track seen evidence for badge
  const [seenEvidenceCount, setSeenEvidenceCount] = useState(0)
  const [seenDocumentCount, setSeenDocumentCount] = useState(0)

  // Track previous state for detecting new findings
  const prevStateRef = useRef({ clueCount: 0, docCount: 0, hasForensicsKit: false, hasMasterKey: false })

  // Modal visibility state
  const [showAccuseModal, setShowAccuseModal] = useState(false)
  const [showDossier, setShowDossier] = useState(false)
  const [showEventsModal, setShowEventsModal] = useState(false)
  const [showRelationshipsModal, setShowRelationshipsModal] = useState(false)
  const [showTimelineModal, setShowTimelineModal] = useState(false)
  const [showWitnessModal, setShowWitnessModal] = useState(false)
  const [showDeductionModal, setShowDeductionModal] = useState(false)
  const [showEvidenceJournal, setShowEvidenceJournal] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  // Room action modal state
  const [selectedRoom, setSelectedRoom] = useState(null)

  const gameOver = state.phase === GAME_PHASE.GAME_OVER

  // Calculate badge count for evidence tab
  const evidenceBadgeCount = Math.max(0,
    (state.playerClues?.length || 0) - seenEvidenceCount +
    (state.foundDocuments?.length || 0) - seenDocumentCount
  )

  // Show toast when new evidence is found
  useEffect(() => {
    const prevClues = prevStateRef.current.clueCount
    const prevDocs = prevStateRef.current.docCount
    const prevForensics = prevStateRef.current.hasForensicsKit
    const prevMasterKey = prevStateRef.current.hasMasterKey

    const currentClues = state.playerClues?.length || 0
    const currentDocs = state.foundDocuments?.length || 0

    // Show toast for new clues
    if (currentClues > prevClues && state.playerPosition) {
      const newClues = state.playerClues.slice(prevClues)
      newClues.forEach(clue => {
        // Check if it's an item notification (forensics kit or master key already handled)
        if (!clue.toLowerCase().includes('forensics kit') && !clue.toLowerCase().includes('master key')) {
          addToast({
            type: 'search',
            title: `Evidence Found`,
            message: clue.length > 60 ? clue.substring(0, 60) + '...' : clue
          })
        }
      })
    }

    // Show toast for new documents
    if (currentDocs > prevDocs) {
      const newDocs = state.foundDocuments.slice(prevDocs)
      newDocs.forEach(doc => {
        addToast({
          type: 'document',
          title: 'Document Found',
          message: doc.title
        })
      })
    }

    // Show toast for forensics kit
    if (state.hasForensicsKit && !prevForensics) {
      addToast({
        type: 'item',
        title: 'Forensics Kit Found!',
        message: `Can examine ${state.forensicsUsesLeft} weapons`
      })
    }

    // Show toast for master key
    if (state.hasMasterKey && !prevMasterKey) {
      addToast({
        type: 'item',
        title: 'Master Key Found!',
        message: 'Can block 1 room from rival'
      })
    }

    // Update ref
    prevStateRef.current = {
      clueCount: currentClues,
      docCount: currentDocs,
      hasForensicsKit: state.hasForensicsKit,
      hasMasterKey: state.hasMasterKey
    }
  }, [state.playerClues, state.foundDocuments, state.hasForensicsKit, state.hasMasterKey, state.playerPosition, addToast])

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

  // Handle room click - show options if block is available
  const handleRoomClick = (room) => {
    const canBlock = state.hasMasterKey && state.blockedRooms.length === 0
    if (canBlock) {
      setSelectedRoom(room)
    } else {
      handleSearchRoom(room)
    }
  }

  // Search room action
  const handleSearchRoom = (room) => {
    setSelectedRoom(null)
    actions.searchRoom(room)
    handleOpponentMove()
  }

  // Block room action
  const handleBlockRoom = (room) => {
    setSelectedRoom(null)
    actions.blockRoom(room)
    handleOpponentMove()
    addToast({
      type: 'info',
      title: 'Room Blocked',
      message: `${room} is now locked to your rival`
    })
  }

  const handleInterrogate = (suspect) => {
    actions.interrogate(suspect)
    handleOpponentMove()
  }

  const handleExamineWeapon = (weapon) => {
    actions.examineWeapon(weapon)
    handleOpponentMove()
  }

  const handleInterviewStaff = (suspect) => {
    actions.interviewStaff(suspect)
    handleOpponentMove()
    setShowWitnessModal(false)
    addToast({
      type: 'info',
      title: 'Staff Interviewed',
      message: `Gathered testimony about ${suspect.split(' ').pop()}`
    })
  }

  const handleAccusation = (suspect1, suspect2, weapon, room) => {
    actions.makeAccusation(suspect1, suspect2, weapon, room)
    setShowAccuseModal(false)
  }

  // Start screen
  if (state.phase === GAME_PHASE.START) {
    return <StartScreen onStart={actions.startGame} />
  }

  // Handle mobile tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'accuse') {
      setShowAccuseModal(true)
    } else if (tab === 'evidence') {
      // Mark evidence as seen when opening
      setSeenEvidenceCount(state.playerClues?.length || 0)
      setSeenDocumentCount(state.foundDocuments?.length || 0)
      setShowEvidenceJournal(true)
    } else if (tab === 'board') {
      setShowDeductionModal(true)
    } else if (tab === 'menu') {
      setShowMoreMenu(true)
    }
  }

  const showBottomNav = isMobile && state.phase === GAME_PHASE.PLAYING

  // Main game UI
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-gray-100 p-4 ${
      showBottomNav ? 'has-bottom-nav' : ''
    }`}>
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

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

        {/* Desktop Layout */}
        {!isMobile && (
          <>
            {/* Desktop Action Bar - Simplified */}
            {!gameOver && (
              <div className="mb-4 flex items-center gap-3">
                <button
                  onClick={() => setShowAccuseModal(true)}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all"
                >
                  MAKE ACCUSATION
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDossier(true)}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Dossiers
                  </button>
                  <button
                    onClick={() => setShowRelationshipsModal(true)}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Relationships
                  </button>
                  <button
                    onClick={() => setShowWitnessModal(true)}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Witnesses
                  </button>
                  <button
                    onClick={() => setShowTimelineModal(true)}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Timeline
                  </button>
                  <button
                    onClick={() => setShowEventsModal(true)}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Events
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Main Grid - 3 columns: Deduction | Map | Evidence */}
            <div className="grid grid-cols-3 gap-4">
              <InlineDeductionBoard
                suspects={SUSPECTS}
                weapons={WEAPONS}
                rooms={ROOMS}
                deductionState={deductionState}
                deductionActions={deductionActions}
                summary={deductionSummary}
                onInterrogate={handleInterrogate}
                onExamine={handleExamineWeapon}
                interrogationsLeft={state.interrogationsLeft}
                interrogated={state.interrogated}
                hasForensicsKit={state.hasForensicsKit}
                forensicsUsesLeft={state.forensicsUsesLeft}
                examinedWeapons={state.examinedWeapons}
                gameOver={gameOver}
              />

              <FloorplanMap
                playerPosition={state.playerPosition}
                opponentPosition={state.opponentPosition}
                blockedRooms={state.blockedRooms}
                evidence={state.evidence}
                gameOver={gameOver}
                onRoomClick={handleRoomClick}
              />

              <InlineEvidencePanel
                clues={state.playerClues}
                documents={state.foundDocuments || []}
              />
            </div>
          </>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <FloorplanMap
            playerPosition={state.playerPosition}
            opponentPosition={state.opponentPosition}
            blockedRooms={state.blockedRooms}
            evidence={state.evidence}
            gameOver={gameOver}
            onRoomClick={handleRoomClick}
          />
        )}

        {/* Modals (shared between mobile and desktop) */}
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
            discoveredRelationships={state.discoveredRelationships}
            relationshipTypes={RELATIONSHIP_TYPES}
            onClose={() => setShowRelationshipsModal(false)}
          />
        )}

        {showTimelineModal && state.timelines && (
          <TimelineModal
            suspects={SUSPECTS}
            timelines={state.timelines}
            discoveredTimeline={state.discoveredTimeline}
            onClose={() => setShowTimelineModal(false)}
          />
        )}

        {showWitnessModal && state.witnesses && (
          <WitnessModal
            suspects={SUSPECTS}
            witnesses={state.witnesses}
            discoveredWitnesses={state.discoveredWitnesses}
            staffInterviewsLeft={state.staffInterviewsLeft}
            onInterviewStaff={handleInterviewStaff}
            onClose={() => setShowWitnessModal(false)}
          />
        )}

        {/* Mobile-only modals */}
        {isMobile && showDeductionModal && (
          <DeductionBoardModal
            suspects={SUSPECTS}
            weapons={WEAPONS}
            rooms={ROOMS}
            deductionState={deductionState}
            deductionActions={deductionActions}
            summary={deductionSummary}
            onClose={() => setShowDeductionModal(false)}
            onInterrogate={handleInterrogate}
            onExamine={handleExamineWeapon}
            interrogationsLeft={state.interrogationsLeft}
            interrogated={state.interrogated}
            hasForensicsKit={state.hasForensicsKit}
            forensicsUsesLeft={state.forensicsUsesLeft}
            examinedWeapons={state.examinedWeapons}
            gameOver={gameOver}
          />
        )}

        {isMobile && showEvidenceJournal && (
          <EvidenceJournalModal
            clues={state.playerClues}
            suspects={SUSPECTS}
            documents={state.foundDocuments || []}
            onClose={() => setShowEvidenceJournal(false)}
          />
        )}

        {showMoreMenu && (
          <MoreMenuModal
            onClose={() => setShowMoreMenu(false)}
            onOpenDossiers={() => setShowDossier(true)}
            onOpenRelationships={() => setShowRelationshipsModal(true)}
            onInterrogate={() => setShowDeductionModal(true)}
            onOpenWitnesses={() => setShowWitnessModal(true)}
            onOpenTimeline={() => setShowTimelineModal(true)}
            onOpenEvents={() => setShowEventsModal(true)}
            interrogationsLeft={state.interrogationsLeft}
            gameOver={gameOver}
          />
        )}

        {selectedRoom && (
          <RoomActionModal
            room={selectedRoom}
            canBlock={state.hasMasterKey && state.blockedRooms.length === 0}
            onSearch={() => handleSearchRoom(selectedRoom)}
            onBlock={() => handleBlockRoom(selectedRoom)}
            onClose={() => setSelectedRoom(null)}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {showBottomNav && (
        <MobileNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          disabled={gameOver}
          badges={{ evidence: evidenceBadgeCount }}
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
