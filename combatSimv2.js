
// Arrays
    const battleAux=[] 
    const pokemonEnemigo=[] 
    const miPokemon = [] 
    let battleLog = []

    const pokeHere =document.getElementById('pokeHere')
    const pociones = {cantidad:5 , vidaCurada:20}
    
    //var
    
    let dadoCastigo = 0
    let offset = 0 

//fetch


if (!localStorage.getItem('estadisticas')) {
    const estadisticas = {
    jugadas :0 ,
    ganadas: 0,
    perdidas: 0,
    }
    const estadisticasString = JSON.stringify(estadisticas) 
    localStorage.setItem('estadisticas', estadisticasString) 
}
const btnEstadisticas = document.getElementById('statsBtn') 

btnEstadisticas.addEventListener('click', function() {
    const estadisticasString = localStorage.getItem('estadisticas') 
    const estadisticas = JSON.parse(estadisticasString) 

    const estadisticasText = `Jugadas: ${estadisticas.jugadas}\nGanadas: ${estadisticas.ganadas}\nPerdidas: ${estadisticas.perdidas}` 

    swal({
    title: 'Estadisticas',
    text: estadisticasText,
    icon: 'info',
    confirmButtonText: 'OK'
  }) 
}) 

function updateEstadisticas(resultado) {  
    const estadisticasString = localStorage.getItem('estadisticas') 
    const estadisticas = JSON.parse(estadisticasString) 
    estadisticas.jugadas++ 
    if (resultado === 'ganada') {
    estadisticas.ganadas++ 
    } else if (resultado === 'perdida') {
    estadisticas.perdidas++ 
    }
    const updatedEstadisticasString = JSON.stringify(estadisticas) 
    localStorage.setItem('estadisticas', updatedEstadisticasString) 
}

async function fetchAndShowPokemons(offset) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=4` 
    const response = await fetch(url) 
    const pokemons = await response.json() 
    const pokeHere = document.querySelector("#pokeHere") 
    
    while (pokeHere.firstChild) {
        pokeHere.removeChild(pokeHere.firstChild) 
    }

    pokemons.results.forEach(async (pokemon) => {
        const detailsResponse = await fetch(pokemon.url) 
        const details = await detailsResponse.json() 
        let btn = document.createElement('button') 
        btn.innerHTML = `<img class="apiImgSize" src="${details.sprites.front_default}" alt="${pokemon.name}">${pokemon.name}` 
        btn.classList.add('btn', 'pokeBtn', 'col', 'col-md-6', 'col-sm-12') 
        btn.type = 'button' 
        btn.id = `btn${pokemon.name}` 
        console.log(pokemon.name)
        pokeHere.appendChild(btn) 
        btn.addEventListener('click', () => {
            elegirPokemonAliado(pokemon) 
            console.log(miPokemon)
        }) 
    }) 
}

fetchAndShowPokemons(offset)
const nextBtn = document.querySelector("#offsetButtonNext").addEventListener("click", function() {
    offset += 4 
    fetchAndShowPokemons(offset) 
}) 

const prevBtn = document.querySelector("#offsetButtonPrev").addEventListener("click", function() {
    if (offset > 0){
        offset -= 4 
        fetchAndShowPokemons(offset) 
    }
}) 

const randomBtn = document.querySelector("#offsetButtonRandom").addEventListener("click", function() {
    let randomOffset = randomInt(0,400) 
    let offset = randomOffset 
    fetchAndShowPokemons(offset) 
}) 

async function elegirPokemonAliado(selected) {
    const pokemonName = selected.name 
    miPokemon.push (await fetchPokemonData(pokemonName)) 
    makeSeleccionDissapear() 
    imgChange(imgAliado, miPokemon[0].sprites.back_default)
    textChange(nombreAliado, miPokemon[0].name)
    elegirPokemonEnemigo() 
    console.log( estadisticas)

    return miPokemon 
} 

async function fetchPokemonData(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`) 
    const pokemonData = await response.json() 
    return pokemonData 
} 


