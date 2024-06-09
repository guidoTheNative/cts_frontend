import Localbase from 'localbase';

const db = new Localbase('db-cts');

export const saveDataOffline = async (collection, document) => {
  try {
    const uniqueId = `${document.transporterId}_${document.StartDate}`;
    document.id = uniqueId; // Set the unique ID
    await db.collection(collection).add(document, uniqueId);
  } catch (err) {
    console.error('Error saving data to Localbase', err);
  }
};


export const getDataOffline = async (collection) => {
  try {
    return await db.collection(collection).get();
  } catch (err) {
    console.error('Error getting data from Localbase', err);
    return [];
  }
};

export const removeDataOffline = async (collection, documentId) => {
  try {
    await db.collection(collection).doc({ id: documentId }).delete();
  } catch (err) {
    console.error('Error removing data from Localbase', err);
  }
};

export const clearDataOffline = async (collection) => {
  try {
    await db.collection(collection).delete();
  } catch (err) {
    console.error('Error clearing Localbase data', err);
  }
};
