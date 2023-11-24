import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

//  CYCLE DE VIE du composant App:
//  1. rendu initial (avec les valeurs d'état initiales)
//  2. exécution de l'action du 'useEffect' : mise à jour de l'état
//  3. ce qui fait automatiquement un nouveau rendu

function App() {
  //déclarer l'état pour stocker les notes
  const [notes, setNotes] = useState(null); 

  async function fetchNotes(){
    const response = await fetch('/notes?_sort=id&_order=desc');
    const data = await response.json();
    setNotes(data);
  }

  async function appendNewNote(){
    const response = await fetch("/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Nouvelle note",
        content: "",
      })
    });
    fetchNotes();
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <BrowserRouter>
      <aside className='Side'>
        <button onClick={appendNewNote} className='Button-create-note'>+</button>
        {notes !== null ? (
          <ol className='Note-list'>
            {notes.map((note) => (
              <li key={note.id}>
                <Link to={"/notes/"+note.id} className='Note-link'>
                  {note.title}
                </Link>
              </li>
            ))}
          </ol>
        ) : null}
      </aside>
      <main className='Main'></main>
    </BrowserRouter>
  );

}

export default App;
