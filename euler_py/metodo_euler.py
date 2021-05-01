import sympy
import math

class Function():
    def __init__(self, str_repr):
        self.str_repr = str_repr
        self.fc_expr = sympy.parse_expr(str_repr)
        self.varmap = {}
        self.varmap_put("e", math.e)
        self.varmap_put("pi", math.pi)

    def evaluate(self):
        value = self.fc_expr.subs(self.varmap)
        return value

    def varmap_put(self, str_var, value):
        self.varmap[str_var] = value

    def __str__(self):
        return self.str_repr

class M_Euler():
    def __init__(self, x0, xi, y0, n, fc):
        self.x0 = x0
        self.xi = xi
        self.y0 = y0
        self.n = n
        self.fc = fc

    def report_iter(self, i, iter_val):
        print("\nIteracion %d" % i)
        print("\tx0: %f\t||\ty0: %f\t||\tyi: %f\t||\tf: %f\n" % (self.x0, self.y0, self.yi, iter_val))

    def report_final(self):
        print("\nValor final (x, y) = (%f, %f)" % (self.xi, self.y0))

    def calc_h(self):
        return (self.xi - self.x0) / n

    def apply(self):
        h = self.calc_h()

        self.fc.varmap_put("x", self.x0)
        self.fc.varmap_put("y", self.y0)

        for i in range(self.n):
            iter_val = fc.evaluate()
            print(iter_val)
            self.yi = self.y0 + h * iter_val

            self.report_iter(i, iter_val)

            self.y0 = self.yi
            self.x0 = self.x0 + h
            self.fc.varmap_put("x", self.x0)
            self.fc.varmap_put("y", self.y0)

        self.report_final()

if __name__ == "__main__":
    input_eq = input("Ingresar ecuacion a resolver por metodo de euler: ")
    x0 = float(input("Ingresar valor inicial de x: "))
    y0 = float(input("Ingresar valor inicial de y: "))
    xi = float(input("Ingresar valor final de x (donde se quiere averiguar el valor de y): "))
    n = int(input("Ingresar cantidad de iteraciones hasta llegar al valor final de x: "))

    fc = Function(input_eq)
    m_euler = M_Euler(x0, xi, y0, n, fc)
    m_euler.apply()
