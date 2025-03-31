import '../styles/irregularverbs.css';
import verbs from "../irregularVerbs.json";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const IrregularVerbs = () => {
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("completedVerbs");
    return saved ? JSON.parse(saved) : Array(verbs.length).fill(false);
  });

  useEffect(() => {
    localStorage.setItem("completedVerbs", JSON.stringify(completed));
  }, [completed]);

  const toggleCompletion = (index) => {
    const newCompleted = [...completed];
    newCompleted[index] = !newCompleted[index];
    setCompleted(newCompleted);
  };

  return (
    <div className="container">
      <header className="irregular-verbs">Irregular <span>Verbs</span></header>
      <div className="verbs-list">
        {verbs.map((verb, index) => (
          <div key={index} className={`card ${completed[index] ? 'completed' : ''}`}>
            <input 
              type="checkbox" 
              checked={completed[index]} 
              onChange={() => toggleCompletion(index)} 
              className="verb-checkbox"
            />
            <h1 className="id">{index + 1}</h1>
            <h2 className="verb-title">{verb.infinitive}</h2>
            <p><strong>Past Simple:</strong> {verb.past}</p>
            <p><strong>Past Participle:</strong> {verb.pastParticiple}</p>
            <p><strong>O'zbekcha:</strong> {verb.translation}</p>
            <p><strong>Talaffuz:</strong> {verb.pronunciation}</p>
          </div>
        ))}
      </div>
      <Link to="/" className='go-home'>english.go</Link>
    </div>
  );
};

export default IrregularVerbs;
