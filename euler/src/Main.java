import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.*;

import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

import java.util.Scanner;

public class Main {
	public static void main(String args[]) throws Exception
	{
		/* =========== toma de input =========== */
		Scanner input;
		String input_eq;
		InputStream input_eq_stream;
		Float xo;
		Float yo;
		Float xi;
		Float yi;
		Float h;
		Float f;
		int n;

		/* el scanner lee de stdin */
		input = new Scanner(System.in);

		System.out.print("Ingresar ecuación a resolver por método de euler: ");
		input_eq = input.next();
		input_eq_stream = new ByteArrayInputStream(input_eq.getBytes(StandardCharsets.UTF_8));

		System.out.print("Ingresar valor inicial de x: ");
		xo = input.nextFloat();
		System.out.print("Ingresar valor inicial de y: ");
		yo = input.nextFloat();
		System.out.print("Ingresar valor final de x (donde se quiere averiguar el valor de y): ");
		xi = input.nextFloat();

		System.out.print("Cantidad de iteraciones hasta llegar a valor final de x: ");
		n = input.nextInt();

		h = (xi - xo) / n;
		yi = 0.0f; /* se setea solo para que el compilador no moleste */

		/* =========== char -> tokens -> parsetree =========== */

		ANTLRInputStream inputstream = new ANTLRInputStream(input_eq_stream);
		ExprLexer lexer = new ExprLexer(inputstream);
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		ExprParser parser = new ExprParser(tokens);
		ParseTree tree = parser.prog();

		/* =========== preparar visitor =========== */
		CalcVisitor calcv = new CalcVisitor();

		/* =========== método de Euler =========== */

		calcv.varmapput("x", xo);
		calcv.varmapput("y", yo);

		int i;
		for (i = 0; i < n; i++) {
			f = calcv.visit(tree);
			yi = yo + h * f;

			System.out.printf("\nIteracion %d:\n", i + 1);
			System.out.printf("\txo: %f\t||\tyo: %f\t||\tf: %f\t||\tyi: %f\n", xo, yo, f, yi);

			yo = yi;
			xo = xo+h;
			calcv.varmapput("x", xo);
			calcv.varmapput("y", yo);
		}

		System.out.printf("\nValor final (x, y) = (%f, %f)\n", xi, yi);

	}
}
