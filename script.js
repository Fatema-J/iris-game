//Global variables
let gameboard = document.querySelector('.gameboard')
const N = 25
let elements = document.querySelectorAll('.element')
let placeHolders = document.querySelectorAll('.element-placeholder')
//[brownish, brownish, greenish, pale blue, light purple]
// let colors = ['#E8CCBF', '#a9cfa5', '#81968F', '#96BDC6', '#E9D6EC']
let colors = ['./images/cat1.png', './images/cat2.png', './images/cat3.png', './images/cat4.png', './images/cat5.png']

let chosenElement = [Infinity, Infinity]
let steps = Math.sqrt(elements.length)
let pointsTag = document.querySelector("#points")
let points = 0
let swapped = false
//Functions


// Randomly color the elements

const generateRandomColors = () => {
  elements.forEach((element) => {
  element.setAttribute("src", generateRandomColor()) 
})
  stopMatchesInField()
}




const swapElements = (chosenArray) => {
  if(isMatched(chosenArray)){
    
    let tempColor = elements[chosenArray[0]].getAttribute("src")

    elements[chosenArray[0]].setAttribute("src", elements[chosenArray[1]].getAttribute("src")) 
  
    elements[chosenArray[1]].setAttribute("src", tempColor)

    swapped = true
    increasePoints(findAllMatches().length)

    clearMatches(findAllMatches())

    chosenElement = [Infinity, Infinity]
  }

  chosenElement = [Infinity, Infinity]
}



const isMatched = (chosenArray) => {
  let i0 = chosenArray[0]
  let i1 = chosenArray[1]
  let firstColor = elements[i0].getAttribute("src")
  let secondColor = elements[i1].getAttribute("src")


  /** [ 0 , i1, 0]
   *  [ 0 , i0, 0]
   *  [ 0 , 0 , 0]
   * check right , left, up, between horizontal
  */
  if(i0 == i1+steps){ 
    if(checkAround(i1, firstColor, 1, 2) ||
    checkAround(i1, firstColor, -1, -2) ||
    checkAround(i1, firstColor, -steps, -steps*2) ||
    checkAround(i1, firstColor, -1, 1) ){
      return true
    }
    if(checkAround(i0, secondColor, 1, 2) ||
    checkAround(i0, secondColor, -1, -2) ||
    checkAround(i0, secondColor, steps, steps*2) ||
    checkAround(i0, secondColor, -1, 1) ){
      return true
    }
  }

  /** [ 0 , 0 , 0]
   *  [ i1, i0, 0]
   *  [ 0 , 0 , 0]
   * check left, up, down, between vertical
  */  
  if(i0 == i1+1){
    if( checkAround(i1, firstColor, -1, -2) ||
    checkAround(i1, firstColor, -steps, -steps*2) ||
    checkAround(i1, firstColor, steps, steps*2) || 
    checkAround(i1, firstColor, -steps, steps)){
      return true
    }
    if( checkAround(i0, secondColor, 1, 2) ||
    checkAround(i0, secondColor, -steps, -steps*2) ||
    checkAround(i0, secondColor, steps, steps*2) || 
    checkAround(i0, secondColor, -steps, steps)){
      return true
    }
  }

  /** [ 0 , i0, 0]
   *  [ 0 , i1, 0]
   *  [ 0 , 0 , 0]
   * check right , left, down, between horizontal
  */
  if(i1 == i0+steps){ 
    if(checkAround(i1, firstColor, 1, 2) ||
    checkAround(i1, firstColor, -1, -2) ||
    checkAround(i1, firstColor, steps, steps*2) ||
    checkAround(i1, firstColor, -1, 1) ){
      return true
    }
    if(checkAround(i0, secondColor, 1, 2) ||
    checkAround(i0, secondColor, -1, -2) ||
    checkAround(i0, secondColor, -steps, -steps*2) ||
    checkAround(i0, secondColor, -1, 1) ){
      return true
    }
  }

  /** [ 0 , 0 , 0]
   *  [ i0, i1, 0]
   *  [ 0 , 0 , 0]
   * check right, up, down, between vertical
  */  
  if(i1 == i0+1){
    if( checkAround(i1, firstColor, 1, 2) ||
    checkAround(i1, firstColor, -steps, -steps*2) ||
    checkAround(i1, firstColor, steps, steps*2) || 
    checkAround(i1, firstColor, -steps, steps)){
      return true
    }
    if( checkAround(i0, secondColor, -1, -2) ||
    checkAround(i0, secondColor, -steps, -steps*2) ||
    checkAround(i0, secondColor, steps, steps*2) || 
    checkAround(i0, secondColor, -steps, steps)){
      return true
    }
  }

  console.log('no match: up, down, left or right')
  return false
}

const checkAround = (i1, color, adj1, adj2) =>{
  try {
    if (color === elements[i1 + adj1].getAttribute("src")) {
  
      if (color === elements[i1 + adj2].getAttribute("src")) {
        return true
      }
    }
    return false
  } catch (error) {
    console.log("undefined")
    return false
  }
  
}

