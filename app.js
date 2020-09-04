//DOM OBJETS

//Left side

const mainScreen = document.querySelector(".main-screen");
const pokeName = document.querySelector(".poke-name");
const pokeId = document.querySelector(".poke-id");
const pokeFrontImage = document.querySelector(".poke-front-image");
const pokeBackImage = document.querySelector(".poke-back-image");
const pokeTypeOne = document.querySelector(".poke-type-one");
const pokeTypeTwo = document.querySelector(".poke-type-two");
const pokeHeight = document.querySelector(".poke-height");
const pokeWeight = document.querySelector(".poke-weight");
//rigth side

const pokeListItems = document.querySelectorAll(".list-item");
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button");

//types
const TYPES =[
  "normal", "fighting", "flying","poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass","electric", "psychic", "ice", "dragon", "dark", "fairy" ];
let prevUrl = null;
let NexUrl = null;



//Funtions

//Change the first letter to UP of pokeNAme
const capitalize = (String) => String[0].toUpperCase() + String.substring(1);


//Delete background colortype after change the id
const resetScreen = () =>{
  mainScreen.classList.remove("hide");
  for (const type of TYPES){
    mainScreen.classList.remove(type)
  }

};

//buttons
const fetchPokeList = url => {
  fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    const { results, previous, next } = data;
    prevUrl = previous;
    NexUrl = next;

    for ( let i = 0; i < pokeListItems.length; i ++){
      const pokeListItem = pokeListItems[i];
      const resultData = results[i];
      
      if (resultData) {
        const {name, url} = resultData;
        const urlArray = url.split("/");
        const id = urlArray[urlArray.length -2];
        pokeListItem.textContent = id + "." + capitalize(name);
      } else{
        pokeListItem.textContent ="";
      }
    }
    
  });
};

const fetchPokeData = id =>{
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  .then(res =>  res.json() )
  .then(data =>{
      
resetScreen();

//Pokemon type displays in the contariner
      const dataTypes = data["types"];
      const dataFirstType = dataTypes[0];
      const dataSecondType = dataTypes[1];
     pokeTypeOne.textContent = capitalize(dataFirstType["type"]["name"]);
     if (dataSecondType) {
      pokeTypeTwo.classList.remove("hide");

       pokeTypeTwo.textContent = capitalize (dataSecondType["type"]["name"]);
     } else{
       pokeTypeTwo.classList.add("hide");
       pokeTypeTwo.textContent ="";
     }

     mainScreen.classList.add(dataFirstType["type"]["name"])


//This display the data in main screan
      pokeName.textContent = capitalize(data["name"]);
      pokeId.textContent = "#" + data["id"].toString().padStart(3, "0");
      pokeWeight.textContent = data["weight"];
      pokeHeight.textContent = data["height"];


      pokeFrontImage.src = data["sprites"]["front_shiny"] || "";
      pokeBackImage.src = data["sprites"]["back_shiny"] || "";


      
  });
} 

const handlerLeftButtonClick = () => {
  if(prevUrl){
    fetchPokeList(prevUrl);
  }
}

const handlerRighButtonClick = () => {
  if (NexUrl) {

    fetchPokeList(NexUrl);
  }
}

const handlerListItemClick = (e) => {
  if(!e.target) return;
  const listItem = e.target;
  if(!listItem.textContent) return;
  const id = listItem.textContent.split(".")[0];
  fetchPokeData(id)

}



//ADD EVENTS LISTENERS
leftButton.addEventListener("click", handlerLeftButtonClick);
rightButton.addEventListener("click",handlerRighButtonClick);
for(const pokeListItem of pokeListItems) {
  pokeListItem.addEventListener("click", handlerListItemClick)
}

//INITIALIZE APP
fetchPokeList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20") 