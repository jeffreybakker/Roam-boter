grammar aiJson;

startrule : node EOF;

node        : condition | actionblock;

condition   : LBR CONDITION SC conditiondata RBR ;
conditiondata : LBR type_id COM childtrue COM childfalse COM attributes RBR ;
childtrue   : CHILDTRUE SC node ;
childfalse  : CHILDFALSE SC node ;


actionblock : LBR ACTIONBLOCK SC actionlist RBR ;
actionlist  : LB action (COM action)* RB ;
action      : LBR type_id COM attributes RBR;


attributes          : ATTRIBUTES SC attributevalues ;
attributevalues     : LBR (attributevalue (COM attributevalue)*)? RBR ;
attributevalue      : APHSTRING SC value;
value               : APHSTRING | INTEGER;

type_id     : TYPE_ID SC INTEGER ;






ROOT        : APH 'root' APH ;
CONDITION   : APH 'condition' APH ;

CHILDTRUE   : APH 'child-true' APH ;
CHILDFALSE  : APH 'child-false' APH ;

ACTIONBLOCK : APH 'actionblock' APH ;

TYPE_ID     : APH 'type-id' APH ;
ATTRIBUTES  : APH 'attributes' APH ;
APHSTRING   : APH STRING APH;




INTEGER : DIGIT+ ;
STRING : ALPHANUMERIC+ ;
ALPHANUMERIC : CHAR | DIGIT ;

CHAR : [a-zA-Z] ;
DIGIT  : [0-9];

APH : '"';
COM : ',';
SC  : ':';
LBR : '{';
RBR : '}';
LB : '[';
RB : ']';

WS : [ \t\n]+ -> skip;
