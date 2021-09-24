
const MAX_FILAS = 3;
const MAX_COLUMNAS = 3;
const MAX_VERF_DIAG = 2;

const SIGNO_JUGADOR_1 = 'X';
const SIGNO_JUGADOR_2 = 'O';
const SIGNO_VACIO = '';

const CASILLA_NOMBRE_VACIO =  '';
const CASILLA_VALOR_NULO = '';
const CASILLA_TIPO_BOTON = 'submit';

const TAMANIO_IMG = "background-size: 100% 100%;";

//podemos optar por descargar la fuente y indicar su direccion en nuestro equipo en vez de accederlo con internet
const IMG_VACIO = "https://thumbs.gfycat.com/VariableApprehensiveDevilfish-max-1mb.gif";
const IMG_JUGADOR_1 = "https://i.gifer.com/AWWg.gif";
const IMG_JUGADOR_2 = "https://i.gifer.com/DVxT.gif";

const BACKGROUND_IMG_1 = 'background: url('+IMG_JUGADOR_1+'); '+TAMANIO_IMG;
const BACKGROUND_IMG_2 = 'background: url('+IMG_JUGADOR_2+'); '+TAMANIO_IMG;
const BACKGROUND_IMG_VACIO = 'background: url('+IMG_VACIO+'); '+TAMANIO_IMG;

const PRIMER_FILA = 0;
const SEGUNDA_FILA = 1;
const TERCER_FILA = 2;

const MAX_PRIMER_FILA = 3;
const MAX_SEGUNDA_FILA = 6;

const TURNOS_VERIFICAR = 5;

const ESTADO_NULO = 0;
const ESTADO_GANO = 1;

//variable global 
let signoJugadorActual = SIGNO_JUGADOR_1;
let turno = 0;
let estadoJuego = ESTADO_NULO;

/**
 * Crea una matriz con los tamaños recibidos 
 * @param {integer} maxFila tamaño maximo para la fila
 * @param {integer} maxCol tamaño maximo para la columna
 * @returns {Array} matriz de "maxFila" x "maxCol" inicializado con "SIGNO_VACIO"
 */
function crearMatriz(maxFila, maxCol){
    let matriz = new Array(maxFila);
    for(let f = 0 ; f<maxFila ; f++){
        matriz[f] = new Array(maxCol);
        for(let c = 0 ; c < maxCol ; c ++){
            matriz[f][c]=SIGNO_VACIO;//inicializamos correctamente la matriz
        }
    }
    return matriz;
}


/**
 * Agrega las columnas correspondientes a la fila actual del tablero en html a crear
 * @param {HTMLDivElement} divFila fila actual a la que se asignaran las columnas correspondientes
 * @param {Integer} maxCol tamaño maximo de columna para el tablero
 * @param {Integer} fila contiene la posicion actual a la fila correspondiente a agregar columna
 */
function agregarColumnas(divFila, maxCol, fila){
    var input=null;
    for(var i = 0; i < maxCol; i++){
        //necesito 3 input para cada fila
        input = document.createElement('input');
        input.classList.add('boton');
        input.type = CASILLA_TIPO_BOTON;
        input.id = i+3*fila;//varia
        input.name = CASILLA_NOMBRE_VACIO;//vacio inicialmente
        input.value = CASILLA_VALOR_NULO;//queda para no ver el valor
        input.style = BACKGROUND_IMG_VACIO;
        input.addEventListener('click', detectarPresion);//agrega un evento para detectar el clic
        divFila.appendChild(input);//3 por cada fila
    }
}

/**
 * Agrega las filas al tablero en html a crear
 * @param {HTMLDivElement} divTablero tablero que contendra todos los casillas necesarios para el juego
 * @param {Integer} maxFila maximo tamaño de fila
 * @param {Integer} maxCol maximo tamaño de columnas
 */
function agregarFilas(divTablero, maxFila, maxCol){
    var divFila=null;
    for(var fila = 0; fila < maxFila ; fila ++){
        //necesito 3 filas para el tablero
        divFila = document.createElement('div');
        divFila.classList.add('row', 'center');
        agregarColumnas(divFila, maxCol, fila);
        divTablero.appendChild(divFila);//3 para el tablero
    }
}

/**
 * Crea un tablero para el proyecto en html con los tamaños recibidos
 * @param {integer} maxFila tamaño maximo para la fila
 * @param {integer} maxCol tamaño maximo para la columna
 */
function insertarTablero(maxFila, maxCol){
    //necesito un tablero
    var divTablero = document.createElement('div');
    divTablero.classList.add('container','tablero');
    agregarFilas(divTablero, maxFila, maxCol);
    document.body.appendChild(divTablero);
}

/**
 * Verifica verticalmente el 3 en linea alterando el "estadoJuego" a "ESTADO_GANO" si se detecta ganador
 */
function verificarVertical(){
    for(let f = 0 ; f < MAX_FILAS ; f++){
        if((matriz[f][0] == signoJugadorActual) && (matriz[f][1]==signoJugadorActual) && (matriz[f][2]==signoJugadorActual)){
            f = MAX_FILAS;
            estadoJuego = ESTADO_GANO;
        }
    }
}

