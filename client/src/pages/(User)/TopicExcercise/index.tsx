import { apiGetVocabularyByLessonId } from "@/services/vocabulary.services";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TopicExcercise = () => {
  const [vocabularyData, setVocabularyData] = useState([]);
  const { lessonId } = useParams();

  const getVocabularyByLessonId = async (lessonId) => {
    const response = await apiGetVocabularyByLessonId(lessonId);
    if (response?.data) setVocabularyData(response?.data);
  };
  useEffect(() => {
    getVocabularyByLessonId(lessonId);
  }, [lessonId]);
  console.log(vocabularyData);
  return <div>TopicExcercise</div>;
};

export default TopicExcercise;
