using lamp.app.questions from '../db/questions';

service answerService {
    entity questions_optn as projection on questions.questions_optn;

    entity answer as projection on questions.answers;    

}
