/*
 * en un array bidimensional arr[][]
 * resultante de un input de filas y columnas de la hoja de cáalculo
 * el primer indice se refiere a la fila, el segundo a la columna
 * entonces arr[i][j] consigue el elemento en la fila i, columna j
 */

/*
 * IMPORTANTE:
 * En los resultados para ambos métodos la última columna corresponde a la presición.
 */

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
   * rara vez pasaría (nunca?) pero es para chequear si se ingresó mal el input
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
 * @m:  matriz (array de arrays) sobre la cual aplicar el método de Gauss Seidel
 * @b:  vector resultado en la rep matricial de SEL -> A*x = b
 * @n:  cantidad de iteraciones en el método de Jacobi
 */
function GSEID(m, b, n)
{
  var out = [];
  var presiciones = [];
  var acc;
  var a;
  var i; /* itera sobre filas */
  var j; /* itera sobre columnas */
  var k; /* marca número de solución obtenida (hasta n) */

  /* construir solucion inicial */
  out[0] = []
  presiciones[0] = 0;
  for (j = 0; j < m[0].length; j++)
    out[0][j] = 0;

  for (k = 1; k <= n; k++) {
    out[k] = [];
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
    presiciones[k] = calcpresicion(out[k-1], out[k]);
    if (presiciones[k] < 0)
      return false;
  }
  for (k = 0; k < out.length; k++)
    out[k][out[k].length] = presiciones[k];
  return out;
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
  var acc;
  var a;
  var i; /* itera sobre filas */
  var j; /* itera sobre columnas */
  var k; /* marca número de solución obtenida (hasta n) */

  /* construir solucion inicial */
  out[0] = []
  presiciones[0] = 0;
  for (j = 0; j < m[0].length; j++)
    out[0][j] = 0;

  for (k = 1; k <= n; k++) {
    out[k] = [];
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
        /* despejar términos */
        acc -= out[k-1][j] * m[i][j];
      }
      /* despejar factor que acompaña al término de interés */
      acc /= a;
      out[k][i] = acc;
    }
    presiciones[k] = calcpresicion(out[k-1], out[k]);
    if (presiciones[k] < 0)
      return false;
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
function GSEIDP(m, b, p)
{
  var out = [];
  var presiciones = [];
  var acc;
  var a;
  var i; /* itera sobre filas */
  var j; /* itera sobre columnas */
  var k; /* marca número de solución obtenida (hasta n) */

  /* construir solucion inicial */
  out[0] = []
  presiciones[0] = 0;
  for (j = 0; j < m[0].length; j++)
    out[0][j] = 0;

  k = 1;
  presiciones[0] = Number.MAX_VALUE;
  while (presiciones[k-1] > p) {
    out[k] = [];
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
    presiciones[k] = calcpresicion(out[k-1], out[k]);
    if (presiciones[k] < 0)
      return false;
    k++;
  }
  presiciones[0] = null;
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
  var acc;
  var a;
  var i; /* itera sobre filas */
  var j; /* itera sobre columnas */
  var k; /* marca número de solución obtenida (hasta n) */

  /* construir solucion inicial */
  out[0] = []
  presiciones[0] = 0;
  for (j = 0; j < m[0].length; j++)
    out[0][j] = 0;

  k = 1;
  presiciones[0] = Number.MAX_VALUE;
  while (presiciones[k-1] > p) {
    out[k] = [];
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
        /* despejar términos */
        acc -= out[k-1][j] * m[i][j];
      }
      /* despejar factor que acompaña al término de interés */
      acc /= a;
      out[k][i] = acc;
    }
    presiciones[k] = calcpresicion(out[k-1], out[k]);
    if (presiciones[k] < 0)
      return false;
    k++;
  }
  presiciones[0] = null;
  for (k = 0; k < out.length; k++)
    out[k][out[k].length] = presiciones[k];
  return out;
}

/*
 * @m:  matriz (array de arrays) sobre la cual verificar el criterio de convergencia
 *      para los métodos numéricos de Jacobi y Gauss Saidel.
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
