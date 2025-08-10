import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore';
import { User, Student, Grade, Message, Event, Subject } from '@/types';

// Generic CRUD operations
export const createDocument = async <T>(collectionName: string, data: Partial<T>): Promise<string> => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateDocument = async <T>(collectionName: string, id: string, data: Partial<T>): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

export const getDocument = async <T>(collectionName: string, id: string): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  
  return null;
};

export const getDocuments = async <T>(
  collectionName: string, 
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  const q = query(collection(db, collectionName), ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as T));
};

// Student operations
export const getStudentsByTeacher = async (teacherId: string, schoolId: string): Promise<Student[]> => {
  return getDocuments<Student>('students', [
    where('schoolId', '==', schoolId),
    where('isActive', '==', true),
    orderBy('lastName'),
    orderBy('firstName')
  ]);
};

export const getStudentsByParent = async (parentId: string): Promise<Student[]> => {
  return getDocuments<Student>('students', [
    where('parentId', '==', parentId),
    where('isActive', '==', true),
    orderBy('firstName')
  ]);
};

// Grade operations
export const getGradesByStudent = async (studentId: string): Promise<Grade[]> => {
  return getDocuments<Grade>('grades', [
    where('studentId', '==', studentId),
    orderBy('gradedAt', 'desc')
  ]);
};

export const getGradesByTeacher = async (teacherId: string): Promise<Grade[]> => {
  return getDocuments<Grade>('grades', [
    where('teacherId', '==', teacherId),
    orderBy('gradedAt', 'desc')
  ]);
};

export const createGrade = async (gradeData: Partial<Grade>): Promise<string> => {
  return createDocument<Grade>('grades', gradeData);
};

// Message operations
export const getConversations = async (userId: string): Promise<Message[]> => {
  const sentMessages = await getDocuments<Message>('messages', [
    where('senderId', '==', userId),
    orderBy('sentAt', 'desc'),
    limit(50)
  ]);

  const receivedMessages = await getDocuments<Message>('messages', [
    where('receiverId', '==', userId),
    orderBy('sentAt', 'desc'),
    limit(50)
  ]);

  return [...sentMessages, ...receivedMessages].sort((a, b) => 
    new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );
};

export const getMessagesBetweenUsers = async (user1Id: string, user2Id: string): Promise<Message[]> => {
  const messages1 = await getDocuments<Message>('messages', [
    where('senderId', '==', user1Id),
    where('receiverId', '==', user2Id),
    orderBy('sentAt', 'asc')
  ]);

  const messages2 = await getDocuments<Message>('messages', [
    where('senderId', '==', user2Id),
    where('receiverId', '==', user1Id),
    orderBy('sentAt', 'asc')
  ]);

  return [...messages1, ...messages2].sort((a, b) => 
    new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  );
};

export const sendMessage = async (messageData: Partial<Message>): Promise<string> => {
  return createDocument<Message>('messages', messageData);
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
  await updateDocument<Message>('messages', messageId, { isRead: true });
};

// Event operations
export const getSchoolEvents = async (schoolId: string): Promise<Event[]> => {
  return getDocuments<Event>('events', [
    where('schoolId', '==', schoolId),
    where('isPublic', '==', true),
    orderBy('startDate', 'asc')
  ]);
};

export const createEvent = async (eventData: Partial<Event>): Promise<string> => {
  return createDocument<Event>('events', eventData);
};

// Real-time listeners
export const subscribeToMessages = (
  user1Id: string, 
  user2Id: string, 
  callback: (messages: Message[]) => void
) => {
  const q1 = query(
    collection(db, 'messages'),
    where('senderId', '==', user1Id),
    where('receiverId', '==', user2Id),
    orderBy('sentAt', 'asc')
  );

  const q2 = query(
    collection(db, 'messages'),
    where('senderId', '==', user2Id),
    where('receiverId', '==', user1Id),
    orderBy('sentAt', 'asc')
  );

  const unsubscribe1 = onSnapshot(q1, (snapshot) => {
    const messages1 = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Message));

    // Get messages from the other direction as well
    getDocs(q2).then(querySnapshot => {
      const messages2 = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));

      const allMessages = [...messages1, ...messages2].sort((a, b) => 
        new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );

      callback(allMessages);
    });
  });

  return unsubscribe1;
};

export const subscribeToUserConversations = (userId: string, callback: (messages: Message[]) => void) => {
  const q = query(
    collection(db, 'messages'),
    where('receiverId', '==', userId),
    orderBy('sentAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Message));

    callback(messages);
  });
};
