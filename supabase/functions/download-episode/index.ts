
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

// Fonction pour simuler le téléchargement d'un épisode
async function simulateDownloadEpisode(url: string): Promise<Response> {
  try {
    console.log(`Simulation de téléchargement depuis: ${url}`);
    
    // Créer un contenu audio fictif (quelques secondes de silence)
    const audioContent = new Uint8Array(10000); // Un petit fichier vide
    
    // Renvoyer le contenu simulé
    return new Response(audioContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la simulation du téléchargement:', error);
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

    // Récupérer l'URL audio depuis les paramètres de recherche
    const url = new URL(req.url);
    const audioUrl = url.searchParams.get('url');

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

    // Simuler le téléchargement d'un fichier audio
    return await simulateDownloadEpisode(audioUrl);
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
