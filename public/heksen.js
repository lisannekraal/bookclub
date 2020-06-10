

//accordion
const accordion = document.getElementById("accordion");

function initAccordion(accordionElem){

    //when panel is clicked, handlePanelClick is called.          
    function handlePanelClick(event){
        if (event.currentTarget.classList.contains("active")) {
            hidePanel(event.currentTarget);
        } else {
            showPanel(event.currentTarget);
        }
    }
  
  //Hide currentPanel and show new panel.    
    function showPanel(panel){
      //Hide current one. First time it will be null. 
       var expandedPanel = accordionElem.querySelector(".active");
       if (expandedPanel){
           expandedPanel.classList.remove("active");
       } 
       //Show new one
       panel.classList.add("active");
    }

    function hidePanel(panel){
        panel.classList.remove("active");
    }
    
    //loop over the panels to create event listeners that fire the function
    var allPanelElems = accordionElem.querySelectorAll(".panel");
    for (var i = 0, len = allPanelElems.length; i < len; i++){
         allPanelElems[i].addEventListener("click", handlePanelClick);
    }
  
    //By Default Show first panel
    showPanel(allPanelElems[0])
}

//call the function so it is in use
initAccordion(accordion);



//WISHLIST
//try adding speed options (js-28)