<?php
// --- ZONE DE TRAITEMENT PHP (S'exécute sur le serveur avant d'envoyer la page) ---

// 1. Initialisation des variables
// On crée ces variables vides pour éviter une erreur "Undefined variable" si on essaie de les afficher plus bas sans qu'elles existent.
$titre = "";
$texte = "";

// 2. Vérification de la soumission du formulaire
// $_SERVER["REQUEST_METHOD"] contient la méthode utilisée pour accéder à la page.
// Si c'est "POST", cela signifie que l'utilisateur a cliqué sur le bouton "Envoyer" d'un formulaire.
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- PHASE DE RÉCUPÉRATION ET SÉCURISATION (NETTOYAGE) ---
    
    // $_POST['...'] récupère la valeur saisie dans le champ HTML correspondant (name="prenom").
    // trim(...) : Supprime les espaces inutiles au début et à la fin (ex: " Jean " devient "Jean").
    // htmlspecialchars(...) : Convertit les caractères spéciaux (comme < ou >) en code HTML inoffensif.
    // C'est CRUCIAL pour empêcher les failles XSS (injection de code malveillant).
    $prenom = htmlspecialchars(trim($_POST['prenom']));
    $nom = htmlspecialchars(trim($_POST['nom']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));

    // --- PHASE DE VALIDATION ---

    // On vérifie si les variables ne sont PAS vides (!empty).
    // Le symbole && signifie "ET" (toutes les conditions doivent être vraies).
    if (!empty($prenom) && !empty($nom) && !empty($email) && !empty($message)) {

        // --- SCÉNARIO SUCCÈS : Tout est rempli correctement ---

        // Construction du titre du message.
        // strtoupper(...) met la chaîne en MAJUSCULES.
        // Le point (.) sert à coller (concaténer) les bouts de texte ensemble.
        $titre = "MERCI " . strtoupper($prenom) . " !";

        // Construction du corps du message.
        // ucfirst(...) met la Première Lettre en majuscule (Jean).
        $texte = "Bonjour <strong>" . ucfirst($prenom) . " " . strtoupper($nom) . "</strong>,<br><br>";
        
        // L'opérateur .= signifie "ajouter à la suite de ce qu'il y a déjà dans la variable".
        $texte .= "Votre demande a bien été prise en compte.<br>";
        $texte .= "Nous avons bien noté votre email : <em>" . $email . "</em>";

    } else {
        // --- SCÉNARIO ERREUR : Un ou plusieurs champs sont vides ---
        
        $titre = "ERREUR";
        $texte = "Veuillez remplir tous les champs du formulaire.";
    }

} else {
    // --- PROTECTION D'ACCÈS DIRECT ---
    
    // Si l'utilisateur essaie d'ouvrir ce fichier PHP directement dans la barre d'adresse (sans passer par le formulaire),
    // on le redirige immédiatement vers la page du formulaire (contact.html).
    header("Location: contact.html");
    
    // exit arrête immédiatement l'exécution du script. C'est une sécurité pour qu'aucun code en dessous ne s'exécute.
    exit;
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirmation</title>
  
  <link rel="stylesheet" href="style.css">
  
  <style>
      /* --- CSS INTERNE POUR CETTE PAGE --- */
      
      body {
          /* Flexbox permet de gérer facilement l'alignement */
          display: flex;
          flex-direction: column; /* Les éléments s'empilent verticalement */
          align-items: center;    /* Centre horizontalement */
          justify-content: center;/* Centre verticalement */
          height: 100vh;          /* Force le corps à prendre 100% de la hauteur de l'écran */
          text-align: center;     /* Centre le texte */
          overflow: hidden;       /* Cache les barres de défilement */
          padding: 20px;          /* Ajoute un peu d'espace sur les bords */
      }
      
      .message-box {
          /* Remonte légèrement le bloc pour un meilleur effet visuel */
          margin-top: -50px;
          max-width: 800px; /* Largeur maximale pour ne pas être trop large sur grand écran */
      }

      h1 {
          font-size: 5em;       /* Très gros titre */
          font-weight: 300;     /* Police fine */
          margin-bottom: 24px;  /* Espace sous le titre */
          text-transform: uppercase; /* Force les majuscules (redondant avec PHP mais bon pour le style) */
          line-height: 1;       /* Resserre l'espacement des lignes */
      }

      p {
          font-size: 1.4em;     /* Texte plus grand que la normale */
          font-weight: 500;     /* Graisse moyenne */
          margin-bottom: 48px;  /* Espace sous le paragraphe avant le bouton */
          line-height: 1.6;     /* Espace entre les lignes pour la lisibilité */
      }

      /* Style du bouton retour */
      .btn-retour {
          text-decoration: none; /* Enlève le soulignement du lien */
          font-weight: 700;      /* Texte en gras */
          font-size: 18px;
          border: 2px solid #A20C0C; /* Bordure rouge foncé */
          padding: 12px 32px;    /* Espace intérieur du bouton */
          transition: all 0.3s ease; /* Animation douce au survol */
          display: inline-block; /* Permet d'appliquer padding/margin correctement */
          text-transform: uppercase;
          color: black;          /* Couleur du texte par défaut */
      }

      /* Effet quand on passe la souris sur le bouton */
      .btn-retour:hover {
          background-color: #A20C0C; /* Le fond devient rouge */
          color: #D6E6D4;            /* Le texte devient vert pâle/blanc */
      }

      /* --- MEDIA QUERIES (ADAPTATION MOBILE) --- */
      /* Si l'écran fait moins de 768px de large (tablettes et mobiles) */
      @media (max-width: 768px) {
          h1 { font-size: 3em; } /* On réduit la taille du titre */
          p { font-size: 1.1em; } /* On réduit la taille du texte */
      }
  </style>
</head>
<body>

    <div class="container">
        <div class="message-box">
            <h1>[<?php echo $titre; ?>]</h1>
            
            <p><?php echo $texte; ?></p>
            
            <a href="index.html" class="btn-retour">Retour au site</a>
        </div>
    </div>

</body>
</html>