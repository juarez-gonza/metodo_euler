/*
 * Estas lineas de codigo de Apps Script (aparentemente JavaScript que funciona en Google Docs)
 * es para usar en Google Sheets para problemas de Sistemas de Ecuaciones Lineales que requirean
 * método de Jacobi y/o Gauss-Seidel
 */

/*
 * DOCUMENTACION PARA USAR DESDE Google Sheet
 * Las funciones expuestas son:
 *    - JACOBI(m, b, n) -> calcula n iteraciones del método de Jacobi
 *    - JACOBIP(m, b, p) -> calcula por método de Jacobi hasta la precisión p
 *    - GSEID(m, b, n) -> calcula n iteraciones del método de Gauss-Seidel
 *    - GSEIDP(m, b, p) -> calcula por método de Gauss-Seidel hasta la precisión p
 *    - CONVJACGSEID(m) -> chequea si la matriz m pasa el criterio de convergencia
 *    - NINFINITO(m) -> calcula la norma infinito de la matriz m
 *    - NUNO(m) -> calcula la 1-norma de la matriz m
 *    donde:
 *      @m:  matriz sobre la cual aplicar el método de Gauss-Seidel. De la forma [A-Z]\d:[A-Z]\d
 *         Ej.: C238:F241
 *
 *      @b:  vector resultado en la rep matricial de SEL -> A*x = b. De la forma [A-Z]\d:[A-Z]\d
 *           donde la letra del alfabeto que corresponde a la columna es la misma de ambos
 *           lados de la expresión (es decir, es un vector de la dimensión Nx1)
 *         Ej.: C238:C241 (notar ambas son de la columna C)
 *
 *      @n:  cantidad de iteraciones en el método utilizado. Un número positivo
 *
 *      @p:  presicion hasta la cual calcular. Un número positivo
 *
 * IMPORTANTE:
 * En los resultados para ambos métodos la última columna corresponde a la presición.
 *
 * ========== FIN DE LA LECTURA PARA LOS NO INTERESADOS EN EL CÓDIGO ==========
 */

/*
 * TODO:
 *  - Implementar precisión hasta n cifras decimales. Lo que se me ocurre es hacer dos funciones
 *    y 1 argumento más a la iteración, entonces se pasa o la que hace el redondeo o un stub.
 *    Obviamente se añade un argumento opcional a las funciones expuestas al Sheet.
 *    y adentro de una iteración se wrapea cada operación con la función del argumento.
 *    a) No me vuelve loco la idea de tener que llamar y retornar a un stub.
 *    b) Pero quizás sea mejor opción que un condicional.
 *    c) Definitivamente mejor que escribir otras funciones, la repetición de código ya
 *       es bastante así como está
 * Respecto a la repetición de código:
 *   El código entre ambos métodos e incluso entre las distintas opciones para un mismo método
 *   se repite bastante. Pero por ahora no se me ocurre una forma de evitar la repetición
 *   manteniendo la legibilidad (y prefiero repetir algo entendible a escribir una vez 
 *   lo inentendible). No sé si es algo a "arreglar" pero es algo que sí choca un poco.
 */

/* Las proximas son cosas a tener en cuenta al programar o leer el código */

/*
 * en un array bidimensional arr[][]
 * resultante de un input de filas y columnas de la hoja de cáalculo
 * el primer indice se refiere a la fila, el segundo a la columna
 * entonces arr[i][j] consigue el elemento en la fila i, columna j
 */

/*
 * En JavaScript las arrays (de "clase" Array, no array por definición) se pasan por referencia
 * no por valor. Un array que se pasa a una función como argumento y es modificado en
 * dentro de la función, también se modifica para el código que llamó a la función
 * que hizo la modificación.
 * Los objetos en JS también obedecen esto, pero no se usan en éste código hasta ahora.
 */


/* ============================= HELPERS JACOBI Y GAUSS-SEIDEL ============================= */

/*
 * @rprev:  fila previa (rprev -> row prev, pq en ingles suena más cheto)
 * @rcurr:  fila actual
 */
