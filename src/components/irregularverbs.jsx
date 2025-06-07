import '../styles/irregularverbs.css';
import verbs from "../jsonFiles/irregularVerbs.json";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BsLightningChargeFill } from 'react-icons/bs';

const IrregularVerbs = () => {
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("completedVerbs");
    return saved ? JSON.parse(saved) : Array(verbs.length).fill(false);
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    localStorage.setItem("completedVerbs", JSON.stringify(completed));
  }, [completed]);

  const toggleCompletion = (index) => {
    const newCompleted = [...completed];
    newCompleted[index] = !newCompleted[index];
    setCompleted(newCompleted);
  };

  const filteredVerbs = verbs.filter((verb, index) => {
    const matchesSearch =
      verb.infinitive.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verb.past.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verb.pastParticiple.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verb.translation.toLowerCase().includes(searchTerm.toLowerCase());

    const isCompleted = completed[index];

    if (filterStatus === "completed") return matchesSearch && isCompleted;
    if (filterStatus === "notCompleted") return matchesSearch && !isCompleted;
    return matchesSearch;
  });

  return (
    <div className="verbs-container">
      <header className="irregular-verbs">Irregular <span>Verbs</span></header>

      <input
        type="text"
        placeholder="Search verb..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="filter-buttons">
        <button onClick={() => setFilterStatus("all")} className={filterStatus === "all" ? "active" : ""}>All</button>
        <button onClick={() => setFilterStatus("completed")} className={filterStatus === "completed" ? "active" : ""}>Completed</button>
        <button onClick={() => setFilterStatus("notCompleted")} className={filterStatus === "notCompleted" ? "active" : ""}>Not Completed</button>
      </div>

      <div className="verbs-list">
        {filteredVerbs.map((verb) => {
          const originalIndex = verbs.findIndex(v => v.infinitive === verb.infinitive);
          const isChecked = completed[originalIndex];

          return (
            <div key={originalIndex} className={`card ${isChecked ? 'completed' : ''}`}>
              <div className="card-header">
                <div
                  className="thunder-icon"
                  onClick={() => toggleCompletion(originalIndex)}
                  title={isChecked ? "Completed" : "Mark as complete"}
                >
                  <BsLightningChargeFill />
                </div>
                <span className="id">{originalIndex + 1}</span>
              </div>

              <h2 className="verb-title">{verb.infinitive}</h2>
              <p><strong>Past Simple:</strong> {verb.past}</p>
              <p><strong>Past Participle:</strong> {verb.pastParticiple}</p>
              <p><strong>O'zbekcha:</strong> {verb.translation}</p>
              <p><strong>Talaffuz:</strong> {verb.pronunciation}</p>
            </div>
          );
        })}
      </div>

      <footer className="footer">
        &copy; {new Date().getFullYear()} engnoraa |
        <Link to="/"> Go Back</Link>
      </footer>
    </div>
  );
};

export default IrregularVerbs;
