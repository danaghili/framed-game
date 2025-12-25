import { Map, Users, Crosshair, FileText, Clock, Target, AlertTriangle, Play } from 'lucide-react'
import ResponsiveModal from '../responsive/ResponsiveModal'

const Section = ({ icon: Icon, title, children, color = 'text-amber-400' }) => (
  <div className="mb-6 last:mb-0">
    <h3 className={`flex items-center gap-2 text-lg font-bold ${color} mb-2`}>
      {Icon && <Icon className="w-5 h-5" />}
      {title}
    </h3>
    <div className="text-gray-300 text-sm leading-relaxed pl-7">
      {children}
    </div>
  </div>
)

const TutorialModal = ({ onClose, onStartTour }) => {
  return (
    <ResponsiveModal
      isOpen={true}
      onClose={onClose}
      title="HOW TO PLAY"
      size="lg"
      borderColor="border-amber-600"
    >
      <div className="space-y-1">
        {/* Objective */}
        <Section icon={Target} title="Objective" color="text-green-400">
          <p>
            A murder has occurred at Blackwood Manor. You must identify <strong>who</strong> committed
            the crime, <strong>what weapon</strong> was used, and <strong>where</strong> it happened.
          </p>
          <p className="mt-2 text-amber-400">
            Beware: Sometimes two killers work together in a conspiracy!
          </p>
        </Section>

        {/* Searching */}
        <Section icon={Map} title="Search Rooms">
          <p>
            Click on rooms in the manor to search for evidence. Each search costs <strong>1 turn</strong>.
            You may find clues, documents, or special items like the Forensics Kit or Master Key.
          </p>
        </Section>

        {/* Investigation */}
        <Section icon={Users} title="Interrogate & Investigate">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Interrogate</strong> suspects to reveal their timeline and relationships</li>
            <li><strong>Examine weapons</strong> with the Forensics Kit to rule them in or out</li>
            <li><strong>Interview staff</strong> to gather witness statements</li>
            <li>Check <strong>Dossiers</strong> for suspect backgrounds and motives</li>
          </ul>
        </Section>

        {/* Deduction */}
        <Section icon={FileText} title="Track Your Deductions">
          <p>
            Use the Deduction Board to mark suspects, weapons, and rooms:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><span className="text-green-400">YES</span> - You suspect this is the answer</li>
            <li><span className="text-yellow-400">Maybe</span> - Still under consideration</li>
            <li><span className="text-red-400">No</span> - Ruled out by evidence</li>
          </ul>
        </Section>

        {/* Time Pressure */}
        <Section icon={Clock} title="Race Against Time" color="text-red-400">
          <p>
            You have limited turns, and a rival detective is also investigating!
            If they solve it first, you lose. If time runs out, the case goes cold.
          </p>
        </Section>

        {/* Accusation */}
        <Section icon={Crosshair} title="Make Your Accusation" color="text-red-400">
          <p>
            When you're confident, click <strong>Make Accusation</strong> to name the killer(s),
            weapon, and room.
          </p>
          <div className="flex items-start gap-2 mt-2 p-2 bg-red-900/30 rounded border border-red-600">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-red-300">You only get ONE chance! A wrong accusation means you lose.</span>
          </div>
        </Section>

        {/* Start Tour Button */}
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={onStartTour}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg font-bold transition-colors"
          >
            <Play className="w-5 h-5" />
            Take Interactive Tour
          </button>
        </div>
      </div>
    </ResponsiveModal>
  )
}

export default TutorialModal