const findAllMatches =() =>{
  elements = document.querySelectorAll('.element') //update elements

  let elementsToBeCleared = []
  let rowTracer = 1
  let colTracer = 1
  for(let i = 0; i<steps; i++){
    //initial colors
    let rowColor = elements[i*steps].getAttribute("src")
    let colColor = elements[i].getAttribute("src")

    for(let j = 1; j<steps; j++){
      
      //horizontally
      if(elements[i*steps+j].getAttribute("src") === rowColor){
        rowTracer++

        if(j == steps-1){ //last item in the row
          if (rowTracer >= 3){
            for(let previous = 0 ; previous < rowTracer; previous++){
              // indicate the previous matching cells
              elementsToBeCleared.push(i*steps+j-previous)
            }
          }
          rowTracer = 1
        }
      } else{
        if (rowTracer >= 3){
          for(let previous = 0 ; previous < rowTracer; previous++){
            elementsToBeCleared.push(i*steps+j-previous-1)
          }
        }
        rowTracer = 1
        rowColor = elements[i*steps+j].getAttribute("src")
      }

      if(elements[j*steps+i].getAttribute("src") === colColor){
        colTracer++

        if(j== steps-1){
          if(colTracer >= 3){
            for(let t = 0 ; t < colTracer; t++){
              previousPos = (t)*steps        
              elementsToBeCleared.push(j*steps+i-previousPos)
            }
          }
          colTracer = 1
        }
      } else{
        if(colTracer >= 3){
          for(let t = 0 ; t < colTracer; t++){
            previousPos = (t+1)*steps
            elementsToBeCleared.push(j*steps+i-previousPos)
          }
        }
        colTracer = 1
        colColor = elements[j*steps+i].getAttribute("src")
      }

    } // end for loop j
  } // end for loop i
  console.log("cells to be cleared: ", elementsToBeCleared);
  return elementsToBeCleared
}


const clearMatches = (array) => {
  for(let i = 0; i<array.length; i++){
    elements[array[i]].style.opacity = 0
  }
  dropElements(array)
}


/* shifts existing elements to down and generate new ones*/ 
const dropElements =(array) =>{

  for(let row = 0; row<steps; row++){
    let emptyCounter = 0
    let firstEmpty = -1
    
    for(let col = 0; col<steps; col++){
      
      if(isEmpty(col*steps+row)){
        firstEmpty = col*steps+row //to know the first empty element on the column
        emptyCounter++
      }
      
      if(col === steps-1){ //last element
        //start shifting
        for(let i = 0 ; i< steps; i++){
          if(firstEmpty<0){
            break
          }
          let shiftValue = emptyCounter*steps
          if(firstEmpty-shiftValue >= 0){ // there is upper element
            shiftElements(firstEmpty, shiftValue)
            dropAnimation(firstEmpty)
          } else{ // no upper elements, generate new colors
            elements[firstEmpty].setAttribute("src", generateRandomColor())
            elements[firstEmpty].style.opacity = 1
            dropAnimation(firstEmpty)
          }
          firstEmpty -= steps
        } //dropping new elements loop
      } // last element condition
    } //col loop
    console.log('------------------');
  } // row loop
  stopMatchesInField()
} // function end


const isEmpty = (position) =>{
  return elements[position].style.opacity === "0"
}


const stopMatchesInField = () =>{

  let matchesArray = findAllMatches()
  // check generated field doesn't have any matches
  while(matchesArray.length !== 0){
    //give points while the player swapped element and it generated new matches
    if(swapped){
      increasePoints(findAllMatches().length)
    }
    console.log('generated field contain matches!!');
    clearMatches(findAllMatches())
    matchesArray = findAllMatches()
  }
  swapped = false
}

const shiftElements = (position, shiftValue) => {
  elements[position].setAttribute("src", elements[position-shiftValue].getAttribute("src"))
  
  elements[position].style.opacity = elements[position-shiftValue].style.opacity
}


const generateRandomColor = () =>{
  let randomInt = Math.floor(Math.random() * colors.length)
  return colors[randomInt]
}


const dropAnimation = (position) =>{
  elements[position].classList.add("animate__animated", "animate__slideInDown")
  elements[position].addEventListener('animationend', () => {
    elements[position].classList.remove("animate__animated", "animate__slideInDown")
  });
}



const increasePoints = (matchedElementsCount) => {
  points += 10*matchedElementsCount
  pointsTag.innerHTML = points
}

//event handlers

generateRandomColors()

elements.forEach((element, index) => {
  element.addEventListener('click', () => {
    if (chosenElement[0] === Infinity) {
      chosenElement[0] = index
    } else if (chosenElement[1] === Infinity) {
      chosenElement[1] = index
      swapElements(chosenElement)
    }
  })
})
