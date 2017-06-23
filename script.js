$(document).ready(function() {

	$(".input-container").hide();

	// Initialize Firebase
    var config = {
      apiKey: "AIzaSyBKSGxNhb2LEZeI4U7nwl8Jb8WpP7t6VnI",
      authDomain: "mush-52d46.firebaseapp.com",
      databaseURL: "https://mush-52d46.firebaseio.com",
      projectId: "mush-52d46",
      storageBucket: "foodapp-39e77.appspot.com",
      messagingSenderId: "755973008880"
    };

    // var firebase = new Firebase("https://foodapp-39e77.firebaseio.com");

    firebase.initializeApp(config);
    

  var provider = new firebase.auth.GoogleAuthProvider();

  $(".login").click(function() {
      console.log("my name is gt", firebase);

    document.getElementById("login").style.visibility = "hidden";
    document.getElementById("logout").style.visibility = "show";

  firebase.auth().signInWithPopup(provider).then(function(result) {
    console.log("hey what's up!");
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
    }).catch(function(error) {
      // Handle Errors here.
      console.log("firebase errror heress", error)
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      });

    $(".logout").click(function() {
                location.reload();
      console.log("logging out", firebase);

      // document.getElementById("login").style.visibility = "show";
      // document.getElementById("logout").style.visibility = "hidden";

      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
    });
  });

	var ingredients = [];
	var ingredientCount = 0;
	var recipe = [];
	var recipeCount = 0;

//Submit ingredients or search for a recipe. Toggle.
	$("#find-recipe-btn").on("click", function () {
		$(".ingredient-search").hide();
		$(".recipe-search").show();
		$(".input-container").show();
		$("#search-result").hide();
	});

	$("#find-ingredient-btn").on("click", function () {
		$(".recipe-search").hide();
		$(".ingredient-search").show();
		$(".input-container").show();
		$("#search-result").hide();
	});

	//Hide search results.
	$(".meals").hide();

	//To submit a list of user ingredients.
	$(".submit-ingredient").on("click", function(){
		var ingredientInput = $("#ingredient-input").val().trim();
		ingredients.push(ingredientInput);
		var pIngredient = $("<p>").text(ingredientInput);
		ingredientCount++;
		// NEED TO FIGURE OUT A WAY TO KEEP THE INGREDIENT COUNT FROM INCREASING BY ONE WHEN NO TEXT IS ENTERED UPON SUBMIT.
		console.log(ingredientCount);
		console.log(ingredients);

		var ingredientsSearchUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients=";
		var ingredientsSearchKey = "&number=1&limitLicense=false&fillIngredients=true&ranking=1&limitLicense=false&mashape-key=ksQNPjlaz5mshWX43x5882DMHPUtp1ynBxNjsnjPXrtU69MEyX";
		

		if (ingredientInput === "") {
			console.log("Please choose at least one ingredient.");
		} else if (ingredientCount === 6) {
			$("#ingredient-input").val("");
			console.log("No more.")

		} else {
			$(".ingredient-list").append(pIngredient);
			$("#ingredient-input").val("");

			// This will be where we will put the objects from the array.
			var ingredientsQueryUrl = ingredientsSearchUrl;
		};

	});

	$(".submit-all").one("click", function(){
		$(".input-container").hide();
		$("#search-result").show();
		var allIngredients = $(".ingredient-list").val().trim();
		console.log(allIngredients);

		//First part
		var fridgeSearchUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients=";

		//Second part
		var fridgeSearchKey = "&number=10&limitLicense=false&fillIngredients=true&ranking=1&limitLicense=false&mashape-key=ksQNPjlaz5mshWX43x5882DMHPUtp1ynBxNjsnjPXrtU69MEyX";

		var ingredientsOutput = ingredients.join('%2C');

		var url = fridgeSearchUrl + ingredientsOutput + fridgeSearchKey;

		//Ajax call for the image.
		$.ajax({
			url: url,
			data: {
				ingredients: ingredientsOutput,
				number: 10,
				method: "GET"
			}
			
		}).done(function(response) {
		

			// For loop to run through all of the objects in the array.
			for (var i = 0; i < response.length; i++) {
				var fridgeImage = response[i].id;
				var recipeInput = response[i].id;
				var dataId = response[i].id;
				//var mealurl = "recipepage.html?id=" + response[i].title;

				var resultID = `tab-${i}`;
	        	var titleID = `title-${i}`;
	        	var linkID = `link-${i}`;
	        	var imageID = `image-${i}`;

	        	var thisResult = `
		          <div class="tabpanel tab-pane active" id="panel-${i}">
			          <div class="row masonry-container">
				          <div class="col-md-4 col-sm-6 item">
		                			<div class="thumbnail">
		                        		<div class="caption">      				                          
		                                        <h3 id="title-${i}"></h3>
		                                  <a class="clickpart${i}" id="${linkID}" href="#">
		                                  <img id="${imageID}" /> 
		                                  </a>
		                        </div>
		                    </div>
		                </div>
		              </div>
		            </div>
		        `;
		        $("#search-result").append(thisResult);

		        $('#image-'+i).attr("src", response[i].image);
		        $(".clickpart"+i).attr("dataId", dataId).attr("title", response[i].title);
		        console.log(response[i].title);
		        $('#title-'+i).text(response[i].title);

			};


		});

		nextPage();

	});

	//To search a desired recipe.
	$(".submit-recipe").one("click", function(){
		$(".input-container").hide();
		$("#search-result").show();

		var recipeInput = $("#recipe-input").val().trim();
		recipe.push(recipeInput);

		// Second part of the URL
		var recipeSearchKey = "&mashape-key=ksQNPjlaz5mshWX43x5882DMHPUtp1ynBxNjsnjPXrtU69MEyX";
		//First part
		var recipeSearchUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?number=10&limitLicense=false&query=" + recipeInput + recipeSearchKey;

		var imagesUrl = "https://spoonacular.com/recipeImages/"


		//Make ajax call and dynamically create the divs using jQuery and string interpolation.
		$.ajax ({
			url: recipeSearchUrl,
			number: 10,
			method: "GET"
		}).done(function(response) {
		console.log(response);

			for (var i = 0; i < 10; i++) {
				var fridgeImage = response.results[i].id;
				var recipeInput = response.results[i].id;
				var imagesFileName = response.results[i].image;
				var dataId = response.results[i].id;

				var actualImage = imagesUrl + imagesFileName;
				
				//var mealurl = "recipepage.html?id=" + response.results[i].title;

				var resultID = `tab-${i}`;
	        	var titleID = `title-${i}`;
	        	var linkID = `link-${i}`;
	        	var imageID = `image-${i}`;

	        	var thisResult = `
		          <div class="tabpanel tab-pane active" id="panel-${i}">
			          <div class="row masonry-container">
				          <div class="col-md-4 col-sm-6 item">
		                			<div class="thumbnail">
		                        		<div class="caption">      				                          
		                                        <h3 class="test-${i}" id="title-${i}"></h3>
		                                  <a class="clickpart${i}" id="${linkID}" href="#">
		                                  <img id="${imageID}" /> 
		                                  </a>
		                        </div>
		                    </div>
		                </div>
		              </div>
		            </div>
		        `;
		        $("#search-result").append(thisResult);

		       
				$('#image-'+i).attr("src", actualImage);
				$(".clickpart"+i).attr("dataId", dataId).attr("title", response.results[i].title);

		        $('.test-'+i).text(response.results[i].title);
		        console.log(response.results[i].title);
		        // console.log(".test"+i);
		        // $('#title-'+i).text(response.results[i].title);

			};
		});

		nextPage();
	})
});

