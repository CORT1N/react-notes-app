import { useEffect } from "react";

export const useDebouncedEffect = (effect, deps, delay) => {
  useEffect(() => {
    // À chaque rendu ou changement de dépendances, cette fonction sera appelée.
    // Elle crée un nouveau délai pour exécuter l'effet après le délai spécifié.
    const handler = setTimeout(() => {
      // Appel de l'effet fourni en paramètre (par exemple, la fonction pour sauvegarder la note).
      effect();
    }, delay);

    // Cette partie est appelée lorsqu'un nouveau rendu ou changement de dépendances se produit,
    // avant le nouvel appel de la fonction useEffect. Elle nettoie le délai précédent pour éviter des exécutions multiples.
    return () => {
      clearTimeout(handler);
    };

    // On inclut toutes les dépendances, ainsi que le délai, dans le tableau de dépendances de useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
};