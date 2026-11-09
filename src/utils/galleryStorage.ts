import { GalleryPhoto } from '../types';
import { DEFAULT_GALLERY_PHOTOS } from '../data/defaultGallery';

const DB_NAME = 'dija_gallery_db';
const DB_VERSION = 1;
const STORE_NAME = 'photos';
const LOCAL_STORAGE_KEY = 'dija_gallery_photos_backup';

/**
 * Open or initialize IndexedDB connection
 */
const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB indisponível neste navegador.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Erro ao abrir o banco de dados da galeria.'));
    };
  });
};

/**
 * Fallback to LocalStorage if IndexedDB fails
 */
const getLocalStoragePhotos = (): GalleryPhoto[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return DEFAULT_GALLERY_PHOTOS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_GALLERY_PHOTOS;
  } catch {
    return DEFAULT_GALLERY_PHOTOS;
  }
};

const setLocalStoragePhotos = (photos: GalleryPhoto[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(photos));
  } catch {
    // quota exceeded or blocked
  }
};

/**
 * Fetch all gallery photos, seeding with defaults if empty
 */
export const getGalleryPhotos = async (): Promise<GalleryPhoto[]> => {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = async () => {
        let photos = request.result as GalleryPhoto[];
        if (!photos || photos.length === 0) {
          // Seed with default photos
          photos = await seedDefaultPhotos(db);
        }
        // Return sorted with newest first
        photos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLocalStoragePhotos(photos);
        resolve(photos);
      };

      request.onerror = () => {
        resolve(getLocalStoragePhotos());
      };
    });
  } catch {
    return getLocalStoragePhotos();
  }
};

/**
 * Seed initial 23 studio photos
 */
const seedDefaultPhotos = async (db: IDBDatabase): Promise<GalleryPhoto[]> => {
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    DEFAULT_GALLERY_PHOTOS.forEach((photo) => {
      store.put(photo);
    });

    transaction.oncomplete = () => {
      resolve([...DEFAULT_GALLERY_PHOTOS]);
    };

    transaction.onerror = () => {
      resolve([...DEFAULT_GALLERY_PHOTOS]);
    };
  });
};

/**
 * Add or update a photo in the gallery
 */
export const saveGalleryPhoto = async (photo: GalleryPhoto): Promise<GalleryPhoto> => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(photo);

      request.onsuccess = () => {
        // sync with local storage backup
        const current = getLocalStoragePhotos();
        const existingIdx = current.findIndex((p) => p.id === photo.id);
        if (existingIdx >= 0) {
          current[existingIdx] = photo;
        } else {
          current.unshift(photo);
        }
        setLocalStoragePhotos(current);
        resolve(photo);
      };

      request.onerror = () => {
        reject(request.error || new Error('Não foi possível salvar a foto.'));
      };
    });
  } catch {
    // Fallback to localStorage
    const current = getLocalStoragePhotos();
    const existingIdx = current.findIndex((p) => p.id === photo.id);
    if (existingIdx >= 0) {
      current[existingIdx] = photo;
    } else {
      current.unshift(photo);
    }
    setLocalStoragePhotos(current);
    return photo;
  }
};

/**
 * Delete a photo by ID
 */
export const deleteGalleryPhoto = async (id: string): Promise<boolean> => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        const current = getLocalStoragePhotos().filter((p) => p.id !== id);
        setLocalStoragePhotos(current);
        resolve(true);
      };

      request.onerror = () => {
        reject(request.error || new Error('Não foi possível excluir a foto.'));
      };
    });
  } catch {
    const current = getLocalStoragePhotos().filter((p) => p.id !== id);
    setLocalStoragePhotos(current);
    return true;
  }
};

/**
 * Reset gallery to default studio collection
 */
export const resetGalleryToDefaults = async (): Promise<GalleryPhoto[]> => {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.clear();

      DEFAULT_GALLERY_PHOTOS.forEach((photo) => {
        store.put(photo);
      });

      transaction.oncomplete = () => {
        setLocalStoragePhotos(DEFAULT_GALLERY_PHOTOS);
        resolve([...DEFAULT_GALLERY_PHOTOS]);
      };
    });
  } catch {
    setLocalStoragePhotos(DEFAULT_GALLERY_PHOTOS);
    return [...DEFAULT_GALLERY_PHOTOS];
  }
};
