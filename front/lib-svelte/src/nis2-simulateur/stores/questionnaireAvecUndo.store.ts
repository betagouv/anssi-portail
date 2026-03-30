import { quiSupporteUndo } from './quiSupporteUndo';
import { questionnaireStore } from './questionnaire.store';

export const questionnaireAvecUndo = quiSupporteUndo(questionnaireStore);
