import { useState, useEffect } from 'react';
import { Student, Grade, Subject } from '@/types';
import { 
  getStudentsByTeacher, 
  getStudentsByParent, 
  getGradesByStudent,
  createGrade 
} from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

export const useStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        let fetchedStudents: Student[] = [];

        if (user.role === 'teacher') {
          fetchedStudents = await getStudentsByTeacher(user.id, user.schoolId);
        } else if (user.role === 'parent') {
          fetchedStudents = await getStudentsByParent(user.id);
        }

        setStudents(fetchedStudents);
        setError(null);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  const addGrade = async (gradeData: Partial<Grade>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      await createGrade({
        ...gradeData,
        teacherId: user.id,
      });
      
      // Optionally refresh students or grades here
    } catch (err) {
      console.error('Error adding grade:', err);
      throw new Error('Failed to add grade');
    }
  };

  return {
    students,
    loading,
    error,
    addGrade,
    refetch: () => {
      if (user) {
        // Re-fetch students
        const fetchStudents = async () => {
          try {
            setLoading(true);
            let fetchedStudents: Student[] = [];

            if (user.role === 'teacher') {
              fetchedStudents = await getStudentsByTeacher(user.id, user.schoolId);
            } else if (user.role === 'parent') {
              fetchedStudents = await getStudentsByParent(user.id);
            }

            setStudents(fetchedStudents);
            setError(null);
          } catch (err) {
            console.error('Error fetching students:', err);
            setError('Failed to load students');
          } finally {
            setLoading(false);
          }
        };

        fetchStudents();
      }
    },
  };
};

export const useStudentGrades = (studentId: string) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;

    const fetchGrades = async () => {
      try {
        setLoading(true);
        const fetchedGrades = await getGradesByStudent(studentId);
        setGrades(fetchedGrades);
        setError(null);
      } catch (err) {
        console.error('Error fetching grades:', err);
        setError('Failed to load grades');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [studentId]);

  return { grades, loading, error };
};
