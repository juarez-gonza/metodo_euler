//import java.lang.Float;
import java.util.Map;
import java.util.HashMap;

public class CalcVisitor extends ExprBaseVisitor<Float> {
	private Map<String, Float> varmap = new HashMap<String, Float>();

	public void varmapput(String key, Float val)
	{
		this.varmap.put(key, val);
	}

	/* prog: stat+ */
	@Override
	public Float visitStat(ExprParser.StatContext ctx)
	{
		Float r = visit(ctx.expr());
		return r;
	}

	/* expr: expr op=('*'|'/') expr		# muldiv */
	@Override
	public Float visitMuldiv(ExprParser.MuldivContext ctx)
	{
		Float left;
		Float right;

		left = visit(ctx.expr(0));
		right = visit(ctx.expr(1));

		if (ctx.op.getType() == ExprParser.MUL)
			return left * right;
		return left / right;
	}

	/* expr: expr op=('+'|'-') expr		# addsub */
	@Override
	public Float visitAddsub(ExprParser.AddsubContext ctx)
	{
		Float left;
		Float right;

		left = visit(ctx.expr(0));
		right = visit(ctx.expr(1));

		if (ctx.op.getType() == ExprParser.ADD)
			return left + right;
		return left - right;
	}

	/* '(' expr ')'				# parens */
	@Override
	public Float visitParens(ExprParser.ParensContext ctx)
	{
		return visit(ctx.expr());
	}

	/*
	 * expr: ID				# id
	 * ID: [a-zA-Z]+ ;
	 */
	@Override
	public Float visitId(ExprParser.IdContext ctx)
	{
		String id;

		id = ctx.ID().getText();
		if (varmap.containsKey(id))
			return varmap.get(id);
		return Float.valueOf("0");
	}

	/*
	 * expr: INT				# int
	 * INT: [0-9]+ ;
	 */
	@Override
	public Float visitInt(ExprParser.IntContext ctx)
	{
		return Float.valueOf(ctx.INT().getText());
	}
}
