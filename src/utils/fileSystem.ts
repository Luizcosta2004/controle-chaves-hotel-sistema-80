import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

export const saveFile = async (data: Blob, filePath: string): Promise<void> => {
  console.log('Saving file:', filePath);
  
  if (Capacitor.isNativePlatform()) {
    try {
      const base64Data = await blobToBase64(data);
      
      // Criar diretório se não existir
      const directory = filePath.substring(0, filePath.lastIndexOf('/'));
      await Filesystem.mkdir({
        path: directory,
        directory: Directory.Documents,
        recursive: true
      });

      // Salvar arquivo
      await Filesystem.writeFile({
        path: filePath,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true
      });
      
      console.log('File saved successfully to:', filePath);
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  } else {
    // Fallback para navegador web
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop() || 'export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};