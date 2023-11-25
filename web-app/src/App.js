import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate} from 'react-router-dom';
import Note from './Components/Note';
import Loader from './Components/Loader';

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
        {notes !== null ? (
          <>
            <button onClick={appendNewNote} className='Button Button-create-note'>+</button>
            <ol className='Note-list'>
              {notes.map((note) => (
                <li key={note.id}>
                  <Link to={"/notes/"+note.id} className='Note-link'>
                    {note.title}
                  </Link>
                </li>
              ))}
            </ol>
          </>
        ) : <Loader />}
      </aside>
      <main className='Main'>
        <Routes>
          <Route path="/" element="Sélectionner une note" />
          <Route
            path="/notes/:id" 
            element={
              <Note 
                notes={notes}
              />
            }
          />
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
      </main>
    </BrowserRouter>
  );

}

export default App;
