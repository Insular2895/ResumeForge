"""Lanceur de compatibilité pour tester le renderer avec le pipeline CV V3.

L'ancien script entretenait un second pipeline (2 expériences + leadership +
skills statiques). Garder un seul chemin d'exécution évite que le test manuel
diverge de la génération CLI/web réelle.
"""

from src.generate_cv import main


if __name__ == "__main__":
    main()
