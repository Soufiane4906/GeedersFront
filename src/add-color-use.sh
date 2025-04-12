#!/bin/bash

# Le texte à insérer
IMPORT_LINE='@use "sass:color";'

# Trouver tous les fichiers .scss
find . -type f -name "*.scss" | while read -r file; do
  # Vérifier si l'import existe déjà
  if ! grep -q "$IMPORT_LINE" "$file"; then
    echo "Ajout de l'import dans : $file"
    # Insérer la ligne au début du fichier (en conservant le contenu existant)
    tmpfile=$(mktemp)
    echo "$IMPORT_LINE" > "$tmpfile"
    cat "$file" >> "$tmpfile"
    mv "$tmpfile" "$file"
  else
    echo "Déjà présent dans : $file"
  fi
done
