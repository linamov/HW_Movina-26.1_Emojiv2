const { useState, useEffect, useMemo } = React;

function EmojiVoting() {
  const [emojis] = useState(['😀', '😂', '😍', '😢', '😡']);
  const [votes, setVotes] = useState({});
  const [winners, setWinners] = useState([]);

  // завантаження з localStorage при першому рендері
  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem('votes')) || {};
    setVotes(storedVotes);
  }, []);

  // збереження в localStorage при зміні голосів
  useEffect(() => {
    localStorage.setItem('votes', JSON.stringify(votes));
  }, [votes]);

  const vote = (emoji) => {
    setVotes((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));
  };

  const showResults = () => {
    const maxVote = Math.max(...emojis.map(e => votes[e] || 0));
    const result = emojis.filter(e => (votes[e] || 0) === maxVote && maxVote > 0);
    setWinners(result);
  };

  const clearResults = () => {
    localStorage.removeItem('votes');
    setVotes({});
    setWinners([]);
  };

  const totalVotes = useMemo(() => {
    return Object.values(votes).reduce((a, b) => a + b, 0);
  }, [votes]);

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4">Emoji Voting (Hooks)</h1>

      <div className="d-flex justify-content-center gap-3 mb-4">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            className="btn btn-light fs-2"
            onClick={() => vote(emoji)}
          >
            {emoji} <span className="badge bg-secondary">{votes[emoji] || 0}</span>
          </button>
        ))}
      </div>

      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={showResults}>
          Show Results
        </button>
        <button className="btn btn-danger" onClick={clearResults}>
          Clear Results
        </button>
      </div>

      {totalVotes > 0 && (
        <p className="text-muted">Total votes: {totalVotes}</p>
      )}

      {winners.length > 0 && (
        <h3 className="mt-3">
          Winner{winners.length > 1 ? 's' : ''}: {winners.join(', ')} ({votes[winners[0]]} votes)
        </h3>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<EmojiVoting />);