/**
 * Verifica horizontalmente el 3 en linea alterando el "estadoJuego" a "ESTADO_GANO" si se detecta ganador
 */
 function verificarHorizontal(){
    for(let c = 0 ; c < MAX_COLUMNAS ; c++){
        if((matriz[0][c] == signoJugadorActual) && (matriz[1][c]==signoJugadorActual) && (matriz[2][c]==signoJugadorActual)){
            c = MAX_COLUMNAS;
            estadoJuego = ESTADO_GANO;
        }
    }
}


/**
 * Verifica diagonalmente el 3 en linea alterando el "estadoJuego" a "ESTADO_GANO" si se detecta ganador
 */
 function verificarDiagonal(){
    for(let d = 0 ; d <= MAX_VERF_DIAG ; d+=2){
        if(matriz[d][0]==signoJugadorActual && matriz[1][1]==signoJugadorActual && matriz[(2-d)][2]==signoJugadorActual){
            d = MAX_COLUMNAS;
            estadoJuego = ESTADO_GANO;
        }
    }
}

/**
 * Verifica si gano el jugador actual
 */
function verificarGanador(){
    verificarVertical();
    if(estadoJuego == ESTADO_NULO){
        verificarHorizontal();
    }
    if(estadoJuego == ESTADO_NULO){
        verificarDiagonal();
    }    
    console.log("gano " + signoJugadorActual);
}


/**
 * alterna el turno como corresponde actualizando la casilla
 * @param {EventTarget} casilla contiene el objeto de la casilla detectada con el evento
 */
function alternarTurnos(casilla){
    actualizarCasilla(casilla);
    if (signoJugadorActual == SIGNO_JUGADOR_1){
        casilla.style = BACKGROUND_IMG_1;
        signoJugadorActual = SIGNO_JUGADOR_2;
    }else{        
        casilla.style = BACKGROUND_IMG_2;
        signoJugadorActual = SIGNO_JUGADOR_1;
    }
}

/**
 * Actualiza la casilla correspondiente
 * @param {EventTarget} casilla a actualizar
 */
function actualizarCasilla(casilla){
    casilla.name = signoJugadorActual;
    casilla.disabled = "disabled";
}


/**
 * Detecta el clic/presion en la casilla correspondiente mientras este habilitada
 * @param {MouseEvent} evt evento detectado del mouse en la pagina
 */
function detectarPresion(evt) {
    turno++;
    var casilla = evt.target;//devuelve el elemento donde se detecto el evento
    
    ubicarSignosTablero(casilla.id, signoJugadorActual);
    if(turno >= TURNOS_VERIFICAR){
        verificarGanador();//deberia deshabilitar todo si gano algun jugador
        if(estadoJuego == ESTADO_GANO){
            window.alert("Gano el  jugador " + signoJugadorActual);
            terminarJuego();
        } 
    }
    alternarTurnos(casilla);
}

/**
 * agrega el signo en la posicion correspondiente al tablero
 * @param {Integer} fila de la casilla en el tablero
 * @param {Integer} id de la casilla correspondiente a actualizar
 * @param {String} signoJugadorActual 
 */
function agregarSimbTablero(fila, id, signoJugadorActual){
    console.log("ingresando en fila " + fila + " y columna " + (id-fila*3) +" simb: " + signoJugadorActual);
    matriz[fila][id-fila*3] = signoJugadorActual;
}

/**
 * ubica el simbolo en el tablero
 * @param {Integer} id de la casilla correspondiente a actualizar
 * @param {String} signoJugadorActual 
 */
function ubicarSignosTablero(id, signoJugadorActual){
    if(id < MAX_PRIMER_FILA){
        agregarSimbTablero(PRIMER_FILA, id, signoJugadorActual);
    }else if(id < MAX_SEGUNDA_FILA){
        agregarSimbTablero(SEGUNDA_FILA, id, signoJugadorActual);
    }else{
        agregarSimbTablero(TERCER_FILA, id, signoJugadorActual);
    }
    mostrarTableroConsola();
}

/**
 * Busca las casillas vacias y las deshabilita
 */
function terminarJuego(){
    let elemento = null; 
    for(let f = 0 ; f < MAX_FILAS*MAX_COLUMNAS ; f++){
        elemento = document.getElementById(f);
        if(elemento.name == SIGNO_VACIO){
            elemento.disabled = "disabled";
        }
    }
}


/**
 * Muestra el tablero por consola con los valores correspondientes actualizados
 */
function mostrarTableroConsola(){
    for(var f = 0 ; f < MAX_FILAS ; f++){
        for(var c = 0 ; c < MAX_COLUMNAS ; c++){
            console.log("[" + (matriz[f][c]) +"] ");
        }
        console.log("\n");
    }
}

//solo se ejecutan 1 vez
insertarTablero(MAX_FILAS, MAX_COLUMNAS);
var matriz = crearMatriz(MAX_FILAS, MAX_COLUMNAS);