async function elegirPokemonEnemigo() {
    const allPokemon = await fetchAllPokemonNames() 
    const randomPokemonName = allPokemon[Math.floor(Math.random() * allPokemon.length)] 
    pokemonEnemigo.push(await fetchPokemonData(randomPokemonName)) 
    imgChange(imgEnemigo, pokemonEnemigo[0].sprites.front_default) 
    textChange(nombreEnemigo, pokemonEnemigo[0].name) 
    } 


async function fetchAllPokemonNames() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=964") 
    const data = await response.json() 
    return data.results.map(pokemon => pokemon.name) 
} 


// Elementos
    //BattlefieldUI
    const miHpBar = document.getElementById("hpAliado")
    const infoBatalla = document.getElementById('infoDeBatalla') 
    const campoBatalla = document.getElementById('campoDeBatalla') 
    const imgAliado= document.getElementById('imgAliado') 
    const imgEnemigo= document.getElementById('imgEnemigo') 
    const nombreEnemigo = document.getElementById('nombreEnemigo') 
    const nombreAliado = document.getElementById('nombreAliado') 
    const textoBatalla = document.getElementById('textoBatalla') 
    const infoAux = document.getElementById('infoAux') 

    //MenuButtons
    const menuDeAcciones = document.getElementById('menuDeAcciones') 
    const menuDeBatalla = document.getElementById('menuDeBatalla') 

    //FightButtons
    const botonVolver = document.getElementById('botonVolver') 
    const botonRapido = document.getElementById('botonRapido') 
    const botonEspecial = document.getElementById('botonEspecial') 

    //actionButtons
    const botonEscapar = document.getElementById('botonEscapar') 
    const botonMenuAtaque = document.getElementById('botonMenuAtaque') 
    const botonCurarse = document.getElementById('botonCurarse') 

    //Pokemon Selection
    const callToAction = document.getElementById('callToAction') 

    const selectorPokemon = document.getElementById('selectorPokemon') 
    //Sidebar
    const iniciarPartida = document.getElementById('iniciarPartida') 
    const reiniciarPartida = document.getElementById('reiniciarPartida') 
    const tienda = document.getElementById('tienda') 


//Event Listeners

    //ActionButtons
    botonMenuAtaque.addEventListener('click', changeBattleMenu) 
    //FightButtons
    botonVolver.addEventListener('click', changeBattleMenu) 


    botonRapido.addEventListener('click', () =>
    {
    ataqueNormal('10',pokemonEnemigo, miPokemon) 
    console.log(battleLog) 
    devolverAtaque()   
    checkAlive()   
    }) 


    botonEspecial.addEventListener('click', ()=>{
    ataqueEspecial("30",pokemonEnemigo,miPokemon)
    console.log(battleLog) 
    devolverAtaque() 


    checkAlive() 
    }) 


    botonEscapar.addEventListener('click', ()=>{location.reload(true)}) 
    botonCurarse.addEventListener('click', ()=>{curarse(miPokemon)}) 
