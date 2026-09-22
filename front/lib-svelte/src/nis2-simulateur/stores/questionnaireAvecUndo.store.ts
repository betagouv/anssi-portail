import { questionnaireStore } from './questionnaire.store';
import { quiSupporteUndo } from './quiSupporteUndo';

export const questionnaireAvecUndo = quiSupporteUndo(questionnaireStore);
