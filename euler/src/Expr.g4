grammar Expr;		

prog:	stat+
	;

stat:	expr
	;

expr:	expr op=('*'|'/') expr		# muldiv
	| expr op=('+'|'-') expr	# addsub
	| INT				# int
	| ID				# id
	| '(' expr ')'			# parens
	;

MUL: '*';
DIV: '/';
ADD: '+';
SUB: '-';
ID : [a-zA-Z]+;
INT: [0-9]+ ;
NL: [\r\n]+ ;
WS: [ \t]+ -> skip ;
