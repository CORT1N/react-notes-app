import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Note from './Components/Note';
import Loader from './Components/Loader';
import Aside from './Views/Aside'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


//  CYCLE DE VIE du composant App:
//  1. rendu initial (avec les valeurs d'état initiales)
//  2. exécution de l'action du 'useEffect' : mise à jour de l'état
//  3. ce qui fait automatiquement un nouveau rendu

function App() {
  //déclarer l'état pour stocker les notes
  const [notes, setNotes] = useState(null);

  const apiErrorToast = () => toast.error("Base de données indisponible.", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  async function fetchNotes(){
    try{
      const response = await fetch('/notes?_sort=date&_order=desc');
      const data = await response.json();
      setNotes(data);
    }catch(e){
      console.error("Erreur au chargement des notes - "+e);
      apiErrorToast();
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <BrowserRouter>
      <Aside 
        notes={notes}
        fetchNotes={fetchNotes}
        apiErrorToast={apiErrorToast}
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
                  apiErrorToast={apiErrorToast}
                />
              }
            />
            <Route path="*" element={<Navigate to="/"/>} />
          </Routes>
        ) : <Loader />}
      </main>
      <ToastContainer />
    </BrowserRouter>
  );

}

export default App;
