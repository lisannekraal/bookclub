

//accordion
const accordion = document.getElementById("accordion");

function initAccordion(accordionElem){

    //for every element in this row, a default panel is created

    //when panel is clicked, handlePanelClick is called.          
    function handlePanelClick(event){
        if (event.currentTarget.parentElement.classList.contains("active")) {
            hidePanel(event.currentTarget.parentElement);
        } else {
            showPanel(event.currentTarget.parentElement);
        }
    }
  
  //show new panel & hide current one    
    function showPanel(panel){
      //Hide current one. First time it will be null. 
       var expandedPanel = accordionElem.querySelector(".active");
       if (expandedPanel){
           expandedPanel.classList.remove("active");
       } 
       //Show new one
       panel.classList.add("active");
       //set source of audio player
       var trackNumber = panel.querySelector(".acc-header").innerHTML;
       panel.querySelector(".js-player").innerHTML = `<source src="/audio/${trackNumber}">`
       console.log(panel.querySelector(".js-player").innerHTML);
    }

    function hidePanel(panel){
        panel.classList.remove("active");
        panel.querySelector(".js-player").innerHTML = '<source src="defaultsource">';
    }
    
    //loop over the panels to create event listeners that fire the function
    var allPanelElems = accordionElem.querySelectorAll(".panel");
    var allHeaderElems = accordionElem.querySelectorAll(".acc-header");
    for (var i = 0, len = allHeaderElems.length; i < len; i++){
        allHeaderElems[i].addEventListener("click", handlePanelClick);
    }
    //By Default Show first panel
    //showPanel(allPanelElems[0])
}

initAccordion(accordion);