//Funciones


    function checkAlive(){
    let checkMine = miPokemon[0].stats[0].base_stat
    let checkTheirs = pokemonEnemigo[0].stats[0].base_stat

    if (checkMine < 1 ){
        updateEstadisticas('perdida')
        swal({
            title: "Haz perdido el duelo",
            text: "¿Por qué no lo intentas nuevamente?",
            icon: "error",
            button: "Aceptar",
        }).then(() => {
            
            location.reload(true) 

        }) 
    } 

    else if (checkTheirs < 1){
        updateEstadisticas('ganada')
        swal({
            title: "¡Felicidades, haz ganado el duelo!",
            icon: "success",
            button: "Aceptar",
        }).then(() => {
            
            location.reload(true) 

        }) 
    }}




    function devolverAtaque() {
    battleLogFunc(`-¡Cuidado! El enemigo esta intentando atacarte.`)
    dadoCastigo= randomInt(0,100)
    if(dadoCastigo > 60)
        {
            battleLogFunc(`-¡El enemigo logro devolverte un ataque!`)
            ataqueNormal('50',miPokemon,pokemonEnemigo)
        }
    else if(dadoCastigo > 80){
        battleLogFunc(`-¡El enemigo logro devolverte un ataque ESPECIAL!`)
        ataqueEspecial('50',miPokemon,pokemonEnemigo)
    }
    else{ battleLogFunc(`-Logras interceptar y cancelar su ataque. ¡Aprovecha!`)}
    }

    function textChange(id, string){
    id.innerHTML = string
    }

    function imgChange(id, string){
    id.src = string
    }

    function changeBattleMenu (){
    menuDeAcciones.classList.toggle('d-none')
    menuDeBatalla.classList.toggle('d-none')
    }

    function makeSeleccionDissapear(){
        selectorPokemon.classList.replace('contenedor','d-none')
        infoBatalla.classList.remove('d-none')
        campoBatalla.classList.remove('d-none')
    }

    function toggleActiveOption(){
    iniciarPartida.classList.remove('active')
    reiniciarPartida.classList.remove('active')
    tienda.classList.remove('active')
    this.classList.toggle('active')
    }

    function randomInt(min, max)
    {
    return Math.round(Math.random() * (max- min) + min )
}


function battleLogFunc(string) {
    textoBatalla.innerText = '' 
    
    battleLog.push(string) 
    

    
    textoBatalla.innerText = battleLog.join('\n') 
    
    setTimeout(function() {
    textoBatalla.scrollTo({
        top: textoBatalla.scrollHeight,
        behavior: 'smooth'
    }) 
    }, 500) 
}

function battleAuxFunc(string){
    infoAux.innerText = ''
    battleAux.unshift (string)

    infoAux.innerText = battleAux.join('\n')
    infoAux.scrollTo({
        top: textoBatalla.scrollHeight,
        behavior:'smooth'
    })
}
//Combat Funcitons
function ataqueNormal(hitChance,victima ,victimario) {
    let dado = randomInt(0, 100) 
    console.log(`resultado del dado: ` + dado) 
    if (dado > hitChance) {
    battleLogFunc( `-${victimario[0].name } genera un ataque de tipo Fisico, no pierde puntos de energia`) 
    recibirAtaque(7,15, victima,)
 
    } else {
    let dado2 = randomInt(0, 100) 
    console.log(`resultado del dado: ` + dado2) 
    if (dado2 < 50) {
        battleLogFunc(`-¡El ataque ha fallado!`) 
    }
    }
}


function curarse (victima) {
    if (pociones.cantidad !== 0) {
        battleLogFunc(`-${victima[0].name} recibe ${pociones.vidaCurada} puntos de vida por una pocion.`) 
        victima[0].stats[0].base_stat +=  pociones.vidaCurada 
        pociones.cantidad -= 1 
        battleAuxFunc(`-Quedan ${pociones.cantidad} pociones.`) 
    } else {
        battleLogFunc(`-No quedan mas pociones...`) 
    }
}


function ataqueEspecial(hitChance, victima, victimario) {
    let dado = randomInt(0, 100) 
    console.log(`resultado del dado2: ` + dado) 
    if (dado > hitChance) {
        let energiaPerdida = randomInt(15,30) 
        battleLogFunc(`-${victimario[0].name} Utiliza ${victimario[0].abilities[0].ability.name} Pierde ${energiaPerdida} puntos de energia`) 
        victimario[0].stats[1].base_stat -= energiaPerdida 
        recibirAtaque(20,28, victima)
    } else {
        battleLogFunc(`-¡El ataque ha fallado!`) 
    }
}

function recibirAtaque(min, max, victima ) {
    let danoRecibido = randomInt(min, max) 
    battleLogFunc(`-${victima[0].name} recibe un ataque con un daño de ${danoRecibido}`) 
    victima[0].stats[0].base_stat -= danoRecibido 
}