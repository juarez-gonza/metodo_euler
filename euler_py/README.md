Materia: Análisis Numérico.
	Método de euler.

	Pre-requisitos:
	- python3 instalado en el sistema
 	- Dependencias en requirements.txt instalados en el sistema
		- Para instalar las dependencias basta con ubicarse en la carpeta del archivo
		en la línea de comandos y escribir el comando "pip install -r requirements.txt"
	Forma de uso:
	- correr el programa con el comando "python3 ./metodo_euler.py"
	- ingresar la ecuación, respetando la sintaxis de python
		- cuidar la precedencia, es la misma que en las matemáticas, utilizar paréntesis si es necesario.
		- las potencias se escriben de la forma x**y, por ejemplo x**2 si se quiere escribir x^2 (x al cuadrado)
	- ingresar valores iniciales x0, y0
	- ingresar el valor final de x (llamado xf en lo que resta de la documentación)
	- ingresar el numero de iteraciones a realizar 
		- si se tiene la amplitud "h" del intervalo, esto se puede obtener como: (xf-x0)/h
