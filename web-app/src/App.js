import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Note from './Components/Note';
import Loader from './Components/Loader';
import Aside from './Views/Aside'

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

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <BrowserRouter>
      <Aside 
        notes={notes}
        fetchNotes={fetchNotes}
      />
      <main className='Main'>
        {notes !== null ? (
          <Routes>
            <Route path="/" element="Sélectionner une note" />
            <Route
              path="/notes/:id" 
              element={
                <Note 
                  notes={notes}
                  fetchNotes={fetchNotes}
                />
              }
            />
            <Route path="*" element={<Navigate to="/"/>} />
          </Routes>
        ) : <Loader />}
      </main>
    </BrowserRouter>
  );

}

export default App;
