import './App.css';
import { useEffect, useState } from 'react';

//  CYCLE DE VIE du composant App:
//  1. rendu initial (avec les valeurs d'état initiales)
//  2. exécution de l'action du 'useEffect' : mise à jour de l'état
//  3. ce qui fait automatiquement un nouveau rendu

function App() {
  //déclarer l'état pour stocker les notes
  const [notes, setNotes] = useState(null); 

  async function fetchNotes(){
    const response = await fetch('/notes');
    const data = await response.json();
    setNotes(data);
  }

  async function appendNewNote(){
    const response = await fetch("http://localhost:4000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Nouvelle note",
        content: "Nouvelle note",
      })
    });
    fetchNotes();
    console.log("Nouvelle note ajoutée.");
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <aside className='Side'>
        <button onClick={() => {
          appendNewNote();
        }}>
          +
        </button>
        {notes !== null ? notes.map((note) => <a key={note.id} href={"#note="+note.id} className='Note-link'><h3>{note.title}</h3><p>{note.content}</p></a>) : null}
      </aside>
      <main className='Main'></main>
    </>
  );

}

export default App;
