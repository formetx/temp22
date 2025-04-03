
import { Episode } from '@/types';
import { downloadEpisode } from '@/services/episode/downloader';
import { toast } from '@/hooks/use-toast';

/**
 * Generates a safe filename from an episode title
 */
export const generateSafeFilename = (title: string): string => {
  return `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
};

/**
 * Handles direct download of an episode without progress tracking
 */
export const handleDirectDownload = async (
  episode: Episode,
  onComplete?: () => void
): Promise<boolean> => {
  try {
    const fileName = generateSafeFilename(episode.title);
    
    // Use download function but with a simpler progress function
    const success = await downloadEpisode(episode, () => {});

    if (success) {
      toast({
        title: "Téléchargement direct terminé",
        description: `Le fichier ${fileName} a été téléchargé.`,
        duration: 5000,
      });
      
      if (onComplete) onComplete();
      return true;
    }
    return false;
  } catch (error) {
    toast({
      title: "Erreur de téléchargement direct",
      description: "Impossible de télécharger le fichier.",
      variant: "destructive",
      duration: 5000,
    });
    return false;
  }
};

/**
 * Shows info about downloaded file location
 */
export const showFileLocationInfo = (fileName: string) => {
  toast({
    title: "Emplacement du fichier",
    description: (
      <div>
        <p>Votre fichier a été téléchargé sous le nom <strong>{fileName}</strong>.</p>
        <p className="mt-2">Pour trouver ce fichier :</p>
        <ul className="mt-1 list-disc list-inside">
          <li>Chrome/Edge : Dossier "Téléchargements" ou "Downloads"</li>
          <li>Firefox : Ouvrez le gestionnaire de téléchargements (Ctrl+J)</li>
          <li>Safari : Cliquez sur l'icône de téléchargement</li>
        </ul>
      </div>
    ),
    duration: 8000,
  });
};
