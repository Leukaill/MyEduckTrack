// Local storage utilities for file management
export interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string; // base64 encoded
  uploadedAt: Date;
  userId: string;
}

const STORAGE_KEY = 'eductrack_files';

export const saveFileToStorage = async (file: File, userId: string): Promise<StoredFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const storedFile: StoredFile = {
          id: generateFileId(),
          name: file.name,
          size: file.size,
          type: file.type,
          data: reader.result as string,
          uploadedAt: new Date(),
          userId,
        };

        const existingFiles = getStoredFiles();
        existingFiles.push(storedFile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingFiles));
        
        resolve(storedFile);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export const getStoredFiles = (): StoredFile[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving stored files:', error);
    return [];
  }
};

export const getFilesByUser = (userId: string): StoredFile[] => {
  return getStoredFiles().filter(file => file.userId === userId);
};

export const getFileById = (fileId: string): StoredFile | null => {
  const files = getStoredFiles();
  return files.find(file => file.id === fileId) || null;
};

export const deleteFile = (fileId: string): boolean => {
  try {
    const files = getStoredFiles();
    const filteredFiles = files.filter(file => file.id !== fileId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredFiles));
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export const generateFileId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const compressImage = async (file: File, maxSizeMB: number = 2): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;
      const ratio = Math.min(800 / width, 600 / height);
      
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      }, file.type, 0.8);
    };

    img.src = URL.createObjectURL(file);
  });
};
