const GameOverScreen = ({ winner, solution, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-4 border-red-600 rounded-lg p-8 max-w-lg text-center">
        {winner === 'player' && (
          <>
            <h2 className="text-4xl font-bold mb-4 text-green-400">VICTORY!</h2>
            <p className="text-xl mb-4">You solved the murder and cleared your name!</p>
            <div className="bg-gray-700 p-4 rounded mb-4">
              <p className="text-green-400 font-bold">THE TRUTH:</p>
              {solution.isConspiracy ? (
                <p>CONSPIRACY! {solution.suspects.join(' and ')} worked together with {solution.weapon} in the {solution.room}</p>
              ) : (
                <p>{solution.suspects[0]} murdered the victim with {solution.weapon} in the {solution.room}</p>
              )}
            </div>
          </>
        )}
        {winner === 'opponent' && (
          <>
            <h2 className="text-4xl font-bold mb-4 text-red-400">DEFEATED</h2>
            <p className="text-xl mb-4">Your opponent solved it first... or you guessed wrong.</p>
            <div className="bg-gray-700 p-4 rounded mb-4">
              <p className="text-red-400 font-bold">THE TRUTH WAS:</p>
              {solution.isConspiracy ? (
                <p>CONSPIRACY! {solution.suspects.join(' and ')} with {solution.weapon} in the {solution.room}</p>
              ) : (
                <p>{solution.suspects[0]} with {solution.weapon} in the {solution.room}</p>
              )}
            </div>
          </>
        )}
        {winner === 'police' && (
          <>
            <h2 className="text-4xl font-bold mb-4 text-yellow-400">TIME'S UP!</h2>
            <p className="text-xl mb-4">Police arrested both of you!</p>
            <div className="bg-gray-700 p-4 rounded mb-4">
              <p className="text-yellow-400 font-bold">THE TRUTH:</p>
              {solution.isConspiracy ? (
                <p>CONSPIRACY! {solution.suspects.join(' and ')} with {solution.weapon} in the {solution.room}</p>
              ) : (
                <p>{solution.suspects[0]} with {solution.weapon} in the {solution.room}</p>
              )}
            </div>
          </>
        )}
        <button
          onClick={onRestart}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  )
}

export default GameOverScreen