function calcpresicion(rprev, rcurr)
{
  var i;
  var maxdiff;
  var diff;
  /*
   * no se puede seguir si las longitudes de las filas son distintas.
   * rara vez pasaría (nunca?) pero es para chequear en el caller si se ingresó mal el input
   * ya que este numero debería dar siempre positivo tendiendo a 0, no negativo
   */
  if (rprev.length != rcurr.length)
    return -1;

  maxdiff = Number.MIN_VALUE;
  for (i = 0; i < rprev.length; i++) {
    diff = Math.abs(rcurr[i] - rprev[i]);
    if (diff > maxdiff)
      maxdiff = diff;
  }

  return maxdiff;
}

/*
 * @m:  matriz (array de arrays) sobre la cual aplicar el método de Jacobi
 * @out:  matriz a la cual agregar el vector inicial
 */
function init_sol(m, out)
{
  var j;
  for (j = 0; j < m[0].length; j++)
    out[0][j] = 0;
}

/*
 * @m:  matriz (array de arrays) sobre la cual verificar el criterio de convergencia
 *      para los métodos numéricos de Jacobi y Gauss-Saidel.
 */
function CONVJACGSEID(m)
{
  var i;
  var j;
  var sum;
  var diag;

  for (i = 0; i < m.length; i++) {

    sum = 0;
    for (j = 0; j < m[i].length; j++) {

      if (i == j)
        diag = Math.abs(m[j][i]);
      else
        sum += Math.abs(m[j][i]);

    }

    /* si no se cumple el criterio de convergencia */
    if (diag < sum)
      return false;
  }

  return true;
}

/* =============================== GAUSS-SEIDEL =============================== */

/*
 * @m:  matriz (array de arrays) sobre la cual aplicar el método de Gauss-Seidel
 * @b:  vector resultado en la rep matricial de SEL -> A*x = b
 * @out:  matriz con los resultados ya calculados por iteraciones previas (incluyendo la inicial)
 * @k:  numero de iteración en curso
 */
function gseid_iter(m, b, out, k)
{
  var acc;
  var a;
  var acc;
  var a;
  var i; /* itera sobre filas */
  var j; /* itera sobre columnas */

  for (i = 0; i < m.length; i++) {
    acc = b[i];

    for (j = 0; j < m[i].length; j++) {
      if (i == j) {
        /*
         * guardar factor que acompaña al término de interés
         * para despejar posteriormente
         */
        a = m[i][j];
        continue;
      }
      /*
       * despejar términos
       * acá se diferencian Jacobi y Gauss-Seidel
       */
      if (j > i)
        acc -= out[k-1][j] * m[i][j];
      else
        acc -= out[k][j] * m[i][j];
    }
    /* despejar factor que acompaña al término de interés */
    acc /= a;
    out[k][i] = acc;
  }
}

/*
 * @m:  matriz (array de arrays) sobre la cual aplicar el método de Gauss-Seidel
 * @b:  vector resultado en la rep matricial de SEL -> A*x = b
 * @n:  cantidad de iteraciones en el método de Jacobi
 */
function GSEID(m, b, n)
{
  var out = [];
  var presiciones = [];
  var k; /* marca número de solución obtenida (hasta n) */

  /* construir solucion inicial */
  out[0] = []
  presiciones[0] = null;
  init_sol(m, out);

  for (k = 1; k <= n; k++) {
    out[k] = [];
    gseid_iter(m, b, out, k);
    presiciones[k] = calcpresicion(out[k-1], out[k]);
    if (presiciones[k] < 0)
      throw new Error("Presición negativa, revisar input");
  }

  for (k = 0; k < out.length; k++)
    out[k][out[k].length] = presiciones[k];

  return out;
}

/*
 * @m:  matriz (array de arrays) sobre la cual aplicar el método de Gauss-Seidel
 * @b:  vector resultado en la rep matricial de SEL -> A*x = b
 * @p:  presicion hasta la cual calcular
 */
function GSEIDP(m, b, p)
{
  var out = [];
  var presiciones = [];
  var k; /* marca número de solución obtenida (hasta n) */

  /* construir solucion inicial */
  out[0] = []
  presiciones[0] = Number.MAX_VALUE;
  init_sol(m, out);

  k = 1;
  while (presiciones[k-1] > p) {
    out[k] = [];
    gseid_iter(m, b, out, k);
    presiciones[k] = calcpresicion(out[k-1], out[k]);
    if (presiciones[k] < 0)
      throw new Error("Presición negativa, revisar input");
    k++;
  }

  presiciones[0] = null;
  for (k = 0; k < out.length; k++)
    out[k][out[k].length] = presiciones[k];

  return out;
}

