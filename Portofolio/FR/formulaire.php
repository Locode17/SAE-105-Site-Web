<?php
// On initialise les variables pour éviter les erreurs d'affichage
$titre = "";
$texte = "";

// On vérifie que le formulaire a bien été soumis via la méthode POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Récupération et nettoyage des données (Sécurité XSS)
    // On utilise htmlspecialchars pour empêcher d'injecter du code dans la page
    $prenom = htmlspecialchars(trim($_POST['prenom']));
    $nom = htmlspecialchars(trim($_POST['nom']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));

    // 2. Vérification simple : est-ce que les champs sont remplis ?
    if (!empty($prenom) && !empty($nom) && !empty($email) && !empty($message)) {

        // SUCCÈS : On construit le message personnalisé
        // strtoupper met le nom en majuscules, ucfirst met la 1ère lettre du prénom en majuscule
        $titre = "MERCI " . strtoupper($prenom) . " !";
        $texte = "Bonjour <strong>" . ucfirst($prenom) . " " . strtoupper($nom) . "</strong>,<br><br>";
        $texte .= "Votre demande a bien été prise en compte.<br>";
        $texte .= "Nous avons bien noté votre email : <em>" . $email . "</em>";

    } else {
        // ERREUR : Champs vides
        $titre = "ERREUR";
        $texte = "Veuillez remplir tous les champs du formulaire.";
    }

} else {
    // Si quelqu'un essaie d'ouvrir la page sans passer par le formulaire
    header("Location: contact.html");
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
      /* Style spécifique pour centrer ce message au milieu de l'écran */
      body {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh; /* Prend toute la hauteur de l'écran */
          text-align: center;
          overflow: hidden; /* Pas de scroll */
          padding: 20px;
      }
      
      .message-box {
          margin-top: -50px;
          max-width: 800px;
      }

      h1 {
          font-size: 5em; 
          font-weight: 300;
          margin-bottom: 24px;
          text-transform: uppercase;
          line-height: 1;
      }

      p {
          font-size: 1.4em;
          font-weight: 500;
          margin-bottom: 48px;
          line-height: 1.6;
      }

      /* Style du bouton retour */
      .btn-retour {
          text-decoration: none;
          font-weight: 700;
          font-size: 18px;
          border: 2px solid #A20C0C;
          padding: 12px 32px;
          transition: all 0.3s ease;
          display: inline-block;
          text-transform: uppercase;
      }

      .btn-retour:hover {
          background-color: #A20C0C;
          color: #D6E6D4; 
      }

      /* Responsive pour le message */
      @media (max-width: 768px) {
          h1 { font-size: 3em; }
          p { font-size: 1.1em; }
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