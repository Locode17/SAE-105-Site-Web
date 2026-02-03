<?php
// --- PHP PROCESSING ZONE ---

$titre = "";
$texte = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- SANITIZATION ---
    $prenom = htmlspecialchars(trim($_POST['prenom']));
    $nom = htmlspecialchars(trim($_POST['nom']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));

    // --- VALIDATION ---

    if (!empty($prenom) && !empty($nom) && !empty($email) && !empty($message)) {

        // --- SUCCESS SCENARIO ---

        $titre = "THANK YOU " . strtoupper($prenom) . " !";
        $texte = "Hello <strong>" . ucfirst($prenom) . " " . strtoupper($nom) . "</strong>,<br><br>";
        $texte .= "Your request has been successfully received.<br>";
        $texte .= "We have noted your email: <em>" . $email . "</em>";

    } else {
        // --- ERROR SCENARIO ---
        
        $titre = "ERROR";
        $texte = "Please fill in all fields of the form.";
    }

} else {
    // --- DIRECT ACCESS PROTECTION ---
    header("Location: contact.html");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirmation</title>
  
  <link rel="stylesheet" href="style.css">
  
  <style>
      /* --- INTERNAL CSS FOR THIS PAGE --- */
      
      body {
          display: flex;
          flex-direction: column; 
          align-items: center;    
          justify-content: center;
          height: 100vh;          
          text-align: center;     
          overflow: hidden;       
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

      /* Back button style */
      .btn-retour {
          text-decoration: none; 
          font-weight: 700;      
          font-size: 18px;
          border: 2px solid #A20C0C; 
          padding: 12px 32px;    
          transition: all 0.3s ease; 
          display: inline-block; 
          text-transform: uppercase;
          color: black;          
      }

      .btn-retour:hover {
          background-color: #A20C0C; 
          color: #D6E6D4;            
      }

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
            
            <a href="index.html" class="btn-retour">Back to site</a>
        </div>
    </div>

</body>
</html>