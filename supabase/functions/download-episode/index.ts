
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

// Fonction pour générer un fichier audio fictif
async function generateFakeAudio(title: string): Promise<Response> {
  try {
    console.log(`Génération d'un fichier audio fictif pour: ${title}`);
    
    // Créer un contenu audio fictif (quelques secondes de silence)
    const audioLength = 300000; // Environ 5 minutes de "silence"
    const audioContent = new Uint8Array(audioLength);
    
    // Ajout d'un message texte dans le fichier pour indiquer qu'il s'agit d'une simulation
    const textEncoder = new TextEncoder();
    const message = `Ceci est une simulation de fichier audio pour: ${title}`;
    const messageBytes = textEncoder.encode(message);
    
    // Copier le message au début du tableau
    for (let i = 0; i < messageBytes.length && i < audioContent.length; i++) {
      audioContent[i] = messageBytes[i];
    }
    
    // Nom de fichier pour le téléchargement
    const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
    
    // Renvoyer le contenu simulé
    return new Response(audioContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la génération du fichier audio fictif:', error);
    return new Response(
      JSON.stringify({ error: `Erreur interne: ${error.message}` }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
}

// Gestionnaire de requêtes
serve(async (req) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  
  try {
    // Vérifier que la méthode est GET
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Méthode non autorisée' }),
        { 
          status: 405, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Récupérer les paramètres de la requête
    const url = new URL(req.url);
    const audioUrl = url.searchParams.get('url');
    const title = url.searchParams.get('title') || 'episode';

    if (!audioUrl) {
      return new Response(
        JSON.stringify({ error: 'URL audio manquante' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Générer un fichier audio fictif avec le titre fourni
    return await generateFakeAudio(title);
  } catch (error) {
    console.error('Erreur lors du traitement de la requête:', error);
    return new Response(
      JSON.stringify({ error: `Erreur serveur: ${error.message}` }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