function nextPage() {

	//When the image on the main page is clicked...
	$(document).on("click", "a", function() {

		var nextInput = $(this).attr("dataId");
		console.log(this);
		console.log("test 1  " + nextInput);

	    var nextUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/";
	    var nextKey = "/analyzedInstructions?stepBreakdown=false&mashape-key=ksQNPjlaz5mshWX43x5882DMHPUtp1ynBxNjsnjPXrtU69MEyX";
	    var queryNextURL = nextUrl + nextInput + nextKey;

	    $.ajax({
	        url: queryNextURL,
	        method: "GET"

	    }).done(function(response) {
	    	var outputArray = response[0].steps.length;
	    	console.log(outputArray);
	    	for (i = 0; i < outputArray; i++) {
	        	var directions = response[0].steps[i].step;
	        	console.log(directions);

	        	$(".prep-data").append(directions);
	        }

	    });

	    var input = $(this).attr("dataId");
	    var sum = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/"
	    var sumKey = "/summary?mashape-key=ksQNPjlaz5mshWX43x5882DMHPUtp1ynBxNjsnjPXrtU69MEyX";
	    var sumUrl = sum + input + sumKey;

	    $.ajax({
	        url: sumUrl,
	        method: "GET"

	    }).done(function(response) {
	    	console.log(response.summary);
	    	var recipeSummary = response.summary;
	    	
	        $(".summary-data").append(recipeSummary);
	    });


	    var input = $(this).attr("title");
	  	var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&type=video+&videoDefinition=high&q=recipe+";
	  	var key = "&key=AIzaSyCa701vEr4W6GgdvKdjZmmIrSS9EHffEIs"
	  	console.log("Youtube input ID" + input);

	  	var queryURL = url + input + key;
	  	$.ajax({
	        url: queryURL,
	        method: "GET"
	      
	    }).done(function(response) {

	        var resultInput = response.items[0].id.videoId;
	       
	        var vPlayer = $('<iframe width="1160" height="500" src="https://www.youtube.com/embed/' + resultInput + '"frameborder="0" allowfullscreen></iframe>');
	        $(".food-image").html(vPlayer);
	        $(".title-result").text(input);
	        console.log(input);
	    });
	    $("#search-result").hide();
	    $(".meals").show();
	});

}