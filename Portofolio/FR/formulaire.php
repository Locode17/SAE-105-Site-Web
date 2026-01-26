<?php
// On vérifie que le formulaire a bien été soumis
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Nettoyage des données
    $prenom = htmlspecialchars(trim($_POST['prenom']));
    $nom = htmlspecialchars(trim($_POST['nom']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(trim($_POST['message']));

    // 2. Vérification
    if (!empty($prenom) && !empty($nom) && !empty($email) && !empty($message) && filter_var($email, FILTER_VALIDATE_EMAIL)) {

        // Configuration de l'email
        $destinataire = "loicteste79@gmail.com";
        $sujet = "Nouveau message Portfolio de $prenom $nom";

        $contenu_mail = "Nom : $nom $prenom\n";
        $contenu_mail .= "Email : $email\n\n";
        $contenu_mail .= "Message :\n$message\n";

        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        // Envoi
        if (mail($destinataire, $sujet, $contenu_mail, $headers)) {
            // SUCCÈS : Le message que tu voulais
            $titre = "MERCI !";
            $texte = "Votre demande a bien été prise en compte.<br>Merci pour votre confiance.";
        } else {
            // ERREUR SERVEUR
            $titre = "OUPS...";
            $texte = "Une erreur technique est survenue lors de l'envoi.";
        }

    } else {
        // ERREUR CHAMP VIDE
        $titre = "ERREUR";
        $texte = "Veuillez remplir tous les champs correctement.";
    }

} else {
    // Si on arrive ici sans passer par le formulaire, on redirige vers contact
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
      }
      
      .message-box {
          margin-top: -50px; /* Petit ajustement optique */
      }

      h1 {
          font-size: 5em; /* Comme tes titres de pages */
          font-weight: 300;
          margin-bottom: 24px;
          text-transform: uppercase;
      }

      p {
          font-size: 1.2em;
          font-weight: 500;
          margin-bottom: 48px;
          line-height: 1.5;
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
      }

      .btn-retour:hover {
          background-color: #A20C0C;
          color: #D6E6D4; /* Le texte devient vert (couleur de fond) */
      }
  </style>
</head>
<body>

    <div class="container">
        <div class="message-box">
            <h1>[<?php echo $titre; ?>]</h1>
            
            <p><?php echo $texte; ?></p>
            
            <a href="index.html" class="btn-retour">Retourner à mon site</a>
        </div>
    </div>

</body>
</html>