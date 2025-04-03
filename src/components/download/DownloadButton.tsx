
import React, { useState } from 'react';
import { Episode, DownloadProgress } from '@/types';
import { downloadEpisode } from '@/services/episode/downloader';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSafeFilename, handleDirectDownload } from '@/utils/downloadUtils';
import DownloadComplete from './DownloadComplete';
import DownloadProgressIndicator from './DownloadProgress';
import DownloadError from './DownloadError';

interface DownloadButtonProps {
  episode: Episode;
  onDownloadComplete: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  episode,
  onDownloadComplete
}) => {
  const [downloadState, setDownloadState] = useState<DownloadProgress>({
    episodeId: episode.id,
    progress: 0,
    isComplete: false
  });
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedFilename, setDownloadedFilename] = useState<string | null>(null);

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      // Marquer le début du téléchargement
      setIsDownloading(true);
      
      // Réinitialiser l'état de téléchargement
      setDownloadState({
        episodeId: episode.id,
        progress: 0,
        isComplete: false
      });

      // Créer un nom de fichier propre pour l'épisode
      const fileName = generateSafeFilename(episode.title);
      setDownloadedFilename(fileName);

      // Lancer le téléchargement réel avec mise à jour de la progression
      const success = await downloadEpisode(episode, (progress) => {
        console.log(`Progression du téléchargement: ${progress}%`);
        setDownloadState(prev => ({
          ...prev,
          progress
        }));
      });

      if (success) {
        setDownloadState(prev => ({
          ...prev,
          isComplete: true
        }));
        
        // Message toast amélioré avec plus d'informations
        toast({
          title: "Téléchargement terminé",
          description: (
            <div>
              <p><strong>"{episode.title}"</strong> a été téléchargé sous le nom <strong>{fileName}</strong>.</p>
              <p className="mt-2 text-xs">Le fichier se trouve dans votre dossier de téléchargements par défaut du navigateur :</p>
              <ul className="mt-1 text-xs list-disc list-inside">
                <li>Chrome/Edge: Généralement dans "Téléchargements" ou "Downloads"</li>
                <li>Firefox: Vérifiez dans le gestionnaire de téléchargements (Ctrl+J)</li>
                <li>Safari: Cliquez sur l'icône de téléchargement dans la barre d'outils</li>
              </ul>
            </div>
          ),
          duration: 10000,
        });
        onDownloadComplete();
      } else {
        // Si le téléchargement échoue, proposer un téléchargement direct
        toast({
          title: "Problème de téléchargement",
          description: (
            <div>
              <p>Le téléchargement n'a pas pu être complété correctement.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => handleDirectDownload(episode, onDownloadComplete)}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Télécharger directement
              </Button>
            </div>
          ),
          duration: 10000,
        });
      }
    } catch (error) {
      setDownloadState(prev => ({
        ...prev,
        error: "Erreur de téléchargement"
      }));
      toast({
        title: "Erreur de téléchargement",
        description: (
          <div>
            <p>Une erreur s'est produite lors du téléchargement de l'épisode.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => handleDirectDownload(episode, onDownloadComplete)}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Télécharger directement
            </Button>
          </div>
        ),
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Render different UI based on download state
  if (downloadState.isComplete) {
    return <DownloadComplete filename={downloadedFilename || ''} />;
  }

  if (downloadState.progress > 0 && downloadState.progress < 100) {
    return <DownloadProgressIndicator progress={downloadState.progress} />;
  }

  if (downloadState.error) {
    return (
      <DownloadError 
        onRetry={handleDownload} 
        onDirectDownload={() => handleDirectDownload(episode, onDownloadComplete)} 
      />
    );
  }

  // Default download button
  return (
    <div className="space-y-2 w-full">
      <Button 
        onClick={handleDownload} 
        className="france-inter-bg hover:bg-blue-700 w-full" 
        disabled={isDownloading}
      >
        <Download className="h-4 w-4 mr-2" />
        {isDownloading ? "Préparation..." : "Télécharger"}
      </Button>
      <button 
        onClick={() => handleDirectDownload(episode, onDownloadComplete)}
        className="text-xs text-muted-foreground underline hover:text-blue-600 w-full text-center"
      >
        Télécharger directement
      </button>
    </div>
  );
};

export default DownloadButton;
