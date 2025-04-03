
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { showFileLocationInfo } from '@/utils/downloadUtils';

interface DownloadCompleteProps {
  filename: string;
}

const DownloadComplete: React.FC<DownloadCompleteProps> = ({ filename }) => {
  return (
    <div className="space-y-2 w-full">
      <Button variant="outline" className="bg-green-50 text-green-600 border-green-200 w-full" disabled>
        <Check className="h-4 w-4 mr-2" />
        Téléchargé {filename && `(${filename})`}
      </Button>
      <p className="text-xs text-muted-foreground">
        Le fichier est dans votre dossier de téléchargements du navigateur.
        <button 
          onClick={() => showFileLocationInfo(filename)}
          className="ml-1 text-xs underline hover:text-blue-600"
        >
          Où se trouve mon fichier ?
        </button>
      </p>
    </div>
  );
};

export default DownloadComplete;
