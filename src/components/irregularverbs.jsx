import '../styles/irregularverbs.css';
import verbs from "../irregularVerbs.json";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const IrregularVerbs = () => {
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("completedVerbs");
    return saved ? JSON.parse(saved) : Array(verbs.length).fill(false);
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("completedVerbs", JSON.stringify(completed));
  }, [completed]);

  const toggleCompletion = (index) => {
    const newCompleted = [...completed];
    newCompleted[index] = !newCompleted[index];
    setCompleted(newCompleted);
  };

  const filteredVerbs = verbs.filter((verb) =>
    verb.infinitive.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verb.past.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verb.pastParticiple.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verb.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header className="irregular-verbs">Irregular <span>Verbs</span></header>

      <input
        type="text"
        placeholder="Search verb..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="verbs-list">
        {filteredVerbs.map((verb, index) => {
          const originalIndex = verbs.findIndex(v => v.infinitive === verb.infinitive);
          return (
            <div key={originalIndex} className={`card ${completed[originalIndex] ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={completed[originalIndex]}
                onChange={() => toggleCompletion(originalIndex)}
                className="verb-checkbox"
              />
              <h1 className="id">{originalIndex + 1}</h1>
              <h2 className="verb-title">{verb.infinitive}</h2>
              <p><strong>Past Simple:</strong> {verb.past}</p>
              <p><strong>Past Participle:</strong> {verb.pastParticiple}</p>
              <p><strong>O'zbekcha:</strong> {verb.translation}</p>
              <p><strong>Talaffuz:</strong> {verb.pronunciation}</p>
            </div>
          );
        })}
      </div>

      <Link to="/" className="go-home">english.go</Link>
    </div>
  );
};

export default IrregularVerbs;
