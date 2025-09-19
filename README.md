Créer un fichier `.firebaserc` à la racine du projet avec le contenu suivant :

```
{
  "projects": {
    "default": "votre-id-de-projet-firebase"
  }
}

Créer un fichier `.env.local` à la racine du projet avec les variables d'environnement Firebase (remplacer les valeurs par celles de votre projet Firebase) :

```
# Firebase (clés utilisables côté client, donc préfixe NEXT_PUBLIC_)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=NAME.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=NAME
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=NAME.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Environnement Firebase (optionnel)
NEXT_PUBLIC_FIREBASE_EMULATOR=true