import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export const saveFile = async (data: Blob, filePath: string): Promise<void> => {
  console.log('Saving file:', filePath);
  
  if (Capacitor.isNativePlatform()) {
    try {
      const base64Data = await blobToBase64(data);
      
      // Create directory if it doesn't exist
      const directory = filePath.substring(0, filePath.lastIndexOf('/'));
      console.log('Creating directory:', directory);
      
      try {
        await Filesystem.mkdir({
          path: directory,
          directory: Directory.External,
          recursive: true
        });
        console.log('Directory created or already exists');
      } catch (error) {
        console.error('Error creating directory:', error);
      }

      // Save file
      console.log('Writing file...');
      const result = await Filesystem.writeFile({
        path: filePath,
        data: base64Data,
        directory: Directory.External,
        recursive: true,
        encoding: Encoding.UTF8
      });
      
      console.log('File saved successfully:', result);
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  } else {
    // Fallback for web browser
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