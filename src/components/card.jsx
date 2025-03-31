import React from "react";
import verbs from "./irregularVerbs.json";

const App = () => {
  return (
    <div className="container">
      <header className="header">Irregular <span>Verbs</span></header>
      <div className="verbs-list">
        {verbs.map((verb, index) => (
          <div key={index} className="card">
            <h1 className="id">{index + 1}</h1>
            <h2 className="verb-title">{verb.infinitive}</h2>
            <p><strong>Past Simple:</strong> {verb.past}</p>
            <p><strong>Past Participle:</strong> {verb.pastParticiple}</p>
            <p><strong>O'zbekcha:</strong> {verb.translation}</p>
            <p><strong>Talaffuz:</strong> {verb.pronunciation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
