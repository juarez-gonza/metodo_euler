import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.*;
import java.io.FileInputStream;
import java.io.InputStream;

public class Main {
	public static void main(String args[]) throws Exception
	{
		/* toma de input */
		String infile;
		InputStream instream;

		infile = null;

		if (args.length > 0)
			infile = args[0];

		if (infile != null)
			instream = new FileInputStream(infile);
		else
			instream = System.in;

		/* char -> tokens -> parsetree */

		ANTLRInputStream input = new ANTLRInputStream(instream);
		ExprLexer lexer = new ExprLexer(input);
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		ExprParser parser = new ExprParser(tokens);
		ParseTree tree = parser.prog();

		/* preparar visitor */
		CalcVisitor calcv = new CalcVisitor();

		/* método de Euler */


		Float xo = 0.0f;
		Float yo = 1.0f;

		Float xn = 1.0f;
		Float yn = 0.0f;

		int i;
		int n = 10;
		Float h = (xn-xo)/n;
		Float slope;

		calcv.varmapput("x", xo);
		calcv.varmapput("y", yo);

		for (i = 0; i < n; i++) {
			slope = calcv.visit(tree);
			yn = yo + h * slope;

			System.out.printf("\nIteracion %d:\n", i + 1);
			System.out.printf("\txo: %f\t||\tyo: %f\t||\tslope: %f\t||\tyn: %f\n", xo, yo, slope, yn);

			yo = yn;
			xo = xo+h;
			calcv.varmapput("x", xo);
			calcv.varmapput("y", yo);
		}

		System.out.printf("\nValor final (x, y) = (%f, %f)\n", xn, yn);

	}
}