/* =============================== JACOBI =============================== */

/*
 * @m:  matriz (array de arrays) sobre la cual aplicar el método de Jacobi
 * @b:  vector resultado en la rep matricial de SEL -> A*x = b
 * @out:  matriz con los resultados ya calculados por iteraciones previas (incluyendo la inicial)
 * @k:  numero de iteración en curso
 */
function jacobi_iter(m, b, out, k)
{
  var acc;
  var a;
  var acc;
  var a;
  var i; /* itera sobre filas */
  var j; /* itera sobre columnas */

  for (i = 0; i < m.length; i++) {
    acc = b[i];

    for (j = 0; j < m[i].length; j++) {
      if (i == j) {
        /*
         * guardar factor que acompaña al término de interés
         * para despejar posteriormente
         */
        a = m[i][j];
        continue;
      }
      /*
       * despejar términos
       * acá se diferencian Jacobi y Gauss-Seidel
       */
      acc -= out[k-1][j] * m[i][j];
    }
    /* despejar factor que acompaña al término de interés */
    acc /= a;
    out[k][i] = acc;
  }
}

/*
 * @m:  matriz (array de arrays) sobre la cual aplicar el método de Jacobi
 * @b:  vector resultado en la rep matricial de SEL -> A*x = b
 * @n:  cantidad de iteraciones en el método de Jacobi
 */
function JACOBI(m, b, n)
{
  var out = [];
  var presiciones = [];
  var k; /* marca número de solución obtenida (hasta n) */

  /* construir solucion inicial */
  out[0] = []
  presiciones[0] = 0;
  init_sol(m, out)


  for (k = 1; k <= n; k++) {
    out[k] = [];
    jacobi_iter(m, b, out, k)
    presiciones[k] = calcpresicion(out[k-1], out[k]);
    if (presiciones[k] < 0)
      throw new Error("Presición negativa, revisar input");
  }

  for (k = 0; k < out.length; k++)
    out[k][out[k].length] = presiciones[k];

  return out;
}

/*
 * @m:  matriz (array de arrays) sobre la cual aplicar el método de Jacobi
 * @b:  vector resultado en la rep matricial de SEL -> A*x = b
 * @p:  presicion hasta la cual calcular
 */
function JACOBIP(m, b, p)
{
  var out = [];
  var presiciones = [];
  var k; /* marca número de solución obtenida (hasta n) */

  /* construir solucion inicial */
  out[0] = []
  presiciones[0] = Number.MAX_VALUE;
  init_sol(m, out)

  k = 1;
  while (presiciones[k-1] > p) {
    out[k] = [];
    jacobi_iter(m, b, out, k)
    presiciones[k] = calcpresicion(out[k-1], out[k]);
    if (presiciones[k] < 0)
      throw new Error("Presición negativa, revisar input");
    k++;
  }

  presiciones[0] = null;
  for (k = 0; k < out.length; k++)
    out[k][out[k].length] = presiciones[k];

  return out;
}

/* =============================== OTROS ===============================  */

/*
 * @m:  matriz (array de arrays) sobre la cual calcular norma infinito
 */
function NINFINITO(m)
{
  var i;
  var j;
  var sum;
  var max;

  max = Number.MIN_VALUE;
  for (i = 0; i < m.length; i++) {

    sum = 0;
    for (j = 0; j < m[i].length; j++) {
      sum += Math.abs(m[i][j]);
    }

    if (sum > max)
      max = sum;
  }

  return max;
}

/*
 * @m:  matriz (array de arrays) sobre la cual calcular norma uno
 */
function NUNO(m)
{
  var i;
  var j;
  var sum;
  var max;

  max = Number.MIN_VALUE;
  for (i = 0; i < m.length; i++) {

    sum = 0;
    for (j = 0; j < m[i].length; j++) {
      sum += Math.abs(m[j][i]);
    }

    if (sum > max)
      max = sum;
  }

  return max;
}
