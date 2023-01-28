 
$(document).ready(function(){
  
  //Global information variables
  var item_array = [["fire",false],["bed",false],["barrel",false],["bow",false]];

  //Set textarea variable
  var $textarea = $('#gametext');
  $('[data-toggle="tooltip"]').tooltip();

  //Write to textarea function, scrolls and leaves a new line
  function print(text){
    $("#gametext").append(text);
    $textarea.scrollTop($textarea[0].scrollHeight);
    $("#gametext").append("\r\n");
  }
  // Update time function
  function UpdateTime(a) {
    $("#time").text(Number($("#time").text()) + a);

    //Check if it is time to sleep
    if (Number($("#time").text())>= 23) {
      $("#leave_shelter").hide();
      $("#scavenge_wood").hide();
      $("#scavenge_components").hide();
      $("#sleep").show();

      $("#sleep").click(function() {
        $("#leave_shelter").show();
        $("#time").text(6);
        $("#sleep").hide();
        $("#scavenge_wood").show();
        $("#scavenge_components").show();
      });

      }
    }
      //Kill game function
    function Killgame(){
      $( "#gametext" ).hide();
      $( "button" ).hide();
    }

  // Update Status bar function
  /* a - health
     b - food
     c - water
     d - mood
  */
  function UpdateStatus(a,b,c,d) {

    $("#health").text(Number($("#health").text())+a);
    $("#food").text(Number($("#food").text())+b);
    $("#water").text(Number($("#water").text())+c);
    $("#mood").text(Number($("#mood").text())+d);
    
    //checking if player has died
    if ($("#health").text() <= 0){
      alert("The wilderness has taken a heavy toll on your health. You breathe your last breath under the shade of an oak tree.");
      Killgame();
     }
    else if ($("#food").text() <= 0){
      alert("You die of starvation.");
      Killgame();
    }
    else if ($("#water").text() <= 0){
      alert("You die of thirst.");
      Killgame();
    }
    else if ($("#mood").text() <= 0){
      alert("You lose your mind and start running aimlessly. You attract the attention of a bear, which mauls you to death");
      Killgame();
    }
  }

// Update resources
  function UpdateResources(resource,amount) {
    Number($(resource).text(Number($(resource).text()) + amount));
    var x = $(resource).text();
    if (x < 0){
      $(resource).text(Number($(resource).text()) - amount);
      return "failed";
    }
  }

  // Scavenging wood and components
  $("#scavenge_wood").click(function(){
    UpdateResources("#wood",5);
    UpdateStatus(0,-1,-1,0);
    UpdateTime(2);
    print("You look around for any useful bits of wood");
  });

  $("#scavenge_components").click(function(){
    UpdateResources("#components",Math.floor(Math.random() * 4));
    UpdateStatus(0,-1,-1,0);
    UpdateTime(2);
    print("You search the woods for mechanical parts");
  });

// Hunting
  $("#hunt").click(function() {
    $("#hunt").hide();
    UpdateTime(3);
    if (item_array[3][1] == true){
      UpdateResources("#raw_food",10);
      UpdateStatus(0,-1,-1,0);
      print("Using your equipment you manage to kill some small creatures");
    }
    else {
      UpdateResources("#raw_food",2);
      UpdateStatus(0,-2,-2,0);
      print("You try to hunt small animals around the forest. You are very slow and fail to catch any significant prey while exhausting yourself. Perhaps crafting some equipment might help... ");
    }
    Leave_Screen();
  })

  function Leave_Screen() {
    $("#find_food").show();
    $("#find_water").show();
    $("#explore_woods").show();
    $("#go_back").show();
  }

  //Leaving the shelter
  $("#leave_shelter").click(function() {
    $("button").hide();
    Leave_Screen();
  });

 //Going back
  $("#go_back").click(function() {
    $("button").hide();
    $("#leave_shelter").show();
    $("#scavenge_wood").show();
    $("#scavenge_components").show();
    $("#craft").show();
  })

  //Food Search
  $("#find_food").click(function(){
    $("button").hide();
    $("#hunt").show();
    $("#plant_matter").show();
  })
 //Water Search
  $("#find_water").click(function() {
    if (item_array[2][1] == true){
      $("button").hide();
      $("#collect_river").show();
    }
    else {
      $("button").hide();
      $("#drink_river").show();
    }
  })

  // Beginning work on crafting
  class Craftable {
    constructor(perequisite, resources, number_res, time, benefits, benefits_num, per_avail){
      this.perequisite= perequisite;
      this.resources = resources;
      this.number_res = number_res;
      this.time = time;
      this.benefits = benefits;
      this.benefits_num = benefits_num;
      this.per_avail = per_avail;
    }
    make_available(){
      var i;
      for (i =0; i < item_array.length; i++){
        if (item_array[i][0]== this.per_avail){
          item_array[i][1] = true;
        }
      }
    }
    check_resources(){
      var i;
      for (i=0; i < this.resources.length; i++){
        if (Number($(this.resources[i]).text()) < this.number_res[i]){
          return "failed";
        }
      }
    }

    remove_resources(){
      var i;
      for (i=0; i < this.resources.length; i++){
        UpdateResources(this.resources[i] , -(this.number_res[i]));
      }
    }

    update_time(){
      UpdateTime(this.time);
    }

    update_benefits(){
      var i;
      for (i=0; i < this.benefits.length; i++){
        $(this.benefits[i]).text(Number($(this.benefits[i]).text())+ this.benefits_num[i]);
    }
    }
  }

  function Craft(item){
    if (item.perequisite != false){
      if (item.check_resources() != "failed"){
        item.update_time();
        item.update_benefits();
        item.remove_resources();
        item.make_available();
        $('#CraftingModal').modal('hide');
      }
      else {
        alert("You do not have enough resources to build this!");
      }
    }
    else {
      alert("You do not have the perequisite item/s to build this!");
    }
  }

  fireplace = new Craftable(null,["#wood","#components"],[20,10],3,["#food","#water"],[5,10],"fire");
  $("#firebutton").click(function(){
    Craft(fireplace);
  });
});
