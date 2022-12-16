namespace lamp.app.questions;

// using { Country } from '@sap/cds/common';
// type BusinessKey : String(10);
type SDate : DateTime;
type LText : String(1024);
type SText : String(20);
type CText : String(100);
type BText : String(1);

entity questions_optn {
    key ID: Integer;
    ANSWERS: Composition of one answers on ANSWERS.qus_ID =$self; 
    qus_text: LText;
    qus_option1: CText;
    qus_option2: CText;
    qus_option3: CText;
    qus_option4: CText;
    qus_type: BText;
    qus_created: SText;
    qus_date: SDate;
};

entity answers {
    
    key qus_ID: Association to questions_optn;
    key ans_ID: Integer;
    ans_text: CText;
    ans_created: SText;
    ans_date: SDate;
}


